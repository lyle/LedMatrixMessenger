'use strict';

var http = require('http');
var matrixLed = require('matrix-led-font');

//var output = '0111000010001100010000100010000101000010100011000111000000000000\n';
//var output = 'B01110000,B10001100,B01000010,B00100001,B01000010,B10001100,B01110000,B00000000';
var heartUpsideDown = [
 '01111000',
 '10000100',
 '10000010',
 '01100001',
 '01100001',
 '10000010',
 '10000100',
 '01111000'
];
var heart = [
 '00011110',
 '00100001',
 '01000001',
 '10000110',
 '10000110',
 '01000001',
 '00100001',
 '00011110'
];

var heartNarrow = [
 '01110000',
 '10001100',
 '01000010',
 '00100001',
 '01000010',
 '10001100',
 '01110000',
 '00000000'
];
var desending = [
 '10000000',
 '01000000',
 '00100000',
 '00010000',
 '00001000',
 '00000100',
 '00000010',
 '00000001'
];
var msd = [
 '10000000',
 '10000000',
 '10000000',
 '10000000',
 '10000000',
 '10000000',
 '10000000',
 '10000000'
];

var myMessage = ' My ❤ be mine! ♡';
var myMessageOff = ' ❤';
var output = myMessage
    .split('')
    .map(function(char){
        return matrixLed.getChar(char);
    }).reduce(function(a, b) {
        return a.concat(b);
    }, [])
    .map(function(item){
        return String.fromCharCode(parseInt(item,2));
    });

//var output = heart
            // .concat(matrixLed.getChar('M'))
            // .concat(matrixLed.getChar('y'))
            // .concat(['00000000'])
            // .concat(heart)
            // .concat(['00000000'])
            // .concat(matrixLed.getChar('b'))
            // .concat(matrixLed.getChar('e'))
            // .concat(['00000000','00000000'])
            // .concat(matrixLed.getChar('m'))
            // .concat(matrixLed.getChar('i'))
            // .concat(matrixLed.getChar('n'))
            // .concat(matrixLed.getChar('e'))
            // .concat(['00000000'])
            //.concat(heart).map(function(item){return String.fromCharCode(parseInt(item,2));});

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

http.createServer(function (req, res) {

  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(output.join(''))
  });
  req.on('end',function(){
   // console.log(output);
    console.log(output.map(function(item){return item.charCodeAt(0).toString(10);}).join('-') + '\n');
    console.log(output.map(function(item){return pad(item.charCodeAt(0).toString(2),8) + ' ';}).join('') + '\n');
    
    //console.log('parseInt 01110000,2' + parseInt('01110000',2)  + '\n');
    // console.log('String.fromCharCode(parseInt 01110000,2)' + String.fromCharCode(parseInt('01110000',2)) + '\n');
    // console.log('Convert Back to bin ' + String.fromCharCode(parseInt('01110000',2)).charCodeAt(0).toString(2)  + '\n');
  });
  res.end(output.join(''));
}).listen(1337, '0.0.0.0');

console.log('Server running at http://0.0.0.0:1337/');



