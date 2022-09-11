const cat = document.getElementById("cat");
const canvas = document.querySelector("#canvas");

const widthOfSpriteSheet = 1770;
const widthOfEachSprite = 295;
const heightOfEachSprite = 453;

// boundaries for limiting the cat from exiting the field area for 2.5D effect
const yMaxTop = 1100;
const yMaxBottom = 1500;
const xMaxLeft = 550;
const xMaxRight = 3300;

// min height and width when furthest away in the 2.5d plane
const minHeight = heightOfEachSprite / 3;
const minWidth = widthOfEachSprite / 3;

// current dimensions of the cat
var currHeight;
var currWidth;

// differece in x and y pos and x and y cat to cause animation
const clickThreshold = 10;

var clickY = Math.random() * (yMaxBottom - yMaxTop + 1) + yMaxTop;
var clickX = Math.random() * (xMaxRight - xMaxLeft + 1) + xMaxLeft;

// position the center of the cat will move to
var xPos;
var yPos;

// position of the center of the cat itself
var xCat;
var yCat;

// distance of the canvase top and left border from the top and left border of the browser
var parentPosition;

var animationInterval;

document.addEventListener("DOMContentLoaded", startAnimation);

canvas.addEventListener("click", getClickPosReal, false);

function getClickPosReal(e) {
    clickX = e.clientX;
    clickY = e.clientY;
    if (clickY < yMaxTop) {
        clickY = yMaxTop;
    } else if (clickY > yMaxBottom){
        clickY = yMaxBottom;
    }

    if (clickX < xMaxLeft) {
        clickX = xMaxLeft;
    } else if (clickX > xMaxRight) {
        clickX = xMaxRight;
    }

    parentPosition = getPosition(canvas);
    xCat = getOffset(cat).left - parentPosition.x;
    yCat = getOffset(cat).top - parentPosition.y;
    xPos = clickX - parentPosition.x - (currWidth / 2);
    yPos = clickY - parentPosition.y - (currHeight / 2);

    if (xCat > xPos) {
        cat.style.backgroundImage = "url(./images/Left_cat_sprite_sheet.png)";
    }else{
        cat.style.backgroundImage = "url(./images/Right_cat_sprite_sheet.png)";
    }
}

// helper function to get an element's exact position
function getPosition(el) {

    var xPosition = 0;
    var yPosition = 0;

    while (el) {
        if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var xScrollPos = el.scrollLeft || document.documentElement.scrollLeft;
            var yScrollPos = el.scrollTop || document.documentElement.scrollTop;

            xPosition += (el.offsetLeft - xScrollPos + el.clientLeft);
            yPosition += (el.offsetTop - yScrollPos + el.clientTop);
        } else {
            xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return {
        x: xPosition,
        y: yPosition
    };
}

function startAnimation() {
    var position = widthOfEachSprite; // start position for the image
    const speed = 75; // in millisecond(ms)
    var diff = 0; // difference between two sprites

    // Strings for css modification
    let sheetWidthValue;
    
    parentPosition = getPosition(canvas);
    xCat = getOffset(cat).left - parentPosition.x;
    yCat = getOffset(cat).top - parentPosition.y;

    currHeight = (heightOfEachSprite * (yCat - yMaxTop) / (yMaxBottom - yMaxTop)) + minHeight;
    currWidth = (widthOfEachSprite * (yCat - yMaxTop) / (yMaxBottom - yMaxTop)) + minWidth;
    cat.style.width = currWidth + "px";
    cat.style.height = currHeight + "px";

    animationInterval = setInterval(() => {

        xCat = getPosition(cat).x - parentPosition.x;
        yCat = getPosition(cat).y - parentPosition.y;

        xPos = clickX - parentPosition.x - (currWidth / 2);
        yPos = clickY - parentPosition.y - (currHeight / 2);

        console.log("xCat, yCat", xCat, yCat);
        console.log(xPos, yPos);

        if (Math.abs(xCat - xPos) > clickThreshold || Math.abs(yCat - yPos) > clickThreshold) {
            currHeight = (heightOfEachSprite * (yCat - yMaxTop) / (yMaxBottom - yMaxTop)) + minHeight;
            currWidth = (widthOfEachSprite * (yCat - yMaxTop) / (yMaxBottom - yMaxTop)) + minWidth;

            position = currWidth * diff;

            sheetWidthValue = (widthOfSpriteSheet * (yCat - yMaxTop) / (yMaxBottom - yMaxTop)) + (minWidth * 6);

            cat.style.left = xPos + "px";
            cat.style.top = yPos + "px";
            cat.style.backgroundSize = sheetWidthValue + "px " + currHeight + "px";
            cat.style.width = currWidth + "px";
            cat.style.height = currHeight + "px";

            cat.style.backgroundPosition = `-${position}px 0px`;

            // causes the animation
            if (position < sheetWidthValue) {
                // increment the position by the width of each sprite each time
                diff++;
                position = diff * currWidth;
            } else {
                // reset the position to show first sprite after the last one
                position = currWidth;
                diff = 0;
            }
        } else {
            cat.style.backgroundPosition = "0px 0px";
        }
    }, speed);
}
