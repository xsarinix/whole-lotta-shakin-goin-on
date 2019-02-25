var platesURL="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"
var m45QuakesURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
var allQuakesURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var quakeMarkers = L.layerGroup();

d3.json(allQuakesURL, function(response) {
    var features = response.features;
    console.log(features);
    features.forEach((quake,i) => {
        var ts = new Date(quake.properties.time)
        if (quake.properties.mag > 4.5) {
            color = "#ff0000"
            radius = quake.properties.mag * 15000
        }
        else if (quake.properties.mag > 3.5) {
            color = "#ff9900"
            radius = quake.properties.mag * 10000
        }
        else if (quake.properties.mag > 2.5) {
            color = "#ffff00"
            radius = quake.properties.mag * 7500
        }
        else {
            color = "#ffffb2"
            radius = quake.properties.mag * 5000
        }
        var format = {
            color: color,
            fillColor: color,
            fillOpacity: "0.5",
            weight: "1",
            radius: radius
        }
        quakeMarkers.addLayer(L.circle([quake.geometry.coordinates[1],quake.geometry.coordinates[0]], format)
            .bindPopup(`${ts}: ${quake.properties.title}`)
        );
    });
});

var plateLayer = L.layerGroup();

d3.json(platesURL, function(data) {
    console.log(data);
    plateLayer.addLayer(L.geoJSON(data, {
        style: {
            color: "white",
            weight: 1.5
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`Plate: ${feature.properties.PlateName}`)
        }
    }));
});

var OpenMapSurfer_Roads = L.tileLayer('https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var OpenStreetMap_BlackAndWhite = L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var baseMaps = {
    "Traditional": OpenMapSurfer_Roads,
    "Topographical": OpenTopoMap,
    "Satellite": Esri_WorldImagery,
    "Greyscale": OpenStreetMap_BlackAndWhite
}

var overlayMaps = {
    "Earthquakes": quakeMarkers,
    "Tectonic Plates": plateLayer
}

var myMap = L.map("map", {
    center: [37, -100],
    zoom: 4,
    layers: [OpenMapSurfer_Roads, quakeMarkers]
});

// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ["<2.5", "2.5-3.5", "3.5-4.5", ">4.5"];
    var colors = ["#ffffb2", "#ffff00", "#ff9900", "#ff0000"];
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Magnitude</h1>"
    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\">"+limit+"</li>");
    });

    div.innerHTML += "<ul class=\"list-unstyled\">" + labels.join("") + "</ul>";
    return div;
};

// Adding legend to the map
legend.addTo(myMap);

L.control.layers(baseMaps, overlayMaps).addTo(myMap);
