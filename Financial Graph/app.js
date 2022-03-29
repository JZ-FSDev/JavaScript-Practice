const chart = document.getElementById('myChart');
const ctx = chart.getContext("2d");

const candleWidth = 20;
const numCandles = 50;

var height = document.getElementById('myChart').clientHeight;
var width = document.getElementById('myChart').clientWidth;

let yTop = 400; // top offset
let xLeft = 100; // left offset

let hMax = 0;
let lMin = 0;

let xInc = (width - xLeft) / numCandles; // distance between each candle

var o, c, h, l;


class CandleStick{
    constructor(i){
        this.draw(i);
    }

    draw(i){
        if(o < c){
            ctx.fillStyle = "#FF0000";
        }else{
            ctx.fillStyle = "#00FF00";
        }
        ctx.beginPath();
        ctx.fillRect(xLeft + xInc * i, yTop + o, candleWidth, c - o);
        ctx.stroke();
    
        if(o < c){
            ctx.strokeStyle = "#FF0000";
        }else{
            ctx.strokeStyle = "#00FF00";
        }
        ctx.beginPath();
        ctx.moveTo(xLeft + xInc * i + candleWidth/2, yTop + h);
        ctx.lineTo(xLeft + xInc * i + candleWidth/2, yTop + l);
        ctx.stroke();
    }
}


for(let i = 0; i < numCandles; i++){
    // randomize values
    o = Math.random() * 100;
    c = Math.random() * 100;
    h = o - Math.random() * 50;
    l = c + Math.random() * 50;

    // update hMax and hMin
    hMax = Math.max(hMax, h);
    lMin = Math.min(lMin, l);

    let candle = new CandleStick(i);
    candle.draw(i);
}

hMax += yTop;
lMin += yTop;



