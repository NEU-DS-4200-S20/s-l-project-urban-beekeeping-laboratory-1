// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  console.log("Hello, world!");

  // Create the map background
  width = 821;
  height = 520;

  var mapsvg = d3
 	 .select('#map-container')
 	 .append('svg');

  var projection = d3
 	 .geoAlbersUsa()
 	 .translate(width / 2, height / 2)
 	 .scale(width);

  var path = d3.geoPath().projection(projection);

  d3.json('data/us.json', function(us) {
 	 drawMap(us)
 });

 function drawMap(us) {
 	console.log(us)

 	var mapGroup = mapsvg.append('g').attr('class', 'mapGroup');

 	mapGroup
 	.append('g')
 	.attr('id', 'states')
 	.selectAll('path')
 	.data(topojson.feature(us, us.objects.states).features)
 	.enter()
 	.append('path')
 	.attr('d', path)
 	.attr('class', 'state');

 }

})());