var path = require('path')
var express = require('express')
var app = express()
var config = require('../config')

app.use(express.static(path.join(__dirname, '../dist/')));

app.get('/config', function(req, res){
  res.json(config.runtime);
})

app.get('/favicon.ico', function(req, res){
  res.sendFile(path.join(__dirname, '../favicon.ico'));
})

app.use(function (req, res) {
  res.sendFile(path.join(__dirname, '../dist/'));
})

app.listen(config.buildtime.app_server.port, function () {
  console.log('The app server is work!' + config.buildtime.app_server.port)
})
