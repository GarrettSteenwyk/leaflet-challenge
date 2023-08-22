const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var myMap = L.map("map", {
    center: [38.50, -100.00],
    zoom: 4.5,
    layers: [streets]
});


//define basemaps as the streetmap
let baseMaps = {
    "streets": streets
};

let earthquake_data = new L.LayerGroup();

let overlays = {
    "Earthquakes": earthquake_data,
};

//add a control layer and pass in baseMaps and overlays
L.control.layers(baseMaps, overlays).addTo(myMap);

//style for the markers
function styleInfo(feature) {
    return {
        color: "#000000",
        radius: chooseRadius(feature.properties.mag), //sets radius based on magnitude 
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        weight: 0.5,
        fillOpacity: 0.8
    }
};

//style for the marker fill colors
function chooseColor(depth) {
    if (depth <= 10) return "#9BFF00";
    else if (depth > 10 & depth <= 30) return "#DEF08C";
    else if (depth > 30 & depth <= 50) return "#F3D111";
    else if (depth > 50 & depth <= 70) return "orange";
    else if (depth > 70 & depth <= 90) return "#F5824D";
    else return "red";
};

//marker radius
function chooseRadius(magnitude) {
    return magnitude*5;
};

d3.json(url).then(function (data) { //pull the earthquake JSON data with d3
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {  
            return L.circleMarker(latlon).bindPopup(feature.id);
        },
        style: styleInfo 
    }).addTo(earthquake_data); 
    earthquake_data.addTo(myMap);
});

// Color selection for the legend
function getColor(d) {
    return d > 90  ? 'red' :
           d > 70  ? '#F5824D' :
           d > 50  ? 'orange' :
           d > 30  ? '#F3D111' :
           d > 10  ? '#DEF08C' :
                      '#9BFF00';
}

var legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend");
    grades = [-10, 10, 30, 50, 70, 90],
    labels = [];

    div.innerHTML += "<h4>Depth Color Legend</h4>";
    // loop to generate legend labels and associated colors
    for (var i = 0; i < grades.length; i++) {
        
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };
  
  legend.addTo(myMap);


