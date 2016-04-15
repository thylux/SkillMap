function loadSelects() {
    d3.json("http://localhost:8081/domains", function(error,response) {
        response.forEach(function(d) {
            $('#domains').append('<option value="' + d.id + '">' + d.name + '</option>');
        });
    });
    
    d3.json("http://localhost:8081/groups", function(error,response) {
        response.forEach(function(d) {
            $('#groups').append('<option value="' + d.id + '">' + d.name + '</option>');
        });
    });
    
    d3.json("http://localhost:8081/skills", function(error,response) {
        response.forEach(function(d) {
            $('#skills').append('<option value="' + d.name + '">' + d.name + '</option>');
        });
    });
    
    d3.json("http://localhost:8081/people", function(error,response) {
        response.forEach(function(d) {
            $('#people').append('<option value="' + d.name + '">' + d.name + '</option>');
        });
    });
}

$(window).ready(function() {
    loadSelects();
    
    let asterChartOptions = {
        /*
        width: 300,
        height: 300,
        radius: (300 / 2) * 0.8,
        innerRadius: (300 / 2) * 0.24,
        */
    };
    AsterChart("#demo1a", demo1a, asterChartOptions);
    AsterChart("#demo1b", demo1b, asterChartOptions);
    
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
