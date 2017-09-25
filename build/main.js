require("leaflet")
const alignment = require("./alignment.js"),
	map = L.map("map", {"zoomControl": false}).setView([41.385334, -74.452829], 9)

L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png", {"maxZoom": 21}).addTo(map)
L.control.scale({"position": "bottomright"}).addTo(map)
map.addLayer(alignment)