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

var msPassed = 0;


class CandleStick {
    constructor(o, c, h, l, t) {
        this.o = o;
        this.c = c;
        this.h = h;
        this.l = l;
        this.t = t;
        this.draw(o, c, h, l, t);

        var div = document.createElement('div');
        var canvas = document.createElement('canvas');
        canvas.width = candleWidth;

        div.appendChild(canvas);
        document.getElementsByTagName('body')[0].appendChild(div);
        div.addEventListener("mouseover", displayInfo);
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

function startAnimation() {
    generateCandles(numCandles);
    setInterval(() => {
        msPassed++;
        console.log(msPassed);
        if(msPassed % 500 == 0){
            generateCandles(1);
        }
        ctx.clearRect(0, 0, width, height);
        drawCandles();
        drawYAxis();
        drawXAxis();
        drawSideBar();
        if(isMouseHover && mouseX < width - 250){
            drawCrosshair();
            displayInfo();
        }
    }, 1);
}

function displayInfo() {
    if ((mouseX - xLeft) % xInc < candleWidth) {
        ctx.strokeStyle = "#000000";
        ctx.font = font + "px Arial";
        let index = Math.round((mouseX - xLeft - 2) / xInc);
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
    if(candles.length > 50){
        for (let i = candles.length - numCandles; i < candles.length; i++) {
            candles[i].draw(candles[i].o, candles[i].c, candles[i].h, candles[i].l, candles[i].t - (candles.length - numCandles));
        }
    }else{
        for (let i = candles.length - numCandles; i < candles.length; i++) {
            candles[i].draw(candles[i].o, candles[i].c, candles[i].h, candles[i].l, candles[i].t);
        }
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

        // update hMax and hMin
        hMax = Math.max(hMax, h);
        lMin = Math.min(lMin, l);

        let candle = new CandleStick(o, c, h, l, currCandleNum++);
        candles.push(candle);
        
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
        ctx.fillText(Math.round(i), yAxisLabelXLeft, convertY(i - font/4));
    }
}

function convertY(y) {
    return height - y;
}

function drawXAxis(){
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(0, convertY(50));
    ctx.lineTo(width, convertY(50));
    ctx.stroke();

    for (let i = 0; i <= numCandles; i += numCandles / 10) {
        ctx.font = font + "px Arial";
        ctx.fillText(i, xLeft + (width - xLeft - xRight) / 50 * i, convertY(20));
    }
}

function drawSideBar(){
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
