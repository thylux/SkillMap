var express = require('express');
var app = express();

if(typeof require !== 'undefined') XLSX = require('xlsx');
var workbook = XLSX.readFile('data/skills.xls');

function to_json(worksheet) {
	return XLSX.utils.sheet_to_row_object_array(worksheet);
}

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/groups', function (req, res) {
    var worksheet = workbook.Sheets[workbook.SheetNames[1]];

    res.send(to_json(worksheet));
});

app.get('/domains', function (req, res) {
    var worksheet = workbook.Sheets[workbook.SheetNames[2]];

    res.send(to_json(worksheet));
});

app.get('/skills', function (req, res) {
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];

    res.send(to_json(worksheet));
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})