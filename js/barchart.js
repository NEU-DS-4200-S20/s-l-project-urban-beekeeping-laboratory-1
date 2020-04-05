// This is the javascript for the barcharts
var width = 600,
    height = 300;

var x = d3.scaleBand().rangeRound([0, width], .05);

var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y).ticks(10);

var svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + 40)
    .attr("height", height + 110);

d3.csv("data/hive plant species data/S011899.csv", function(err, data) {

    console.log(err)
    console.log(data)

  x.domain(data.map(function(d) { return d["Common Name"]; }));
  y.domain([0, d3.max(data, function(d) { return d.Percentage; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d["Common Name"]); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.Percentage); })
      .attr("height", function(d) { return height - y(d.Percentage); });
});