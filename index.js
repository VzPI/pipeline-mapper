const express = require("express"),
	app = express(),
	sslRedirect = require("heroku-ssl-redirect"),
	compression = require("compression"),
	port = process.env.PORT || 3000,
	NODE_ENV = process.env.NODE_ENV || "development" // NODE_ENV WILL BE "production" FOR BOTH THE STAGING AND PRODUCTION VERSIONS

app.use(compression())
app.use(express.static("public"))

// IN BOTH STAGING AND PRODUCTION RELEASES, NODE_ENV WILL BE "production"
// USE THE SSL REDIRECT IN BOTH OF THOSE INSTANCES
if (NODE_ENV === "production") {
	app.use(sslRedirect())
}

app.listen(port, () => {
	console.log(`ExpressJS started on port ${port}`) // eslint-disable-line no-console
})