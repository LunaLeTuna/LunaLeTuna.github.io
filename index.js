
const path = require('path');
const fs = require('fs');

var http = require('http');
var https = require('https');

const express = require('express');
const app = express();

var privateKey = fs.readFileSync('sslcert/private.key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/domain.cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

app.use(express.urlencoded({
  extended: true
}))

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.use(express.static(__dirname))

httpServer.listen(80);
httpsServer.listen(443);
