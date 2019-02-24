var myMap = L.map("map", {
    center: [37.0902, -130.7129],
    zoom: 4
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);


var m45_url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
var all_url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(all_url, function(response) {
    var features = response.features;
    features.forEach((quake,i) => {
        console.log(`${i}: ${quake.properties.title}, ${quake.geometry.coordinates}`)
        if (quake.properties.mag > 4.5) {
            color = "#ff0000"
        }
        else if (quake.properties.mag > 3.5) {
            color = "#ff9900"
        }
        else if (quake.properties.mag > 2.5) {
            color = "#ffff00"
        }
        else {
            color = "#ffffb2"
        }
        var format = {
            color: color,
            fillColor: color,
            fillOpacity: "0.5",
            weight: "1",
            radius: quake.properties.mag *10000
        }
        L.circle([quake.geometry.coordinates[1],quake.geometry.coordinates[0]], format)
            .addTo(myMap);
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

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

});