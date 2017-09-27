// THIS IS OUR CORE JS FILE, WHICH IS BUNDLED TO public/scripts/bundle.js
require("leaflet")
require("leaflet-pulse-icon")
let marker,
	radius,
	isWatching = false // USED TO DETERMINE WHETHER OR NOT GEOLOCATION IS CURRENTLY RUNNING
const mapData = require("./map_data.js"),
	map = L.map("map", {"zoomControl": false}).setView([41.384660, -74.473034], 12),
	icon = L.icon.pulse(),
	watchPositionButton = document.getElementById("watch-position"),
	watch = () => {
		return navigator.geolocation.watchPosition(success, error, {
			"maximumAge": 0, // DO NOT USE A CACHED POSITION, RETRIEVE CURRENT REAL POSITION
			"timeout": 15000, // TRY TO ACCESS LOCATION FOR 15 SECONDS BEFORE THROWING TIMEOUT ERROR
			"enableHighAccuracy": true
		})
	},
	clearWatch = (watch) => {
		isWatching = false
		map.removeLayer(marker)
		map.removeLayer(radius)
		window.navigator.geolocation.clearWatch(watch)
		// $("#watch_position").val("off");
		// $("#watch_position").html("Watch position");
	},
	updateMarkerAndRadius = (latitude, longitude, accuracy) => {
		if (marker && radius) {
			marker.setLatLng([latitude, longitude])
			map.removeLayer(radius)
			radius = L.circle([latitude, longitude], accuracy).addTo(map)
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
		return updateMarkerAndRadius(latitude, longitude, accuracy)
	},
	error = (err) => {
		let message

		if (err.code === 3) {
			message = "Could not get your location - please try again."
		} else {
			message = err.message
		}

		alert(`Error ${err.code}: ${message}`)
		return clearWatch(watch) // NOT LIKELY TO BE NECESSARY, BUT CLEANUP JUST IN CASE
	}

L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png", {"maxZoom": 21}).addTo(map)
L.control.scale({"position": "bottomright"}).addTo(map)
mapData.addTo(map)

watchPositionButton.addEventListener("click", () => {
	if (isWatching) {
		clearWatch()
	} else {
		isWatching = true
		watch()
		map.setZoom(19)
	}
})