var express = require('express');
var app = express();

if(typeof require !== 'undefined') XLSX = require('xlsx');
var workbook = XLSX.readFile('data/skills.xls');

function loadJson(sheetname) {
    var worksheet = workbook.Sheets[sheetname];
	return XLSX.utils.sheet_to_row_object_array(worksheet);
}

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
app.get('/groups', function (req, res) {
    res.send(loadJson('Groups'));
});

app.get('/domains', function (req, res) {
    res.send(loadJson('Domains'));
});

app.get('/skills', function (req, res) {
    res.send(loadJson('Skills'));
});

app.get('/people', function (req, res) {
    res.send(loadJson('People'));
});

app.get('/departments', function (req, res) {
    res.send(loadJson('Departments'));
});

app.get('/data', function (req, res) {
    res.send(loadJson('Data'));
});



var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})