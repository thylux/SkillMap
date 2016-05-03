/*
 * Adapted from http://bl.ocks.org/mbostock/4063269
 */

/* Data Format
{
 'context': 'personal' | 'group' | 'overall',
 'targetname': '',
 'skills': [
	{'name': 'skill_name1', 'label': 'value 1 name', 'value': 1},
	{'name': 'skill_name2', 'label': 'value 5 name', 'value': 5}
 ]
}
*/

function BubbleChart(id, data, options) {
    let cfg = {
	 height: 450,
     width: 450,
     padding: 5,
	 format: d3.format(",d"),
	 color: d3.scale.category20()
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
        .attr("height", cfg.height);
        
    let g = svg.append("g")
        .attr("class", "bubble");
        
    if(data==undefined || data=="") {
        g.append("text")
            .attr("text-anchor", "middle")
            .text("No data available");
        return;  
    };
    
    let universe = 0;
    let bubble = d3.layout.pack()
        .sort(null)
        .size([cfg.width, cfg.height])
        .padding(cfg.padding);
    
    data.skills.forEach(function(d) {
        d.id = universe++;
        d.color = rainbow(data.skills.length, universe);
        d.level = d.value;
        d.value = d.value * d.value;
    });
        
    g.append("svg:text")
        .attr("x", 10)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text("Skill set" + (data.context!=="overall" ?  (" for " + data.targetname) : "") + ". " + (data.context!=="personal" ?  ("Universe of " + universe + " people.") : ""));
    
    let node = g.selectAll(".node")
        .data(bubble.nodes({children: data.skills})
        .filter(function(d) { return !d.children; }))
        .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.name + ": " + cfg.format(d.level); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return cfg.color(d.id); /*rainbow(universe, d.id);*/ });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.name.substring(0, d.r / 3); });
    
    // TODO : d3.tip with d.label
};
