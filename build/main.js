// THIS IS OUR CORE JS FILE, WHICH IS BUNDLED TO public/scripts/bundle.js
require("leaflet")
const mapData = require("./map_data.js"),
	map = L.map("map", {"zoomControl": false}).setView([41.384660, -74.473034], 12)

L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png", {"maxZoom": 21}).addTo(map)
L.control.scale({"position": "bottomright"}).addTo(map)
mapData.addTo(map)