const cat = document.getElementById("cat");
const canvas = document.querySelector("#canvas");

const widthOfSpriteSheet = 1770;
const widthOfEachSprite = 295;
const heightOfEachSprite = 453;

// boundaries for limiting the cat from exiting the field area for 2.5D effect
const yMax = 900;
const xMaxLeft = 550;
const xMaxRight = 3300;

var clickX = 1500 + getPosition(canvas).x + (widthOfEachSprite / 2);
var clickY = 1000 + getPosition(canvas).y + (heightOfEachSprite / 2);

var animationInterval;

document.addEventListener("DOMContentLoaded", startAnimation);

canvas.addEventListener("click", getClickPosReal, false);

function getClickPosReal(e) {
    clickX = e.clientX;
    clickY = e.clientY;
    if (clickY < yMax) {
        clickY = yMax;
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
    var position = widthOfEachSprite; //start position for the image
    const speed = 100; //in millisecond(ms)
    const diff = widthOfEachSprite; //difference between two sprites

    animationInterval = setInterval(() => {
        let parentPosition = getPosition(canvas);

        let xCat = getOffset(cat).left - parentPosition.x;
        let yCat = getOffset(cat).top - parentPosition.y;

        let xPos = clickX - parentPosition.x - (widthOfEachSprite / 2);
        let yPos = clickY - parentPosition.y - (heightOfEachSprite / 2);

        console.log(xCat, yCat);

        if (xCat != xPos || yCat != yPos) {
            let translate3DValue = "translate3d(" + xPos + "px, " + yPos + "px, 0)";

            cat.style.transform = translate3DValue;

            cat.style.backgroundPosition = `-${position}px 0px`;

            if (position < widthOfSpriteSheet) {
                position = position + diff;
            } else {
                //increment the position by the width of each sprite each time
                position = widthOfEachSprite;
            }
        } else {
            cat.style.backgroundPosition = "0px 0px";
        }
        //reset the position to show first sprite after the last one
    }, speed);
}


function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}
