'use strict';

var http = require('http');
var matrixLed = require('matrix-led-font');

var myMessage = ' My ❤ be mine! ♡';
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
    console.log(output.map(function(item){return item.charCodeAt(0).toString(10);}).join('-') + '\n');
    console.log(output.map(function(item){return pad(item.charCodeAt(0).toString(2),8) + ' ';}).join('') + '\n');
    // console.log('parseInt 01110000,2' + parseInt('01110000',2)  + '\n');
    // console.log('String.fromCharCode(parseInt 01110000,2)' + String.fromCharCode(parseInt('01110000',2)) + '\n');
    // console.log('Convert Back to bin ' + String.fromCharCode(parseInt('01110000',2)).charCodeAt(0).toString(2)  + '\n');
  });
  res.end(output.join(''));
}).listen(1337, '0.0.0.0');

console.log('Server running at http://0.0.0.0:1337/');



