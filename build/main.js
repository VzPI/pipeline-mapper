// THIS IS OUR CORE JS FILE, WHICH IS BUNDLED TO public/scripts/bundle.js
require("leaflet")
require("leaflet-pulse-icon")
let marker,
	radius
const mapData = require("./map_data.js"),
	map = L.map("map", {"zoomControl": false}).setView([41.384660, -74.473034], 12),
	icon = L.icon.pulse(),
	watchPositionButton = document.getElementById("watch-position"),
	updateMarkerAndRadius = (latitude, longitude, accuracy) => {
		if (marker && radius) {
			marker.setLatLng([latitude, longitude])
			radius.setLatLng([latitude, longitude], accuracy)
		} else {
			marker = L.marker([latitude, longitude], {"icon": icon}).addTo(map)
			radius = L.circle([latitude, longitude], accuracy).addTo(map)
		}

		return false
	},
	success = (position) => {
		const latitude = position.coords.latitude,
			longitude = position.coords.longitude,
			accuracy = position.coords.accuracy

		map.setView(new L.LatLng(latitude, longitude))
		updateMarkerAndRadius(latitude, longitude, accuracy)
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
	map.setZoom(19)
})