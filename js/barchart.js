// This is the javascript for the barcharts
var margin = 90,
    width = 950-margin*2,
    height = 450-margin*2;

var x = d3.scaleBand().rangeRound([0, width], .05);

var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y).ticks(10);

var barpadding = 8;

var tooltip = d3.select("#chart-container").append("div")	
.attr("class", "tooltip")				
.style("opacity", 0);

var svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + 2 * margin)
    .attr("height", height + 2 * margin)
    .append("g")
    .attr("transform", `translate(${margin},${margin})`)


// Draw the graph    
function render(csv){
    var csvPath = "data/hive\ plant\ species\ data/"+csv+".csv"
    d3.csv(csvPath, function(err, data) {

        console.log(err)
        console.log(data)
    
      x.domain(data.map(function(d) { return d[data.columns[1]]; }));
      y.domain([0, d3.max(data, function(d) { 
      	console.log(d[data.columns[0]] * 100);
      	return d[data.columns[0]] * 100; })]);

      // Draw the axes
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)        
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-35)" 
            });

      // Rotate the plant names
      // I think I'm having an issue selecting the x axis text. Since there doesn't seem to be any text being appended to the axis
      svg.selectAll("x axis")
      	.attr("transform", function (d) {
      		console.log('can you hear me')
      		return "translate(" + (this.getBBox().width) + "," + this.getBBox().height + ")rotate(-45)";
      	})

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      // Add the labels for the axes taken from Pheobe Bright's Block http://bl.ocks.org/phoebebright/3061203
      svg.append("text")
            .attr("text-anchor", "middle")  
            .attr("transform", "translate(" + -30 + "," + (height / 2) + ")rotate(-90)")
            .text("Percentage of Honey");

      svg.append("text")
       		.attr("text-anchor", "middle")
       		.attr("transform", "translate(" + (width / 2) + "," + (height + 50) + ")")
       		.text("Plant names");

      // Draw the bars
      svg.selectAll("bar")
          .data(data)
          .enter().append("rect")
          .style("fill", "steelblue")
          .attr("x", function(d) { return x(d[data.columns[1]]); })
          .attr("width", width / data.length - barpadding)
          .attr("y", function(d) { 
              console.log(d[data.columns[0]]);
              console.log(d);
              return y(d[data.columns[0]] * 100); 
            })
          .attr("height", function(d) { return height - y(d[data.columns[0]] * 100); })
          .on("mouseover", function(d, i) {
            tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);		
            console.log(d)
            tooltip.html(d["Common Name"])	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d, i) {
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
          });
    });
}

function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

function update(csv){
    svg.selectAll("*").remove();
    render(csv);
}

update("S017413");
