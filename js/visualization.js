// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  var width = 1250;
  var height = 700;

  var svg = d3
	.select("#map-container")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

  var projection = d3
	.geoAlbersUsa()
	.translate([width / 2, height / 2])
	.scale(width);
  
  var path = d3.geoPath().projection(projection);

  // select the svg area
  var legend = svg
  	.append("g")
  	.attr("class", "map-legend")
  	.attr("transform", "translate(850,450)");

  // Handmade legend
  legend.append("circle").attr("cx",200).attr("cy",0).attr("r", 6).style("fill", "green")
  legend.append("circle").attr("cx",200).attr("cy",30).attr("r", 6).style("fill", "red")
  legend.append("circle").attr("cx",200).attr("cy",60).attr("r", 6).style("fill", "orange")
  legend.append("text").attr("x", 220).attr("y", 0).text("Healthy Hive").style("font-size", "15px").attr("alignment-baseline","middle")
  legend.append("text").attr("x", 220).attr("y", 30).text("Unhealthy Hive").style("font-size", "15px").attr("alignment-baseline","middle")
  legend.append("text").attr("x", 220).attr("y", 60).text("No Data").style("font-size", "15px").attr("alignment-baseline","middle")


  d3.json("data/us.json", function(us) {
	//Error
	d3.csv("data/cities_to_plot.csv", function(cities) {
		drawMap(us, cities);
	});
  });

  function drawMap(us, cities) {
	var mapGroup = svg.append("g").attr("class", "mapGroup");

	mapGroup
	  .append("g")
	  // .attr("id", "states")
	  .selectAll("path")
	  .data(topojson.feature(us, us.objects.states).features)
	  .enter()
	  .append("path")
	  .attr("d", path)
	  .attr("class", "states");

	mapGroup
	  .append("path")
	  .datum(
		topojson.mesh(us, us.objects.states, function(a, b) {
		  return a !== b;
		})
	  )
	  .attr("id", "state-borders")
	  .attr("d", path);


  	var circles = svg
	    .selectAll("circle")
	    .data(cities)
	    .enter()
	    .append("circle")
	    .attr("class", "cities")
	    .attr("cx", function(d) {
	    	console.log(d)
	      return projection([d.Longitude, d.Latitude])[0];
	    })
	    .attr("cy", function(d) {
	      return projection([d.Longitude, d.Latitude])[1];
	    })
	    .attr("r", 4)
	    .style('fill', function(d) {
	    	console.log(d.Health);
	        	if (d.Health == "Good" || d.Health == "Excellent") { 
	        		return "green"; 
	        	}
        		else if (d.Health == "Troubled") { 
        			return "red"; 
        		} 
        		else {
        			return "orange";
        		}
    	})

	    .on('mouseover', function(d, i) {
	      console.log("mouseover on", this);
	      // make the mouseover'd element
		  // bigger and red
		  update(d["Hive ID"])
	      d3.select(this)
	        .transition()
	        .duration(100)
	        .attr('r', 20)
	        .attr('fill', 'orange');
	    })
	    .on('mouseout', function(d, i) {
	      console.log("mouseout", this);
	      // return the mouseover'd element
	      // to being smaller and black
	      d3.select(this)
	        .transition()
	        .duration(100)
	        .attr('r', 4)
	        .attr('fill', '#000000');
	    });

    // svg.append("g").call(brush);
  }




})());