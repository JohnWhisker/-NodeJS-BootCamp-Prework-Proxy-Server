let http = require('http')
let request = require('request')
let argv = require('yargs')
    .default('host', '127.0.0.1')
    .argv
let scheme = 'http://'
// Build the destinationUrl using the --host value
let port = argv.port || (argv.host === '127.0.0.1' ? 8000 : 80)
let fs = require('fs')
let logPath = argv.log && path.join(__dirname, argv.log)
let logStream = logPath ? fs.createWriteStream(logPath) : process.stdout

// Update our destinationUrl line from above to include the port
let destinationUrl = argv.url || scheme + argv.host + ':' + port

http.createServer((req, res) => {
   req.pipe(res)
   for (let header in req.headers) {
    res.setHeader(header, req.headers[header])
}
}).listen(8000)


http.createServer((req, res) => {
   
  console.log(`Proxying request to: ${destinationUrl + req.url}`)
    req.headers['x-destination-url']
   let options = {
        headers: req.headers,
        url: destinationUrl
    }
    request(options).pipe(res)
  
   req.pipe(logStream, {end: false})

  let downstreamResponse = req.pipe(request(options))
  process.stdout.write(JSON.stringify(downstreamResponse.headers))
  
  downstreamResponse.pipe(process.stdout)
  downstreamResponse.pipe(res)

}).listen(8001)