const express = require("express"),
	app = express(),
	sslRedirect = require("heroku-ssl-redirect"),
	compression = require("compression"),
	port = process.env.PORT || 3000,
	NODE_ENV = process.env.NODE_ENV || "development"

app.use(compression())
app.use(express.static("public"))

if (NODE_ENV === "production") {
	app.use(sslRedirect())
}

app.listen(port, () => {
	console.log(`ExpressJS started on port ${port}`) // eslint-disable-line no-console
})