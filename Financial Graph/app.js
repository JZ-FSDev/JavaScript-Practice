const c = document.getElementById('myChart');
const ctx = c.getContext("2d");

const candleWidth = 20;

var height = document.getElementById('myChart').clientHeight;
var width = document.getElementById('myChart').clientWidth;

const myData = JSON.parse('{"o":["40","30","20"], "c":["70","20","10"], "h":["40","80","150"], "l":["50","30","90"], "d":["2020-01-11","2020-01-12","2020-01-13"]}');


let xInc = width/myData.o.length;

for(let i = 0; i < myData.o.length; i++){
    // draw candlestick
    ctx.beginPath();
    ctx.fillRect(xInc * i, myData.o[i], candleWidth, myData.c[i]);
    ctx.stroke();

    // draw line
    ctx.beginPath();
    ctx.moveTo(xInc * i + candleWidth/2, myData.l[i]);
    ctx.lineTo(xInc * i + candleWidth/2, myData.h[i]);
    ctx.stroke();
}
