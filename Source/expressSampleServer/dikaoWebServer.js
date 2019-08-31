var express = require('express');
var app = express();

var server = app.listen(8080, function(){
    console.log("Express server has started on port 8080")
})

app.get('/', function(req, res)
{
  res.send('hello world2');
})