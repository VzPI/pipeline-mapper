const express = require("express"),
	app = express(),
	port = process.env.PORT || 3000

app.set("view enginge", "ejs")

app.listen(port, () => {
	console.log(`ExpressJS started on port ${port}`)
})