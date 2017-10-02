// THIS IS OUR CORE JS FILE, WHICH IS BUNDLED TO public/scripts/bundle.js
require("leaflet")
require("leaflet-pulse-icon")
let marker,
	radius,
	watchPosition,
	isWatching = false, // USED TO DETERMINE WHETHER OR NOT GEOLOCATION IS CURRENTLY RUNNING
	firstWatch = true // WATCH POSITION WILL RETURN SUCCESS OVER AND OVER - USE THIS VARIABLE TO MAKE SURE VIEW AND ZOOM ARE ONLY SET THE FIRST PASS
const mapData = require("./map_data.js"),
	map = L.map("map", {"zoomControl": false}).setView([41.384660, -74.473034], 12),
	icon = L.icon.pulse({
		"iconSize": [15, 15],
		"color": "#FFFF49"
	}),
	watchPositionButton = document.getElementById("watch-position"),
	clearWatch = (watchPosition) => {
		if (marker && radius) {
			map.removeLayer(marker)
			map.removeLayer(radius)
		}

		return navigator.geolocation.clearWatch(watchPosition)
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

		if (firstWatch) {
			map.setZoom(19)
			map.setView(new L.LatLng(latitude, longitude))
		}

		firstWatch = false
		return updateMarkerAndRadius(latitude, longitude, accuracy)
	},
	error = (err) => {
		// THERE SEEMS TO BE A BUG WHERE CALLING clearWatch() CONTINUES TO RUN watchPosition()
		// UNTIL A TIMEOUT ERROR OCCURS, IF success IS NOT CALLED.
		// USE THIS CONDITIONAL SO THAT A USER IS ONLY NOTIFIED OF ERRORS THAT OCCUR WHILE THEY'RE TRYING TO WATCH THEIR POSITION
		if (isWatching) {
			let message

			if (err.code === 3) {
				message = "Could not get your location - please try again."
			} else {
				message = err.message
			}

			setWatch() // RESET THE UI TO INACTIVE MODE
			clearWatch(watchPosition) // NOT LIKELY TO BE NECESSARY, BUT CLEANUP JUST IN CASE
			return alert(`Error ${err.code}: ${message}`)
		}

		// QUIETLY RETURN IN SITUATIONS WHERE WATCHING MAY HAVE BEEN CANCELLED BEFORE
		// success CALLBACK IS RETURNED
		return false
	},
	watch = () => {
		watchPosition = navigator.geolocation.watchPosition(success, error, {
			"maximumAge": 0, // DO NOT USE A CACHED POSITION, RETRIEVE CURRENT REAL POSITION
			"timeout": 15000, // TRY TO ACCESS LOCATION FOR 15 SECONDS BEFORE THROWING TIMEOUT ERROR
			"enableHighAccuracy": true
		})

		return false
	},
	// WE ARE DONE WATCHING, SWITCH BACK TO WATCH (INACTIVE) UI
	setWatch = () => {
		isWatching = false
		watchPositionButton.className = "btn btn-info col-xs-5"
		watchPositionButton.childNodes[1].innerHTML = "Watch"
		watchPositionButton.childNodes[1].className = "button-text"
	},
	// WE ARE WATCHING, SWITCH TO WATCHING (ACTIVE) UI
	setWatching = () => {
		isWatching = true
		firstWatch = true
		watchPositionButton.className = "btn btn-warning col-xs-5"
		watchPositionButton.childNodes[1].className = "button-text animated flash"
		watchPositionButton.childNodes[1].innerHTML = "Watching..."
	}

L.tileLayer("", {"maxZoom": 21}).addTo(map)
L.control.scale({"position": "bottomright"}).addTo(map)

// ADD THE ALIGNMENT TO THE MAP. ALL OTHER FEATURES ARE ADDED CONDITIONALLY BASED ON ZOOM LEVEL
map.addLayer(mapData.alignment)

// FUNCTIONS TO CONTROL WHAT LAYERS ARE VISIBLE, DEPENDING ON ZOOM LEVEL
map.on("zoomend", () => {
	const zoomLevel = map.getZoom()

	if (zoomLevel < 14) {
		// REMOVE EVERYTHING EXCEPT FOR THE ALIGNMENT
		for (let i = 0; i < Object.keys(mapData).length; i++) {
			if (Object.keys(mapData)[i] !== "alignment") {
				map.removeLayer(mapData[Object.keys(mapData)[i]])
			}
		}
	} else if (zoomLevel >= 14 && zoomLevel <= 18) {
		// ADD EVERYTHING EXPECT FOR THE ALIGNMENT (ALREADY ON THE MAP) AND ONE HUNDRED FOOT GRID
		for (let i = 0; i < Object.keys(mapData).length; i++) {
			if (Object.keys(mapData)[i] !== "alignment" && Object.keys(mapData)[i] !== "oneHundredFootGrid") {
				map.addLayer(mapData[Object.keys(mapData)[i]])
			}
		}

		// IF THE GRID IS ON THE MAP, REMOVE IT
		map.removeLayer(mapData.oneHundredFootGrid)
	} else {
		// ADD EVERYTHING EXPECT FOR THE ALIGNMENT (ALREADY ON THE MAP)
		for (let i = 0; i < Object.keys(mapData).length; i++) {
			if (Object.keys(mapData)[i] !== "alignment") {
				map.addLayer(mapData[Object.keys(mapData)[i]])
			}
		}
	}
})

watchPositionButton.addEventListener("click", () => {
	if (isWatching) {
		setWatch()
		clearWatch(watchPosition)
	} else {
		setWatching()
		watch()
	}
})