function BubbleChart(id, data, options) {
    let cfg = {
	 diameter: 450,
	 scale: 18,
	 format: d3.format(",d"),
	 color: d3.scale.category20()
	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(let i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if
    
    let universe = 0;
    let bubble = d3.layout.pack()
        .sort(null)
        .size([cfg.diameter, cfg.diameter]);
    
    data.skills.forEach(function(d) {
        d.id = universe++;
        d.color = rainbow(data.skills.length, universe);
    });
    
    let svg = d3.select(id)
        .attr("width", cfg.diameter)
        .attr("height", cfg.diameter)
        .attr("class", "bubble");
        
    svg.append("svg:text")
        .attr("x", 10)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text("Skill set" + (data.context!=="overall" ?  (" for " + data.targetname) : "") + ". " + (data.context!=="personal" ?  ("Universe of " + universe + " people.") : ""));
    
    let node = svg.selectAll(".node")
        .data(bubble.nodes({children: data.skills})
        .filter(function(d) { return !d.children; }))
        .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.name + ": " + cfg.format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.value * cfg.scale; })
        .style("fill", function(d) { return cfg.color(d.id); /*rainbow(universe, d.id);*/ });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.name.substring(0, d.value * cfg.scale / 3); });
};
