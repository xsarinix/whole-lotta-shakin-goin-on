var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 3
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
        var radius = quake.properties.mag * 10000;
        var format = {
            color: "red",
            fillColor: "red",
            fillOpacity: "0.5",
            radius: radius
        }
        L.circle([quake.geometry.coordinates[1],quake.geometry.coordinates[0]], format)
            .addTo(myMap);
    });
});