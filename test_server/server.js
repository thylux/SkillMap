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
    db.all('SELECT id, name FROM groups ORDER BY name', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/domains', function (req, res) {
    db.all('SELECT id, name FROM domains ORDER BY name', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/skills', function (req, res) {
    db.all('SELECT id, name FROM skills ORDER BY name', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/people', function (req, res) {
    db.all('SELECT id, name FROM people ORDER BY name', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/people/:department', function (req, res) {
    var department = req.params.department;
    
    db.all('SELECT id, name FROM people WHERE departmentid = ?  ORDER BY name', department, function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/departments', function (req, res) {
    db.all('SELECT id, name FROM departments ORDER BY name', function(err,rows){
      createResponse(res,err,rows);
    });
});

app.get('/levels', function (req, res) {
    db.all('SELECT id, name FROM skilllevels ORDER BY name', function(err,rows){
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
var compose = function(response, property, rows) {
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
    
    db.get('SELECT name FROM departments WHERE id = ? ORDER BY name', department, function(err,rows) {
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
        
        db.get('SELECT name FROM people WHERE id = ? ORDER BY name', person, function(err,rows) {
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
        
        db.get('SELECT name FROM departments WHERE id = ? ORDER BY name', department, function(err,rows) {
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

var get_person = function(person, next, callback) {
    if(person !== "") {
        db.get('SELECT id, name FROM people WHERE id = ? ORDER BY name', person, callback);
    };
};

var get_person_skills = function(group, person, next, callback) {
    if(person !== "") {
        db.all('SELECT s.name, sl.name AS label, ss.value ' +
                'FROM skillset ss ' +
                'INNER JOIN skilllevels sl ON sl.id=ss.value ' +
                'INNER JOIN skills s ON ss.skillid=s.id ' +
                'INNER JOIN domainsgroupsskills dgs ON dgs.skillid=s.id ' +
                'WHERE dgs.groupid = ? AND ss.personid = ? GROUP BY s.name', [group, person], callback);
    }
    else
        // let express know we are ready for the next function
        next();
};

var get_department = function(department, next, callback) {
    if(department !== "") {
        db.get('SELECT id, name FROM departments WHERE id = ? ORDER BY name', department, callback);
    };
};

var get_department_skills = function(group, department, next, callback) {
    if(department !== "") {        
        db.all('SELECT s.name, sl.name AS label, ss.value ' +
                'FROM skillset ss ' +
                'INNER JOIN skilllevels sl ON sl.id=ss.value ' +
                'INNER JOIN skills s ON ss.skillid=s.id ' +
                'INNER JOIN domainsgroupsskills dgs ON dgs.skillid=s.id ' +
                'INNER JOIN people p ON ss.personid=p.id ' +
                'WHERE dgs.groupid = ? AND p.departmentid = ? GROUP BY s.name', [group, department], callback);
    }
    else
        // let express know we are ready for the next function
        next();
};

function getGroup(req, res, next) {
    var group = req.params.group || "";
    
    db.get('SELECT name FROM groups WHERE id = ? ORDER BY name', group, function(err,rows) {
        if(err==null) {
            req.response.skill_group = rows.name;
        }
        
        // let express know we are ready for the next function
        next();
    });
};

function get(req, res, group, person, department, next) {
    if(person !== "")
    {
        // ensure these two callbacks are called in the same order
        db.serialize(function() {
            get_person(person, next, function(err,rows) {
                if(err==null && rows!==null && rows!==undefined) {
                    req.response.targetnames.push(rows.name);
                }
            });
            get_person_skills(group, person, next, function(err,rows) {
                if(err==null && rows!==null && rows!==undefined) {
                    req.response.skills.push(rows);
                }
                
                // let express know we are ready for the next function
                next();
            });
        });
    }
    else
    {
        // ensure these two callbacks are called in the same order
        db.serialize(function() {
            get_department(department, next, function(err,rows) {
                if(err==null && rows!==null && rows!==undefined) {
                    req.response.targetnames.push(rows.name);
                }
            });
            get_department_skills(group, department, next, function(err,rows) {
                if(err==null && rows!==null && rows!==undefined) {
                    req.response.skills.push(rows);
                }
                
                // let express know we are ready for the next function
                next();
            });
        });
    }
};

function get1(req, res, next) {
    var group = req.params.group || "";
    var person1 = req.query.person1 || "";
    var department1 = req.query.department1 || "";
    
    return get(req, res, group, person1, department1, next);
};

function get2(req, res, next) {
    var group = req.params.group || "";
    var person2 = req.query.person2 || "";
    var department2 = req.query.department2 || "";
    
    return get(req, res, group, person2, department2, next);
};

function get3(req, res, next) {
    var group = req.params.group || "";
    var person3 = req.query.person3 || "";
    var department3 = req.query.department3 || "";
    
    return get(req, res, group, person3, department3, next);
};

app.get('/compare/:group', function (req, res, next) {
        var person1 = req.query.person1 || "";
        
        req.response = {};
        req.response.targetnames = [];
        
        if(person1 !== "")
            req.response.context = 'personal';
        else
            req.response.context = 'group';
        
        req.response.skills = [];
        
        next();
    }, 
    getGroup, 
    get1, 
    get2, 
    get3, 
    function (req, res, next) {
        var combined = [];
        
        var i, j, cur;
        for (i = 0, j = req.response.skills[0].length; i < j; i++) {
            cur = req.response.skills[0][i];
            combined.push({name: cur.name, values: [cur.value]});
            
            if (req.response.skills.length>1) {
                combined[i].values.push(req.response.skills[1][i].value);
            }
            if (req.response.skills.length>2) {
                combined[i].values.push(req.response.skills[2][i].value);
            }
        }
        
        req.response.skills = combined;
        
        res.json(req.response);
    }
);

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})