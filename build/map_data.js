// COLLECT THE GEOJSONS FROM THE LIBRARY, STYLE THEM, AND PASS THEM TO main.js TO BE ADDED TO THE MAP
const alignment = require("./geojson_data/alignment.js"),
	alignmentStyle = {
		"color": "#FF4000",
		"opacity": "1.0"
	},
	alignmentLayer = L.geoJson(alignment, {"style": alignmentStyle})

module.exports = L.layerGroup([alignmentLayer])