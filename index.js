"use strict";
let http = require('http');
let request = require('request');

let echoServer = http.createServer((req, res) => {
    console.log(`Request received at: ${req.url}`)
    //res.end('Hello World!! \n')
    //req.pipe(res)
    for (let header in req.headers) {
    res.setHeader(header, req.headers[header])
    req.pipe(res)
}
}).listen(8000)

let destinationUrl = '127.0.0.1:8000'

let proxyServer = http.createServer((req, res) => {
  console.log(`Proxying request to: ${destinationUrl + req.url}`)
  // Proxy code here
  let options = {
  	  headers: req.headers,
  	  url: `http://${destinationUrl}${req.url}`
  	 }
  	 request(options).pipe(res)
  	 // Use the same HTTP verb
     options.method = req.method

     // Note: streams are chainable
     // readableStream -> writable/readableStream -> writableStream
     req.pipe(request(options)).pipe(res)
}).listen(8001)