"use strict";
let http = require('http');

http.createServer((req, res) => {
    console.log(`Request received at: ${req.url}`)
    res.end('Hello World!! \n')
}).listen(8000)