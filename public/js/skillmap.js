function loadSelects() {
    d3.json("http://localhost:8081/domains", function(error,response) {
        if (error) return console.warn(error);
        
        response.forEach(function(d) {
            $('select[name="domains"]').append('<option value="' + d.id + '">' + d.name + '</option>');
        });
    });
    
    d3.json("http://localhost:8081/groups", function(error,response) {
        if (error) return console.warn(error);
        
        response.forEach(function(d) {
            $('select[name="groups"]').append('<option value="' + d.id + '">' + d.name + '</option>');
        });
    });
    
    d3.json("http://localhost:8081/skills", function(error,response) {
        if (error) return console.warn(error);
        
        response.forEach(function(d) {
            $('select[name="skills"]').append('<option value="' + d.id + '">' + d.name + '</option>');
        });
    });
    
    d3.json("http://localhost:8081/people", function(error,response) {
        if (error) return console.warn(error);
        
        response.forEach(function(d) {
            $('select[name="people"]').append('<option value="' + d.id + '">' + d.name + '</option>');
        });
    });
}

function loadAster() {
    let asterChartOptions = {
        /*
        width: 300,
        height: 300,
        radius: (300 / 2) * 0.8,
        innerRadius: (300 / 2) * 0.24,
        */
    };
    
    $('.demo1b').change(function() {
        let skill = $('.demo1b skills').val();
        let group = $('.demo1b groups').val();
        AsterChart("#demo1b", demo1b, asterChartOptions);
    });
    
    AsterChart("#demo1a", demo1a, asterChartOptions);
    
}

$(window).ready(function() {
    loadSelects();
    loadAster();
    
    let bubbleChartOptions = {
	    diameter: 450,
	    scale: 18,
	    format: d3.format(",d"),
	    color: d3.scale.category20()
	};
    BubbleChart("#demo2a", demo2a, bubbleChartOptions);
    BubbleChart("#demo2b", demo2b, bubbleChartOptions);
    
    let margin = {top: 50, right: 50, bottom: 50, left: 50};                
    let radarChartOptions = {
        w: Math.min(500, window.innerWidth - 10) - margin.left - margin.right,
        h: Math.min(width, window.innerHeight - margin.top - margin.bottom - 20),
        margin: margin,
        levels: 5,
        roundStrokes: true,
        color: d3.scale.ordinal().range(["#EDC951","#CC333F","#00A0B0"])
    };
    RadarChart("#demo3a", demo3a, radarChartOptions);
    RadarChart("#demo3b", demo3b, radarChartOptions);
});
