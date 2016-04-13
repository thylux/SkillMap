/*
 * FROM http://bl.ocks.org/bbest/2de0e25d4840c68f2db1
 */

var width = 300,
    height = 300,
    radius = (Math.min(width, height) / 2) * 0.8,
    innerRadius = 0.3 * radius;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return 1; });

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return d.data.name + ": <span style='color:orangered'>" + d.data.value + "</span>";
  });

var arc = d3.svg.arc()
  .innerRadius(innerRadius);

var outlineArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

function asterInit(graph, data) {
    let i = 0;
    let universe = 0, max = 0;
    
    data.levels.forEach(function(d) {
        d.color = rainbow(data.levels.length, i);
        i++;
        universe += d.value;
        max = Math.max(max, d.value);
    });
    
    let svg = d3.select(graph)
        .attr("width", width)
        .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.call(tip);
    
    svg.append("svg:text")
        .attr("transform", "translate(0," + (-height / 2) + ")")
        .attr("x", 10)
        .attr("y", 10)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle") // text-align: right
        .text("Avg. of " + data.skill + (data.context!=="overall" ?  (" of " + data.targetname) : "") + ". Universe of " + universe + " people.");
        
    arc.outerRadius(function (d) { 
        return (radius - innerRadius) * (d.data.value / max) + innerRadius; 
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