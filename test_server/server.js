var express = require('express');
var app = express();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/skillmap.db');

app.use(express.static('../public'));

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
        res.json(rows);
    };
};

app.get('/groups', function (req, res) {
    db.all('SELECT id, name FROM groups', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/domains', function (req, res) {
    db.all('SELECT id, name FROM domains', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/skills', function (req, res) {
    db.all('SELECT id, name FROM skills', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/people', function (req, res) {
    db.all('SELECT id, name FROM people', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/people/:department', function (req, res) {
    var department = req.params.department;
    
    db.all('SELECT id, name FROM people WHERE departmentid = ?', department, function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/departments', function (req, res) {
    db.all('SELECT id, name FROM departments', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/levels', function (req, res) {
    db.all('SELECT id, name FROM skilllevels', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/skillset', function (req, res) {
    db.all('SELECT * FROM skillset', function(err,rows){
      createResponse(res,err,rows);
    });
});

//
// Visualization 
//
function compose(response, property, rows) {
    if(rows!==undefined)
        response[property] = rows;
        
    return response;
};

app.get('/skillavg/:skill', function (req, res) {
    var skill = req.params.skill;
    
    var response = {};
    response.skill = skill;
    response.context = 'overall';
    response.targetname = '';
    
    db.all('SELECT s.value AS id, sl.name AS name, COUNT(s.value) AS value FROM skillset s ' +
            'INNER JOIN skilllevels sl ON sl.id=s.value ' +
            'WHERE skillid = ? GROUP BY value', skill, function(err,rows) {
        createResponse(res,err,compose(response,'levels',rows));
    });
});

app.get('/skillavg/:skill/:department', function (req, res) {
    var skill = req.params.skill;
    var department = req.params.department;
    
    var response = {};
    response.skill = skill;
    response.context = 'group';
    response.targetname = '';
    
    db.get('SELECT name FROM departments WHERE id = ?', department, function(err,rows) {
        if(err==null) {
            response.targetname=rows.name;
        }
    });
    
    db.all('SELECT s.value AS id, sl.name AS name, COUNT(s.value) AS value FROM skillset s ' +
            'INNER JOIN people p ON s.personid=p.id ' +
            'INNER JOIN skilllevels sl ON sl.id=s.value ' +
            'WHERE skillid = ? and departmentid = ? ' +
            'GROUP BY value, departmentid', [skill, department], function(err,rows) {
        createResponse(res,err,compose(response,'levels',rows));
    });
});

app.get('/strengths/:group', function (req, res) {
    var group = req.params.group || "";
    var person = req.query.person || "";
    var department = req.query.department || "";
    
    var response = {};
    response.targetname = '';
    
    var query = 'SELECT s.name, sl.name AS label, AVG(ss.value) AS value ' +
                'FROM skillset ss ' +
                'INNER JOIN skilllevels sl ON sl.id=ss.value ' +
                'INNER JOIN skills s ON ss.skillid=s.id ' +
                'INNER JOIN domainsgroupsskills dgs ON dgs.skillid=s.id ';
    
    if(person !== "") {
        response.context = 'personal';
        
        db.get('SELECT name FROM people WHERE id = ?', person, function(err,rows) {
            if(err==null) {
                response.targetname=rows.name;
            }
        });
        
        db.all(query +
                'WHERE dgs.groupid = ? AND ss.personid = ? GROUP BY s.name', [group, person], function(err,rows) {
            createResponse(res,err,compose(response,'skills',rows));
        });
    }
    else if(department !== "") {
        response.context = 'group';
        
        db.get('SELECT name FROM departments WHERE id = ?', department, function(err,rows) {
            if(err==null) {
                response.targetname=rows.name;
            }
        });
        
        db.all(query +
                'INNER JOIN people p ON ss.personid=p.id ' +
                'WHERE dgs.groupid = ? AND p.departmentid = ? GROUP BY s.name', [group, department], function(err,rows) {
            createResponse(res,err,compose(response,'skills',rows));
        });
    }
    else {
        response.context = 'overall';
        
        db.all(query +
                'WHERE dgs.groupid = ? AND GROUP BY s.name', group, function(err,rows) {
            createResponse(res,err,compose(response,'skills',rows));
        });
    }
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})