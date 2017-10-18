'use strict';

const http = require('http');
const exec = require('child_process').exec;
const config = require('./config.json');
const server = http.createServer(function(req, res){
  serverResponse(req, res)
});
server.listen(config.port, config.hostname, function(){
  console.log(`Server running at http://${config.hostname}:${config.port}/`);
});

function serverResponse(req, res) {
  const url = req.url
  let rules = {
    'default': function() {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 error!");
    }
  }
  config.projects.forEach(function(rule){
    rules[rule.url] = function() {
      exec(rule.script, {cwd: rule.cwd}, function(err,stdout){
        console.log(err, stdout);
      });
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(rule.url + ' OK');
    }
  })
  return rules.hasOwnProperty(url) ? rules[url]() : rules['default']()
}
