function loadEmptyOption(select, allowSelection) {
    allowSelection = allowSelection || false;
    select.append('<option selected value>Escolha um valor...</option>');  
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
    
    d3.json("people", function(error,response) {
        loadEmptyOption($('select[name="people"]'));
        response.forEach(function(d) {
            $('select[name="people"]').append('<option value="' + d.id + '">' + d.name + '</option>');
        });
    });
    
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
        /*
        width: 300,
        height: 300,
        radius: (300 / 2) * 0.8,
        innerRadius: (300 / 2) * 0.24,
        */
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

$(window).ready(function() {
    loadSelects();
    loadAster();
    
    let bubbleChartOptions = {
	    diameter: 450,
	    scale: 18,
	    format: d3.format(",d"),
	    color: d3.scale.category20()
	};
    BubbleChart("#demo2", demo2a, bubbleChartOptions);
    
    let margin = {top: 50, right: 50, bottom: 50, left: 50};                
    let radarChartOptions = {
        w: Math.min(500, window.innerWidth - 10) - margin.left - margin.right,
        h: Math.min(500, window.innerHeight - margin.top - margin.bottom - 20),
        margin: margin,
        levels: 5,
        roundStrokes: true,
        color: d3.scale.ordinal().range(["#EDC951","#CC333F","#00A0B0"])
    };
    RadarChart("#demo3a", demo3a, radarChartOptions);
    RadarChart("#demo3b", demo3b, radarChartOptions);
});
