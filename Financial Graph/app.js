const canvas = document.getElementById('myChart');
const ctx = canvas.getContext("2d");

canvas.addEventListener("mousemove", function (event) {
    updateMouseCoord(event);
});

document.addEventListener("DOMContentLoaded", startAnimation);

const candleWidth = 20;
const numCandles = 50;

const yTop = 100; // top offset
const xLeft = 100; // left offset

const yAxisXLeft = 75;
const yAxisLabelXLeft = 25;


var height = document.getElementById('myChart').clientHeight;
var width = document.getElementById('myChart').clientWidth;

var hMax = 0;
var lMin = height;

let xInc = (width - xLeft) / numCandles; // distance between each candle

var o, c, h, l, t;

var mouseX, mouseY;

var candles = new Array;


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
        if (o < c) {
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
    generateCandles();
    setInterval(() => {
        ctx.clearRect(0, 0, width, height);
        drawCandles();
        drawCrosshair();
        displayInfo();
    }, 1);
}

function displayInfo() {
    if((mouseX - xLeft) % xInc < candleWidth){
        ctx.strokeStyle = "#000000";
        ctx.font = "15px Arial";
        let index = Math.round((mouseX - xLeft - 2) / xInc);
        if(index >= 0){
            ctx.fillText(index, mouseX, mouseY);
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
    for (let i = 0; i < candles.length; i++) {
        candles[i].draw(candles[i].o, candles[i].c, candles[i].h, candles[i].l, candles[i].t);
    }
    drawAxis();
}

function generateCandles() {
    // draw candles
    for (let t = 0; t < numCandles; t++) {
        // randomize values
        o = Math.random() * height;
        c = Math.random() * height;
        h = Math.max(o, c) + Math.random() * 50;
        l = Math.min(o, c) - Math.random() * 50;

        // update hMax and hMin
        hMax = Math.max(hMax, h);
        lMin = Math.min(lMin, l);

        let candle = new CandleStick(o, c, h, l, t);
        candles.push(candle);
    }
}

function drawAxis() {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(yAxisXLeft, 0);
    ctx.lineTo(yAxisXLeft, height);
    ctx.stroke();

    for (let i = lMin; i <= hMax; i += (hMax - lMin) / 10) {
        ctx.font = "15px Arial";
        ctx.fillText(Math.round(i), yAxisLabelXLeft, convertY(i));
    }
}

function convertY(y) {
    return height - y;
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
