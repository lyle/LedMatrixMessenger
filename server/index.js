'use strict';

const http = require('http');
const matrixLed = require('matrix-led-font');

const myMessage = ' My ❤ be mine! ♡';
const output = Buffer.from(matrixLed.getBufferFromLine(myMessage))

let currentMessage = output

http.createServer(function (req, res) {
    if (req.method == 'POST') {
        let confirmation = "{hum:good}"
        var POST = {}
        req.on('data', function(data) {
            console.log(data);
            currentMessage = data
        })
        res.writeHead(200, {
          'Content-Type': 'application/javascript',
          'Access-Control-Allow-Origin':'*',
          'Content-Length': confirmation.length
        })
        res.end(confirmation)
    }
    if (req.method == 'GET'){

      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=latin1',
        'Content-Length': currentMessage.join('').length
      });
      req.on('end',function(){
        console.log(currentMessage)
        //console.log(output.map(function(item){return item.charCodeAt(0).toString(10);}).join('-') + '\n');
        //console.log(output.map(function(item){return pad(item.charCodeAt(0).toString(2),8) + ' ';}).join('') + '\n');
        // console.log('parseInt 01110000,2' + parseInt('01110000',2)  + '\n');
        // console.log('String.fromCharCode(parseInt 01110000,2)' + String.fromCharCode(parseInt('01110000',2)) + '\n');
        // console.log('Convert Back to bin ' + String.fromCharCode(parseInt('01110000',2)).charCodeAt(0).toString(2)  + '\n');
      });
      res.end(currentMessage);
    }
}).listen(1337, '0.0.0.0');

console.log('Server running at http://0.0.0.0:1337/');



