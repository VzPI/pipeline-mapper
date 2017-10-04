// COLLECT THE GEOJSONS FROM THE LIBRARY, STYLE THEM, AND PASS THEM TO main.js TO BE ADDED TO THE MAP
// THE MAIN PIPELINE ALIGNMENT
const alignment = require("./geojson_data/alignment.js"),
	alignmentStyle = {
		"color": "#FF4000",
		"opacity": 1,
		"interactive": false
	},
	alignmentLayer = L.geoJson(alignment, {"style": alignmentStyle}),
	// 100' x 100' GRID, 500' BUFFER AROUND THE ALIGNMENT
	oneHundredFootGrid = require("./geojson_data/one_hundred_foot_grid.js"),
	oneHundredFootGridStyle = {
		"color": "#889494",
		"opacity": 0.4,
		"interactive": false
	},
	oneHundredFootGridLayer = L.geoJson(oneHundredFootGrid, {"style": oneHundredFootGridStyle}),
	// ROADS, 500' BUFFER AROUND THE ALIGNMENT
	roads = require("./geojson_data/roads.js"),
	roadsStyle = {
		"color": "#FFFFFF",
		"opacity": 0.5
	},
	roadsLayer = L.geoJson(roads, {
		"style": roadsStyle,
		"onEachFeature": onEachFeature
	}),
	// MILE MARKERS
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
	// HORIZONTAL DRILLING LOCATIONS
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
	// THE EXPORTED DATA OBJECT
	mapData = {
		"alignment": alignmentLayer,
		"oneHundredFootGrid": oneHundredFootGridLayer,
		"roads": roadsLayer,
		"mileMarkers": mileMarkersLayer,
		"horizontalDrillingLocations": horizontalDrillingLocationsLayer
	}

// FUNCTION CALLED ON CLICK
function whenClicked(e) {
	// MILEPOST MARKERS HAVE A Text ATTRIBUTE
	if (e.target.feature.properties.Text) {
		return this.bindPopup(`Milepost </br> ${e.target.feature.properties.Text}`).openPopup()
	}

	// ROADS DON'T
	return this.bindPopup(`Street name: </br> ${e.target.feature.properties.StreetName}`).openPopup()
}

// CLICK HANDLER
// CURRENTLY APPLIED TO MILE MARKERS AND ROADS
function onEachFeature(_feature, layer) {
    layer.on({
        "click": whenClicked
    })
}

module.exports = mapData