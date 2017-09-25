const express = require("express"),
	app = express(),
	compression = require("compression"),
	port = process.env.PORT || 3000

app.use(compression())
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use("/stylesheets", express.static(__dirname + "/node_modules/bootstrap/dist/css")) // eslint-disable-line prefer-template
app.use("/stylesheets", express.static(__dirname + "/node_modules/leaflet/dist/")) // eslint-disable-line prefer-template

app.get("/", (req, res) => {
	res.render("index", {})
})

app.listen(port, () => {
	console.log(`ExpressJS started on port ${port}`) // eslint-disable-line no-console
})