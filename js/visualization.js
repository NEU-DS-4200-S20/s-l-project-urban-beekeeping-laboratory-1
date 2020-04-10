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
  
  d3.json("data/us.json", function(us) {
	//Error
	d3.csv("data/ids_cities_with_coords.csv", function(cities) {
		drawMap(us, cities);
	});
  });

  function drawChart(data) {

  //   console.log(data)

  // 	x.domain(data.map(function(d) { return d["Common Name"]; }));
  // 	y.domain([0, d3.max(data, function(d) { return d.Percentage; })]);

  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(xAxis)
  //   .selectAll("text")
  //     .style("text-anchor", "end")
  //     .attr("dx", "-.8em")
  //     .attr("dy", "-.55em")
  //     .attr("transform", "rotate(-90)" );

  // svg.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis)
  //   .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", ".71em")
  //     .style("text-anchor", "end")
  //     .text("Value ($)");

  // svg.selectAll("bar")
  //     .data(data)
  //   .enter().append("rect")
  //     .style("fill", "steelblue")
  //     .attr("x", function(d) { return x(d["Common Name"]); })
  //     .attr("width", x.bandwidth())
  //     .attr("y", function(d) { return y(d.Percentage); })
  //     .attr("height", function(d) { return height - y(d.Percentage); });
  }

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
	    // Also need to add something so it doesn't add multiple data points for the same latitude and longitude
	    .attr("cx", function(d) {
	    	console.log(d)
	      return projection([d.Longitude, d.Latitude])[0];
	    })
	    .attr("cy", function(d) {
	      return projection([d.Longitude, d.Latitude])[1];
	    })
	    .attr("r", 4)
	    	// Guys I have no idea how to write this function in javascript. Want to change the color of each hive 
	    	// depending on it's condition in the cleaned_health_data csv. 
	    	
	    		// I'm thinking just change the id so then the actual colors can be adjusted in css
	    .on('mouseover', function(d, i) {
	      console.log("mouseover on", this);
	      // make the mouseover'd element
		  // bigger and red
		  update(d["Hive ID"])
	      d3.select(this)
	        .transition()
	        .duration(100)
	        .attr('r', 20)
	        .attr('fill', '#ff0000');
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