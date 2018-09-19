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
        'Content-Length': currentMessage.length
      });
      req.on('end',function(){
        console.log(currentMessage)
      });
      res.end(currentMessage);
    }
}).listen(8002, '0.0.0.0');

console.log('Server running at http://0.0.0.0:8002/');



