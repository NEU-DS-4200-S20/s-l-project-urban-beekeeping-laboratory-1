// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  var width = 1000;
  var height = 600;

  var svg = d3
	.select("#map-container")
	.append("svg")
	.attr("width", width)
	.attr("height", height)
    .call(d3.zoom()
    	.on("zoom", function () {
              svg.attr("transform", d3.event.transform)
      }))
    .append("g");

  var projection = d3
	.geoMercator();
	// .translate([width / 2, height / 2])
	// .scale(width);
  
  var zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', zoomed);
  
  var path = d3.geoPath().projection(projection);

  svg
    .call(zoom)
    // .call(zoom.event);
  
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
	    // Also need to add something so it doesn't add multiple data points for the same latitude and longitude
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
	    })
  	}	

	function zoomed() {
	  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}

	d3.select(self.frameElement).style("height", height + "px");



})());