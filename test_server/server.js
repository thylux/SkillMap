var express = require('express');
var app = express();

if(typeof require !== 'undefined') XLSX = require('xlsx');
var workbook = XLSX.readFile('data/skills.xls');

app.get('/groups', function (req, res) {
    var first_sheet_name = workbook.SheetNames[0];
    var address_of_cell = 'A1';
    
    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];
    
    /* Find desired cell */
    var desired_cell = worksheet[address_of_cell];
    
    /* Get the value */
    var desired_value = desired_cell.v;
});

app.get('/domains', function (req, res) {
    var first_sheet_name = workbook.SheetNames[1];
    var address_of_cell = 'A1';
    
    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];
    
    /* Find desired cell */
    var desired_cell = worksheet[address_of_cell];
    
    /* Get the value */
    var desired_value = desired_cell.v;
});

app.get('/skills', function (req, res) {
    var first_sheet_name = workbook.SheetNames[2];
    var address_of_cell = 'A1';
    
    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];
    
    /* Find desired cell */
    var desired_cell = worksheet[address_of_cell];
    
    /* Get the value */
    var desired_value = desired_cell.v;
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})