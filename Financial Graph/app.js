const chart = document.getElementById('myChart');
const ctx = chart.getContext("2d");

chart.addEventListener("mousemove", function(event) {
    crosshair(event);
});
chart.addEventListener("onmouseover", function(event) {
    crosshair(event);
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
        draw();
    }, 1);
}

function displayInfo() {

}

function crosshair(e) {
    ctx.strokeStyle = "#000000";

    // vertical line
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(e.clientX, 0);
    ctx.lineTo(e.clientX, height);
    ctx.stroke();

    // horizontal line
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(0, e.clientY);
    ctx.lineTo(width, e.clientY);
    ctx.stroke();
}

function draw(){
    for(let i = 0; i < candles.length; i++){
        candles[i].draw(candles[i].o, candles[i].c, candles[i].h, candles[i].l, candles[i].t);
    }
    drawAxis();
}

function generateCandles() {
    // draw candles
    for (let t = 0; t < numCandles; t++) {
        // randomize values
        o = Math.random() * (height - 100);
        c = Math.random() * (height - 100);
        h = Math.max(o, c) + Math.random() * 50;
        l = Math.min(o, c) - Math.random() * 50;

        // update hMax and hMin
        hMax = Math.max(hMax, h);
        lMin = Math.min(lMin, l);

        let candle = new CandleStick(o, c, h, l, t);
        candles.push(candle);
    }
}

function drawAxis(){
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(yAxisXLeft, 0);
    ctx.lineTo(yAxisXLeft, height);
    ctx.stroke();

    for (let i = lMin; i <= hMax; i += (hMax - lMin) / 10) {
        ctx.font = "10px Arial";
        ctx.fillText(Math.round(i), yAxisLabelXLeft, convertY(i));
    }
}




function convertY(y) {
    return height - y;
}
