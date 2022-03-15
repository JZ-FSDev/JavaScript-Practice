var cat = document.querySelector("#cat");
var cat_width_rendered = document.querySelector("#catImage").naturalWidth;
var cat_height_rendered = document.querySelector("#catImage").naturalHeight;


var canvas = document.querySelector("#canvas");

canvas.addEventListener("click", getClickPosition, false);

function getClickPosition(e) {
    var parentPosition = getPosition(canvas);


    var xPos = e.clientX - parentPosition.x - (cat_width_rendered / 2);
    var yPos = e.clientY - parentPosition.y - (cat_height_rendered / 2);

    var translate3DValue = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    cat.style.transform = translate3DValue;
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
