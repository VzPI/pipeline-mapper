// COLLECT THE GEOJSONS FROM THE LIBRARY, STYLE THEM, AND PASS THEM TO main.js TO BE ADDED TO THE MAP
const alignment = require("./geojson_data/alignment.js"),
	alignmentStyle = {
		"color": "#FF4000",
		"opacity": 1,
		"interactive": false
	},
	alignmentLayer = L.geoJson(alignment, {"style": alignmentStyle}),
	oneHundredFootGrid = require("./geojson_data/one_hundred_foot_grid.js"),
	oneHundredFootGridStyle = {
		"color": "#889494",
		"opacity": 0.4,
		"interactive": false
	},
	oneHundredFootGridLayer = L.geoJson(oneHundredFootGrid, {"style": oneHundredFootGridStyle}),
	roads = require("./geojson_data/roads.js"),
	roadsStyle = {
		"color": "#FFFFFF",
		"opacity": 0.5
	},
	roadsLayer = L.geoJson(roads, {
		"style": roadsStyle,
		"onEachFeature": onEachFeature
	}),
	mileMarkers = require("./geojson_data/mile_markers.js"),
	mileMarkersStyle = {
		"radius": 8,
		"fillColor": "#FF7800",
		"color": "#FFFFFF",
		"weight": 1,
		"opacity": 1,
		"fillOpacity": 1
	},
	mileMarkersLayer = L.geoJson(mileMarkers, {
		"pointToLayer": (feature, latlng) => {
			return L.circleMarker(latlng, mileMarkersStyle)
		},
		"onEachFeature": onEachFeature
	}),
	horizontalDrillingLocations = require("./geojson_data/horizontal_drilling_locations.js"),
	horizontalDrillingLocationsStyle = {
		"radius": 8,
		"fillColor": "#0092B2",
		"color": "#FFFFFF",
		"weight": 1,
		"opacity": 1,
		"fillOpacity": 1,
		"interactive": false
	},
	horizontalDrillingLocationsLayer = L.geoJson(horizontalDrillingLocations, {
		"pointToLayer": (feature, latlng) => {
			return L.circleMarker(latlng, horizontalDrillingLocationsStyle)
		}
	}),
	mapData = {
		"alignment": alignmentLayer,
		"oneHundredFootGrid": oneHundredFootGridLayer,
		"roads": roadsLayer,
		"mileMarkers": mileMarkersLayer,
		"horizontalDrillingLocations": horizontalDrillingLocationsLayer
	}

function whenClicked(e) {
	if (e.target.feature.properties.Text) {
		return this.bindPopup(`Milepost </br> ${e.target.feature.properties.Text}`).openPopup()
	}

	return this.bindPopup(`Street name: </br> ${e.target.feature.properties.StreetName}`).openPopup()
}

function onEachFeature(_feature, layer) {
    layer.on({
        "click": whenClicked
    })
}

module.exports = mapData