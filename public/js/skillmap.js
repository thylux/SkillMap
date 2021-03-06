function loadEmptyOption(select, allowSelection) {
    allowSelection = allowSelection || false;
    //select.append('<option disabled selected value>Escolha um valor...</option>');
    select.append('<option selected value>Escolha um valor...</option>');  
};

function loadPeople(control, person) {
    person = person || "";
    
    control.empty();
    
    d3.json("people/"+person, function(error,response) {
        loadEmptyOption(control);
        response.forEach(function(d) {
            control.append('<option value="' + d.id + '">' + d.name + '</option>');
        });
    });
};

function loadSelects() {
    d3.json("domains", function(error,response) {
        loadEmptyOption($('select[name="domains"]'));
        response.forEach(function(d) {
            $('select[name="domains"]').append('<option value="' + d.id + '">' + d.name + '</option>');
        });
    });
    
    d3.json("groups", function(error,response) {
        loadEmptyOption($('select[name="groups"]'));
        response.forEach(function(d) {
            $('select[name="groups"]').append('<option value="' + d.id + '">' + d.name + '</option>');
        });
    });
    
    d3.json("skills", function(error,response) {
        loadEmptyOption($('select[name="skills"]'));
        response.forEach(function(d) {
            $('select[name="skills"]').append('<option value="' + d.id + '">' + d.name + '</option>');
        });
    });
    
    loadPeople($('select[name="people"]'));
    
    d3.json("departments", function(error,response) {
        loadEmptyOption($('select[name="departments"]'));
        response.forEach(function(d) {
            $('select[name="departments"]').append('<option value="' + d.id + '">' + d.name + '</option>');
        });
    });
    
    d3.json("levels", function(error,response) {
        loadEmptyOption($('select[name="levels"]'));
        response.forEach(function(d) {
            $('select[name="levels"]').append('<option value="' + d.id + '">' + d.name + '</option>');
        });
    });
};

function loadAster() {
    let asterChartOptions = {
        width: 200,
        height: 200,
        radius: (200 / 2) * 0.8,
        innerRadius: (200 / 2) * 0.24,
    };
    
    $('.demo1').change(function() {
        let skill = $('#demo1_skills option:selected').val();
        let dep = $('#demo1_departments option:selected').val();
        
        d3.json("skillavg/"+skill+"/"+dep, function(error,response) {
            if(error!==null) console.log(error.message);
            AsterChart("#demo1", response, asterChartOptions);
        });
    });
    
    AsterChart("#demo1", undefined, asterChartOptions);
};

function loadBubble() {
    let bubbleChartOptions1 = {
	    height: window.innerWidth * 0.95,
        width: window.innerWidth * 0.95,
        padding: 5,
	    format: d3.format(",d"),
	    color: d3.scale.category20()
	};
    
    let bubbleChartOptions2 = {
	    height: window.innerWidth * 0.45,
        width: window.innerWidth * 0.45,
        padding: 5,
	    format: d3.format(",d"),
	    color: d3.scale.category20()
	};
    
    $('.demo2a').change(function() {
        let person = $('#demo2a_people option:selected').val();
        
        person = person || "";
        
        if(person !== "") {
            d3.json("strengths/?person="+person, function(error,response) {
                if(error!==null) console.log(error.message);
                BubbleChart("#demo2a", response, bubbleChartOptions1);
            });
        }
    });
    
    //bubbleChartOptions.width = 600;
    
    $('.demo2b').change(function() {
        let domain = $('#demo2b_domains option:selected').val();
        let dep = $('#demo2b_departments option:selected').val();
        
        dep = dep || "";
        domain = domain || "";
        
        if(dep !== "" && domain !== "") {
            d3.json("strengths/"+domain+'?department='+dep, function(error,response) {
                if(error!==null) console.log(error.message);
                BubbleChart("#demo2b", response, bubbleChartOptions2);
            });
        }
    });
    
    $('.demo2c').change(function() {
        let domain = $('#demo2c_domains option:selected').val();
        let person = $('#demo2c_people option:selected').val();
        
        person = person || "";
        domain = domain || "";
        
        if(person !== "" && domain !== "") {
            d3.json("strengths/"+domain+'?person='+person, function(error,response) {
                if(error!==null) console.log(error.message);
                BubbleChart("#demo2c", response, bubbleChartOptions2);
            });
        }
    });
    
    BubbleChart("#demo2a", undefined, bubbleChartOptions1);
    BubbleChart("#demo2b", undefined, bubbleChartOptions2);
    BubbleChart("#demo2c", undefined, bubbleChartOptions2);
};

function loadRadar() {
    let margin = {top: 75, right: 75, bottom: 75, left: 75};                
    let radarChartOptions = {
        w: window.innerWidth * 0.30,
        h: window.innerWidth * 0.30,
        margin: margin,
        labelFactor: 1.1,
        levels: 6,
        roundStrokes: true,
        color: d3.scale.ordinal().range(["#EDC951","#CC333F","#00A0B0"])
    };
    
    $('.demo3a').change(function() {
        let group = $('#demo3a_groups option:selected').val();
        let department1 = $('#demo3a_departments1 option:selected').val();
        let department2 = $('#demo3a_departments2 option:selected').val();
        let department3 = $('#demo3a_departments3 option:selected').val();
        
        department1 = department1 || "";
        department2 = department2 || "";
        department3 = department3 || "";
        group = group || "";
        
        if(department1 !== "" && group !== "") {
            var query = '?department1='+department1;
            if(department2 !== "") {
                query += '&department2='+department2;
            }
            if(department3 !== "") {
                query += '&department3='+department3;
            }
            
            d3.json("compare/"+group+query, function(error,response) {
                if(error!==null) console.log(error.message);
                RadarChart("#demo3a", response, radarChartOptions);
            });
        }
    });
    
    $('.demo3b').change(function() {
        let group = $('#demo3b_groups option:selected').val();
        let person1 = $('#demo3b_people1 option:selected').val();
        let person2 = $('#demo3b_people2 option:selected').val();
        let person3 = $('#demo3b_people3 option:selected').val();
        
        person1 = person1 || "";
        person2 = person2 || "";
        person3 = person3 || "";
        group = group || "";
        
        if(person1 !== "" && group !== "") {
            var query = '?person1='+person1;
            if(person2 !== "") {
                query += '&person2='+person2;
            }
            if(person3 !== "") {
                query += '&person3='+person3;
            }
            
            d3.json("compare/"+group+query, function(error,response) {
                if(error!==null) console.log(error.message);
                RadarChart("#demo3b", response, radarChartOptions);
            });
        }
    });
    
    RadarChart("#demo3a", undefined, radarChartOptions);
    RadarChart("#demo3b", undefined, radarChartOptions);
};

$(window).ready(function() {
    loadSelects();
    
    loadAster();
    loadBubble();
    loadRadar();
});
