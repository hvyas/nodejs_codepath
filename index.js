"use strict";
let http = require('http')
let request = require('request')
let url = require('url')

let argv = require('yargs')
	.default('host', '127.0.0.1:8000')
	.argv

let port = argv.port || (argv.host === '127.0.0.1' ? 8000 : 80)
let destinationUrl = argv.url || url.format({
   protocol: 'http',
   host: argv.host,
   port
})

let path = require('path')
let fs = require('fs')
let logPath = argv.log && path.join(__dirname, argv.log)
let logStream = logPath ? fs.createWriteStream(logPath) : process.stdout


http.createServer((req, res) => {
    //console.log(`Request received at: ${req.url}`)
    //res.end('Hello World!! \n')
    //req.pipe(res)
    logStream.write('\n Request from Proxy server to EchoServer: ' + destinationUrl + '\n')

    for (let header in req.headers) {
    res.setHeader(header, req.headers[header])
}
req.pipe(res)
}).listen(8000)

//let destinationUrl = '127.0.0.1:8000'

http.createServer((req, res) => {
  //console.log(`Proxying request to: ${destinationUrl + req.url}`)

  let options = {
  	  headers: req.headers,
  	  url: destinationUrl,
  	  method: req.method
  	 }
   if(req.headers['x-destination-url']){
   	logStream.write('Overriding default destinationUrl as x-destination-url present in header')
   	options['url'] = res.headers['x-destination-url']
   }

  	 logStream.write('\n Request sent to EchoServer from: \n')
  	 logStream.write('\n' + JSON.stringify(req.headers) + '\n')
     req.pipe(logStream, {end: false})

  	 let outboundResponse = request(options)
     outboundResponse.pipe(res)
     options.method = req.method
     req.pipe(request(options)).pipe(res)

}).listen(8001)

