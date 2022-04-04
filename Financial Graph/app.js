const canvas = document.getElementById('myChart');
const ctx = canvas.getContext("2d");

canvas.addEventListener("mousemove", function (event) {
    updateMouseCoord(event);
});

var isMouseHover = false

canvas.addEventListener("mouseleave", function (event) {
    isMouseHover = false
});
canvas.addEventListener("mouseover", function (event) {
    isMouseHover = true
});

var x1, y1;
var firstClick = false;
var lineDrawMode = false;

canvas.addEventListener("click", function (event) {
    addLine(event);
});

document.addEventListener("DOMContentLoaded", startAnimation);

const candleWidth = 20;
var numCandles = 50;
var currCandleNum = 0;

const yTop = 100; // top offset
const xLeft = 100; // left offset

const xRight = 300;

const yAxisXLeft = 75;
const yAxisLabelXLeft = 25;

const font = 15;


var height = document.getElementById('myChart').clientHeight;
var width = document.getElementById('myChart').clientWidth;

var hMax = 0;
var lMin = height;

let xInc = (width - xLeft - xRight) / numCandles; // distance between each candle

var o, c, h, l, t;

var mouseX, mouseY;
var onScreen;

var candles = new Array;

let lines = new Array;

var updateSpeed = 1000;
var msPassed = 0;


class CandleStick {
    constructor(o, c, h, l, t) {
        this.o = o;
        this.c = c;
        this.h = h;
        this.l = l;
        this.t = t;
        this.draw(o, c, h, l, t);
    }

    draw(o, c, h, l, t) {
        if (o > c) {
            ctx.fillStyle = "#FF0000";
            ctx.strokeStyle = "#FF0000";
        } else {
            ctx.fillStyle = "#00FF00";
            ctx.strokeStyle = "#00FF00";
        }
        ctx.beginPath();
        let smallerOC = Math.min(o, c);
        let largerOC = Math.max(o, c);
        ctx.fillRect(xLeft + xInc * t, convertY(largerOC), candleWidth, largerOC - smallerOC);
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(xLeft + xInc * t + candleWidth / 2, convertY(h));
        ctx.lineTo(xLeft + xInc * t + candleWidth / 2, convertY(l));
        ctx.stroke();
    }
}

