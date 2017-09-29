// COLLECT THE GEOJSONS FROM THE LIBRARY, STYLE THEM, AND PASS THEM TO main.js TO BE ADDED TO THE MAP
const alignment = require("./geojson_data/alignment.js"),
	alignmentStyle = {
		"color": "#FF4000",
		"opacity": "1.0"
	},
	alignmentLayer = L.geoJson(alignment, {"style": alignmentStyle}),
	oneHundredFootGrid = require("./geojson_data/one_hundred_foot_grid.js"),
	oneHundredFootGridStyle = {"color": "#889494"},
	oneHundredFootGridLayer = L.geoJson(oneHundredFootGrid, {"style": oneHundredFootGridStyle}),
	roads = require("./geojson_data/roads.js"),
	roadsStyle = {
		"color": "#CCD0FF",
		"opacity": "0.9"
	},
	roadsLayer = L.geoJson(roads, {"style": roadsStyle}),
	mileMarkers = require("./geojson_data/mile_markers.js"),
	mileMarkersStyle = {
		"radius": 8,
		"fillColor": "#FF7800",
		"color": "#FFFFFF",
		"weight": 1,
		"opacity": 1,
		"fillOpacity": 0.8
	},
	mileMarkersLayer = L.geoJson(mileMarkers, {
		"pointToLayer": function (feature, latlng) {
			return L.circleMarker(latlng, mileMarkersStyle)
		},
		"onEachFeature": onEachFeature
	}),
	horizontalDrillingLocations = require("./geojson_data/horizontal_drilling_locations.js"),
	horizontalDrillingLocationsStyle = {
		"radius": 8,
		"fillColor": "#FF7800",
		"color": "#FFFFFF",
		"weight": 1,
		"opacity": 1,
		"fillOpacity": 0.8
	},
	horizontalDrillingLocationsLayer = L.geoJson(horizontalDrillingLocations, {"style": horizontalDrillingLocationsStyle})

function whenClicked(e) {
	this.bindPopup(`Milepost </br> ${e.target.feature.properties.Text}`).openPopup()
}

function onEachFeature(feature, layer) {
    layer.on({
        "click": whenClicked
    })
}

module.exports = L.layerGroup([alignmentLayer, oneHundredFootGridLayer, roadsLayer, mileMarkersLayer, horizontalDrillingLocationsLayer])