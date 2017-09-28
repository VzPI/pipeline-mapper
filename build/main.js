// THIS IS OUR CORE JS FILE, WHICH IS BUNDLED TO public/scripts/bundle.js
require("leaflet")
require("leaflet-pulse-icon")
let marker,
	radius,
	watchPosition,
	isWatching = false // USED TO DETERMINE WHETHER OR NOT GEOLOCATION IS CURRENTLY RUNNING
const mapData = require("./map_data.js"),
	map = L.map("map", {"zoomControl": false}).setView([41.384660, -74.473034], 12),
	icon = L.icon.pulse(),
	watchPositionButton = document.getElementById("watch-position"),
	clearWatch = (watchPosition) => {
		isWatching = false
		map.removeLayer(marker)
		map.removeLayer(radius)
		return window.navigator.geolocation.clearWatch(watchPosition)
	},
	updateMarkerAndRadius = (latitude, longitude, accuracy) => {
		if (marker && radius) {
			map.removeLayer(marker)
			map.removeLayer(radius)
			marker = L.marker([latitude, longitude], {"icon": icon}).addTo(map)
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

		isWatching = true
		map.setZoom(19)
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

		clearWatch(watchPosition) // NOT LIKELY TO BE NECESSARY, BUT CLEANUP JUST IN CASE
		return alert(`Error ${err.code}: ${message}`)
	},
	watch = () => {
		watchPosition = navigator.geolocation.watchPosition(success, error, {
			"maximumAge": 0, // DO NOT USE A CACHED POSITION, RETRIEVE CURRENT REAL POSITION
			"timeout": 15000, // TRY TO ACCESS LOCATION FOR 15 SECONDS BEFORE THROWING TIMEOUT ERROR
			"enableHighAccuracy": true
		})
		return false
	}

L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png", {"maxZoom": 21}).addTo(map)
L.control.scale({"position": "bottomright"}).addTo(map)
mapData.addTo(map)

watchPositionButton.addEventListener("click", () => {
	if (isWatching) {
		clearWatch(watchPosition)
	} else {
		watch()
	}
})