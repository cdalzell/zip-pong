var width = 1200;
var height = 600;

var proj = d3.geo.albersUsa()
    .scale(1200)
    .translate([width / 2, height / 2]);

var path = d3.geo.path().projection(proj);

var zipObj;

// load the data files, then call ready()
queue()
    .defer(d3.json, 'js/us-states.geojson')
    .defer(loadZips, 'js/zipcodes.json')
    .await(ready);

function loadZips(path, callback) {
    $.ajax({
        url: path,
        dataType: "json",
        success: function(response) {
            callback(null, response);
        }
    });
}

function ready(err, states, zips) {
    zipObj = zips;
    
    render(states);
}

function render(states) {
    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);
    
    svg.append("g").attr("id", "states");
    
    d3.select("#states").selectAll("path")
        .data(states.features)
        .enter().append("path")
        .attr("d", path);
}
