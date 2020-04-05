// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  var width = 960;
  var height = 500;
  
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
	    .attr("r", 5);
}


})());