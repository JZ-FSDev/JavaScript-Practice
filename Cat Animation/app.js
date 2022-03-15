var cat = document.querySelector("#cat");
var canvas = document.querySelector("#canvas");

canvas.addEventListener("click", getClickPosition, false);

function getClickPosition(e){
    var xPos = e.clientX;
    var yPos = e.clientY;
    
    var translate3DValue = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}
