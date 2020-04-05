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

function render(csv){
    var csvPath = "data/hive\ plant\ species\ data/"+csv+".csv"
    d3.csv(csvPath, function(err, data) {

        console.log(err)
        console.log(data)
    
      x.domain(data.map(function(d) { return d[data.columns[1]]; }));
      y.domain([0, d3.max(data, function(d) { return d[data.columns[0]]; })]);

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
          .attr("x", function(d) { return x(d[data.columns[1]]); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { 
              console.log(d[data.columns[0]]);
              console.log(d);
              return y(d[data.columns[0]]); 
            })
          .attr("height", function(d) { return height - y(d[data.columns[0]]); });
    });
}

function update(csv){
    svg.selectAll("*").remove();
    render(csv);
}

update("S017413");
