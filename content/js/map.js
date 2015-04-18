var width = 1200;
var height = 600;

var proj = d3.geo.albersUsa()
    .scale(1200)
    .translate([width / 2, height / 2]);

var path = d3.geo.path().projection(proj);

// load the data files, then call render()
queue()
    .defer(d3.json, "js/us-states.geojson")
// load zip lat/lon here
    .await(render);


// function render(error, states, zips) {
function render(error, states) {
    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);
    
    svg.append("g").attr("id", "states");
    
    d3.select("#states").selectAll("path")
        .data(states.features)
        .enter().append("path")
        .attr("d", path);
}