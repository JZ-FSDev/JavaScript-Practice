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

const clickThreshold = 10;

var clickX = 1000;
var clickY = 1000;

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
    let parentPosition = getPosition(canvas);

    let xCat = getOffset(cat).left - parentPosition.x;
    let yCat = getOffset(cat).top - parentPosition.y;

    let xPos = clickX - parentPosition.x - (widthOfEachSprite / 2);
    let yPos = clickY - parentPosition.y - (heightOfEachSprite / 2);

    if (xCat > xPos) {
        cat.style.backgroundImage = "url(./images/Left_cat_sprite_sheet.png)";
    } else if (xCat < xPos) {
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
    const speed = 100; // in millisecond(ms)
    var diff = 0; // difference between two sprites
    
    let parentPosition = getPosition(canvas);
    let xCat = getOffset(cat).left - parentPosition.x;
    let yCat = getOffset(cat).top - parentPosition.y;

    var heightValue = (heightOfEachSprite * (yCat - yMaxTop) / (yMaxBottom - yMaxTop)) + minHeight;
    var widthValue = widthValue = (widthOfEachSprite * (yCat - yMaxTop) / (yMaxBottom - yMaxTop)) + minWidth;
    cat.style.width = widthValue + "px";
    cat.style.height = heightValue + "px";

    animationInterval = setInterval(() => {
        parentPosition = getPosition(canvas);

        xCat = getOffset(cat).left - parentPosition.x;
        yCat = getOffset(cat).top - parentPosition.y;

        let xPos = clickX - parentPosition.x - (widthValue / 2);
        let yPos = clickY - parentPosition.y - (heightValue / 2);

        console.log("xCat, yCat", xCat, yCat);
        console.log(xPos, yPos);

        if (Math.abs(xCat - xPos) > clickThreshold || Math.abs(yCat - yPos) > clickThreshold) {

            let translate3DValue = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
            heightValue = (heightOfEachSprite * (yCat - yMaxTop) / (yMaxBottom - yMaxTop)) + minHeight;
            widthValue = (widthOfEachSprite * (yCat - yMaxTop) / (yMaxBottom - yMaxTop)) + minWidth;
            let sheetWidthValue = (widthOfSpriteSheet * (yCat - yMaxTop) / (yMaxBottom - yMaxTop)) + (minWidth * 6);

            xPos = clickX - parentPosition.x - (widthValue / 2);
            yPos = clickY - parentPosition.y - (heightValue / 2);

            position = widthValue * diff;

            cat.style.transform = translate3DValue;
            cat.style.backgroundSize = sheetWidthValue + "px " + heightValue + "px";
            cat.style.width = widthValue + "px";
            cat.style.height = heightValue + "px";

            cat.style.backgroundPosition = `-${position}px 0px`;

            // causes the animation
            if (position < sheetWidthValue) {
                // increment the position by the width of each sprite each time
                diff++;
                position = diff * widthValue;
            } else {
                // reset the position to show first sprite after the last one
                position = widthValue;
                diff = 0;
            }
        } else {
            cat.style.backgroundPosition = "0px 0px";
        }
    }, speed);
}


function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}
