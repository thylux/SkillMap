var express = require('express');
var app = express();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/skillmap.db');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//
// Raw Data
//
function createResponse(res,err,rows) {
    if(err!==null) {
        res.send(err.message);
    }
    else {
        res.send(rows);
    };
};

app.get('/groups', function (req, res) {
    db.all('SELECT * FROM groups', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/domains', function (req, res) {
    db.all('SELECT * FROM domains', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/skills', function (req, res) {
    db.all('SELECT * FROM skills', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/people', function (req, res) {
    db.all('SELECT * FROM people', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/departments', function (req, res) {
    db.all('SELECT * FROM departments', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/skillset', function (req, res) {
    db.all('SELECT * FROM skillset', function(err,rows){
      createResponse(res,err,rows);
    });
});



var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})