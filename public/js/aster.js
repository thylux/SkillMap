/*
 * Adapted from http://bl.ocks.org/bbest/2de0e25d4840c68f2db1
 */

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return 1; });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return d.data.name + ": <span style='color:orangered'>" + d.data.value + "</span>";
  });

function AsterChart(id, data, options) {
    let cfg = {
	 width: 300,
	 height: 300,
	 radius: (300 / 2) * 0.8,
     innerRadius: (300 / 2) * 0.24,
	 color: d3.scale.category10()
	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(let i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if
    
    // Clean before redraw
    d3.select(id).selectAll('*').remove();
    
    let svg = d3.select(id)
        .attr("width", cfg.width)
        .attr("height", cfg.height)
        .append("g")
            .attr("transform", "translate(" + cfg.width / 2 + "," + cfg.height / 2 + ")");
            
    if(data==undefined || data=="") {
        svg.append("text")
            .attr("text-anchor", "middle")
            .text("Sem dados para apresentar");
        return;  
    };
    
    let i = 0;
    let universe = 0, max = 0;
    
    let arc = d3.svg.arc()
        .innerRadius(cfg.innerRadius);
    var outlineArc = d3.svg.arc()
        .innerRadius(cfg.innerRadius)
        .outerRadius(cfg.radius);
    
    data.levels.forEach(function(d) {
        d.color = rainbow(data.levels.length, i);
        //d.color = cfg.color[i%10];
        i++;
        universe += d.value;
        max = Math.max(max, d.value);
    });

    svg.call(tip);
    
    svg.append("svg:text")
        .attr("transform", "translate(0," + (-cfg.height / 2) + ")")
        .attr("x", 10)
        .attr("y", 10)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle") // text-align: right
        .text("Universe of " + universe + " people.");
        
    arc.innerRadius(cfg.innerRadius);
    arc.outerRadius(function (d) { 
        return (cfg.radius - cfg.innerRadius) * (d.data.value / max) + cfg.innerRadius; 
    });
  
    let path = svg.selectAll(".solidArc")
        .data(pie(data.levels))
        .enter().append("path")
            .attr("fill", function(d) { return d.data.color; })
            .attr("class", "solidArc")
            .attr("stroke", "gray")
            .attr("d", arc)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

    let outerPath = svg.selectAll(".outlineArc")
        .data(pie(data.levels))
        .enter().append("path")
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("class", "outlineArc")
            .attr("d", outlineArc);  

    // calculate the weighted mean score
    let score = 
        data.levels.reduce(function(prev, curr) {
            return prev + curr.value / universe * curr.id
        }, 0);
        
    svg.append("svg:text")
        .attr("class", "aster-score")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle") // text-align: right
        .text(Math.round((score + 0.00001) * 100) / 100);
};