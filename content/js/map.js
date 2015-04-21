var width = 1200;
var height = 600;

var proj = d3.geo.albersUsa()
    .scale(1200)
    .translate([width / 2, height / 2]);

var path = d3.geo.path().projection(proj);

var zipObj;

var lbcZip = '90806';
var txZip = '77044';

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

// global scope is where the cool kids hang out, right?
var svg;

function render(states) {
    svg = d3.select('#map').append('svg')
        .attr('width', width)
        .attr('height', height);
    
    svg.append('g').attr('id', 'states');
    
    d3.select('#states').selectAll('path')
        .data(states.features)
        .enter().append('path')
        .attr('d', path);
    
    // start out by displaying dots for now
    var latLongs = [];
    
    latLongs.push(zipObj[lbcZip]);
    latLongs.push(zipObj[txZip]);
    
    svg.append('g').attr('id', 'zipdots');
    
//    d3.select('#zipdots').selectAll('rect')
//        .data(latLongs).enter().append('rect')
//        .attr('x', function(d) { var p = proj([d.lon, d.lat]); return p ? p[0] : null; })
//        .attr('y', function(d) { var p = proj([d.lon, d.lat]); return p ? p[1] : null; })
//        .attr('class', 'zipdot')
//        .attr('width', 1).attr('height', 1);
    
    drawLine(zipObj[lbcZip], zipObj[txZip]);
}

function drawLine(a, b) {
    var route = [{
        type : "LineString",
        coordinates : [
            [ a.lon, a.lat ],
            [ b.lon, b.lat ]
        ]
    }];
    
    var pathArcs = svg.append('g').selectAll('.arc').data(route);
        
    pathArcs.enter().append('path')
        .attr({ 'class': 'arc' })
        .style({ fill: 'none', });
    
    pathArcs.attr({ d : path })
        //.attr({'class' : '.route'})
        .style({
            stroke : 'lightgray',
            'stroke-width': '2px'
        })
        .call(lineTransition); 
    
    pathArcs.exit().remove();
}

var lineTransition = function lineTransition(path) {
    path.transition()
        .duration(777)
        .attrTween('stroke-dasharray', tweenDash)
        .each('end', function(d, i) {
            // call back on line completion
            console.log('line is done!!');
        
            setTimeout(function () {
                path.transition()
                    .duration(1000)
                    .style('opacity', 0)
                    .remove();
            }, 500);
        });
};

var tweenDash = function tweenDash() {
    var len = this.getTotalLength();
    var interpolate = d3.interpolateString("0," + len, len + "," + len);

    return function(t) {
        return interpolate(t);
    };
};
