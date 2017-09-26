// THIS IS OUR CORE JS FILE, WHICH IS BUNDLED TO public/scripts/bundle.js
require("leaflet")
const mapData = require("./map_data.js"),
	map = L.map("map", {"zoomControl": false}).setView([41.384660, -74.473034], 12),
	watchPositionButton = document.getElementById("watch-position"),
	success = (position) => {
		const latitude = position.coords.latitude,
			longitude = position.coords.longitude,
			accuracy = position.coords.accuracy

		map.setView(new L.LatLng(latitude, longitude))
		map.setZoom(19)
	},
	error = (err) => {
		alert(`Error ${err.code}: ${err.message}`)
	}

L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png", {"maxZoom": 21}).addTo(map)
L.control.scale({"position": "bottomright"}).addTo(map)
mapData.addTo(map)

watchPositionButton.addEventListener("click", () => {
	navigator.geolocation.watchPosition(success, error, {
		"maximumAge": 0, // DO NOT USE A CACHED POSITION, RETRIEVE CURRENT REAL POSITION
		"timeout": Infinity, // DO NOT RETURN UNTIL THE POSITION IS AVAILABLE
		"enableHighAccuracy": true
	})
})