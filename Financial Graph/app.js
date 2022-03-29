const chart = document.getElementById('myChart');
const ctx = chart.getContext("2d");

const candleWidth = 20;
const numCandles = 50;

const yTop = 100; // top offset
const xLeft = 100; // left offset

const yAxisXLeft = 75;
const yAxisLabelXLeft = 25;


var height = document.getElementById('myChart').clientHeight;
var width = document.getElementById('myChart').clientWidth;

let hMax = 0;
let lMin = 0;

let xInc = (width - xLeft) / numCandles; // distance between each candle

var o, c, h, l;

var candles = new Array;


class CandleStick{
    constructor(o, c, h, l, t){
        this.o = o;
        this.c = c;
        this.h = h;
        this.l = l;
        this.t = t;
        this.draw(o, c, h, l, t);
    }

    draw(o, c, h, l, t){
        if(o < c){
            ctx.fillStyle = "#FF0000";
            ctx.strokeStyle = "#FF0000";
        }else{
            ctx.fillStyle = "#00FF00";
            ctx.strokeStyle = "#00FF00";
        }
        ctx.beginPath();
        ctx.fillRect(xLeft + xInc * t, o + yTop, candleWidth, c - o);
        ctx.stroke();
    
        ctx.beginPath();
        ctx.moveTo(xLeft + xInc * t + candleWidth/2, h + yTop);
        ctx.lineTo(xLeft + xInc * t + candleWidth/2, l + yTop);
        ctx.stroke();
    }
}


for(let t = 0; t < numCandles; t++){
    // randomize values
    o = Math.random() * (height - yTop * 2);
    c = Math.random() * (height - yTop * 2);
    h = Math.min(o, c) - Math.random() * 100;
    l = Math.max(o, c) + Math.random() * 100;

    // update hMax and hMin
    hMax = Math.max(hMax, h);
    lMin = Math.min(lMin, l);

    let candle = new CandleStick(o, c, h, l, t);
    candles.push(candle);
}

lMin += yTop;
hMax += yTop;

// draw axis
ctx.strokeStyle = "#000000";
ctx.fillStyle = "#000000";
ctx.beginPath();
ctx.moveTo(yAxisXLeft, 0);
ctx.lineTo(yAxisXLeft, height);
ctx.stroke();

for(let i = lMin; i <= hMax; i += (hMax - lMin) / 10){
    ctx.font = "10px Arial";
    ctx.fillText(Math.round(i), yAxisLabelXLeft, i);
}