class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }

    draw(x1, y1, x2, y2) {
        ctx.strokeStyle = "#0000FF";
        ctx.fillStyle = "#0000FF";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

function addLine(e) {
    if(lineDrawMode){
        if(!firstClick){
            firstClick = true;
            x1 = e.clientX - getExactPos(canvas).x;
            y1 = e.clientY - getExactPos(canvas).y;
        }else{
            lines.push(new Line(x1, y1, e.clientX - getExactPos(canvas).x, e.clientY - getExactPos(canvas).y));
            lineDrawMode = false;
        }
    }
}

function startDrawLineMode(){
    lineDrawMode = true;
    firstClick = false;
}

function clearDrawings(){
    lines = [];
    firstClick = false;
    console.log(Hello);
}

function drawLines() {
    for(let i = 0; i < lines.length; i++){
        lines[i].draw(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
    }
}

function startAnimation() {
    generateCandles(numCandles);
    setInterval(() => {
        msPassed++;
        if (msPassed % updateSpeed == 0) {
            generateCandles(1);
            updateMaxMin();
        }
        ctx.clearRect(0, 0, width, height);
        drawCandles();
        drawYAxis();
        drawXAxis();
        drawSideBar();
        drawLines();
        if (isMouseHover && mouseX < width - 250) {
            drawCrosshair();
            displayInfo();
        }
    }, 1);
}

function displayInfo() {
    if ((mouseX - xLeft) % xInc < candleWidth && mouseX < width - xRight - candleWidth) {
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#000000";
        ctx.font = font + "px Arial";
        let index = Math.round((mouseX - xLeft - 2) / xInc) + (candles.length - numCandles);
        if (index >= 0) {
            ctx.fillText("O: " + Math.round(candles[index].o), mouseX + 25, mouseY + 20);
            ctx.fillText("C: " + Math.round(candles[index].c), mouseX + 25, mouseY + 40);
            ctx.fillText("H: " + Math.round(candles[index].h), mouseX + 25, mouseY + 60);
            ctx.fillText("L: " + Math.round(candles[index].l), mouseX + 25, mouseY + 80);
            ctx.fillText("T: " + Math.round(candles[index].t), mouseX + 25, mouseY + 100);
        }
    }
}

function updateMouseCoord(e) {
    mouseX = e.clientX - getExactPos(canvas).x;
    mouseY = e.clientY - getExactPos(canvas).y;
}

function drawCrosshair() {
    ctx.strokeStyle = "#000000";
    ctx.setLineDash([5, 15]);

    // vertical line
    ctx.beginPath();
    ctx.moveTo(mouseX, 0);
    ctx.lineTo(mouseX, height);
    ctx.stroke();

    // horizontal line
    ctx.beginPath();
    ctx.moveTo(0, mouseY);
    ctx.lineTo(width, mouseY);
    ctx.stroke();
}

function drawCandles() {
    for (let i = candles.length - numCandles; i < candles.length; i++) {
        candles[i].draw(candles[i].o, candles[i].c, candles[i].h, candles[i].l, candles[i].t - (candles.length - numCandles));
    }
}

function generateCandles(num) {
    // draw candles
    for (let t = 0; t < num; t++) {
        // randomize values
        o = Math.round(Math.random() * (height - 250) + 125);
        c = Math.round(Math.random() * (height - 250) + 125);
        h = Math.round(Math.max(o, c) + Math.random() * 50);
        l = Math.round(Math.min(o, c) - Math.random() * 50);

        let candle = new CandleStick(o, c, h, l, currCandleNum++);
        candles.push(candle);
    }
    updateMaxMin();
}

function updateMaxMin() {
    hMax = 0;
    lMin = height;
    for (let i = currCandleNum - numCandles; i < currCandleNum; i++) {
        hMax = Math.max(hMax, candles[i].h);
        lMin = Math.min(lMin, candles[i].l);
    }
}

function drawYAxis() {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(yAxisXLeft, 0);
    ctx.lineTo(yAxisXLeft, height);
    ctx.stroke();

    for (let i = lMin; i <= hMax + 5; i += (hMax - lMin) / 10) {
        ctx.font = font + "px Arial";
        ctx.fillText(Math.round(i), yAxisLabelXLeft, convertY(i - font / 4));
    }
}

function convertY(y) {
    return height - y;
}

function drawXAxis() {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(0, convertY(50));
    ctx.lineTo(width, convertY(50));
    ctx.stroke();

    for (let i = 0; i <= 5; i++) {
        ctx.font = font + "px Arial";
        ctx.fillText(currCandleNum - numCandles + i * numCandles / 5, xLeft + (width - xLeft - xRight) / 5 * i, convertY(20));
    }
}

function drawSideBar() {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(width - 250, 0);
    ctx.lineTo(width - 250, height);
    ctx.stroke();

    ctx.font = font + "px Arial";
    ctx.fillText("Candles", 1745, convertY(875));

    ctx.font = font + "px Arial";
    ctx.fillText("Speed", 1750, convertY(675));

    ctx.font = font + "px Arial";
    ctx.fillText("Drawing Tools", 1730, convertY(475));
}

function setSpeed(speed) {
    updateSpeed = speed;
}

function setNumCandles(num) {
    numCandles = num;
    updateMaxMin();
    xInc = (width - xLeft - xRight) / numCandles;
}

// helper function to get an element's exact position
function getExactPos(el) {

    let xPosition = 0;
    let yPosition = 0;

    while (el) {
        if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            let xScrollPos = el.scrollLeft || document.documentElement.scrollLeft;
            let yScrollPos = el.scrollTop || document.documentElement.scrollTop;

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
