var width = 1200;
var height = 600;

var proj = d3.geo.albersUsa()
    .scale(1200)
    .translate([width / 2, height / 2]);

var path = d3.geo.path().projection(proj);

var zipObj;
var keyArray;
var totalZipCodes;

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
    keyArray = Object.keys(zipObj);
    totalZipCodes = keyArray.length;
    
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
    
    createRandomLines(); // executes immediatly
    
    // then again every 5 secs
    var intervalHndlr = setInterval(createRandomLines, 5000);
}

function createRandomLines() {
    var totalTime = 0;
        
    for (var i = 0; i < 5; i++) {
        var keyA = keyArray[Math.floor(Math.random() * totalZipCodes)];
        var keyB = keyArray[Math.floor(Math.random() * totalZipCodes)];            

        spawnLine(keyA, keyB, totalTime);

        totalTime += parseInt(Math.random() * 2000);
    }
}

function spawnLine(keyA, keyB, totalTime) {
    setTimeout(function () {
        //console.log('Drawing ' + keyA + ' -> ' + keyB + ' at ' + totalTime);
        drawLine(zipObj[keyA], zipObj[keyB]);
    }, totalTime);
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
    
    var width = Math.random() * 3;
    
    if (width < 0.25) {
        width = 0.25;
    }
    
    var widthStr = width + 'px';
    
    pathArcs.attr({ d : path })
        //.attr({'class' : '.route'})
        .style({
            stroke : 'lightgray',
            'stroke-width': widthStr
        })
        .call(lineTransition); 
    
    pathArcs.exit().remove();
}

var lineTransition = function lineTransition(path) {
    path.transition()
        .duration(777)
        .attrTween('stroke-dasharray', tweenDash)
        .each('end', function(d, i) { // call back on line completion
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
