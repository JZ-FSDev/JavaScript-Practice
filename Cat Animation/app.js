const cat = document.getElementById("cat");
const canvas = document.querySelector("#canvas");

const widthOfSpriteSheet = 1770;
const widthOfEachSprite = 295;
const heightOfEachSprite = 453;

var animationInterval;

canvas.addEventListener("click", getClickPosition, false);

function getClickPosition(e) {
    let parentPosition = getPosition(canvas);

    let xCat = getOffset(cat).left - parentPosition.x;
    let yCat = getOffset(cat).top - parentPosition.y;


    let xPos = e.clientX - parentPosition.x - (widthOfEachSprite / 2);
    let yPos = e.clientY - parentPosition.y - (heightOfEachSprite / 2);

    let translate3DValue = "translate3d(" + xPos + "px, " + yPos + "px, 0)";

    if (xCat > xPos) {
        cat.style.backgroundImage = "url(./images/Left_cat_sprite_sheet.png)";
    } else {
        cat.style.backgroundImage = "url(./images/Right_cat_sprite_sheet.png)";
    }

    cat.style.transform = translate3DValue;
    startAnimation();
    setTimeout(function () { stopAnimation(); }, 1000);
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


function stopAnimation() {
    clearInterval(animationInterval);
    cat.style.backgroundPosition = "0px 0px";
}


function startAnimation() {
    var position = widthOfEachSprite; //start position for the image
    const speed = 100; //in millisecond(ms)
    const diff = widthOfEachSprite; //difference between two sprites

    animationInterval = setInterval(() => {
        cat.style.backgroundPosition = `-${position}px 0px`;

        if (position < widthOfSpriteSheet) {
            position = position + diff;
        } else {
            //increment the position by the width of each sprite each time
            position = widthOfEachSprite;
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
