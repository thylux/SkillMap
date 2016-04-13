function bubbleInit(graph, data) {
    let universe = 0, i = 0;
    
    let diameter = 450; //$(document).height() / 2 - 100,
        scale = 18  ,
        format = d3.format(",d");
        // to use if we need to classify skills
        //color = d3.scale.category20c();

    let bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter]);
    
    data.skills.forEach(function(d) {
        d.id = i++;
        d.color = rainbow(data.skills.length, i);
        universe++;
    });
    
    let svg = d3.select(graph)
        .attr("width", diameter)
        .attr("height", diameter)
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
        .text(function(d) { return d.name + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.value * scale; })
        .style("fill", function(d) { return rainbow(universe, d.id); });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.name.substring(0, d.value * scale / 3); });
};
