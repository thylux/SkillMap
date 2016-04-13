$(window).ready(function() {
	asterInit("#demo1a", demo1a);
    asterInit("#demo1b", demo1b);
    
    bubbleInit("#demo2a", demo2a);
    bubbleInit("#demo2b", demo2b);
    
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
