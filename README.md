This app has been built in a NodeJS/ExpressJS framework. It utilizes the JavaScript geolocation API to access a user's current location and display it in a Leaflet map container.

##########################
# Installation & Startup #
##########################

- To install dependencies, run `$ npm install`

- To start the app, run `$ npm start` - in local development, the app will run on port 3000.
	- in local development, this app has been set up to use Nodemon for 'hot' reloading and ESLint for linting. Linting will run automatically on every server restart, and can be run independently with the command `$ npm run lint`.

###########
# Testing #
###########

- Location services require https. To test this app on mobile devices when running locally, this app includes the local-ssl-proxy npm module in its development dependencies - https://github.com/cameronhunter/local-ssl-proxy

	`$ npm install -g local-ssl-proxy`

When running `$ npm start` in development mode, this will actually start the http server on port 3000 and the https server on port 3001. When navigating to the https page, you may be prompted with a warning that the page may not be secure - click 'Advanced' and proceed.

When running on a local development machine, you can test this app on a mobile device by navigating to https://your.computer.ip.address:3001

##############
# Deployment #
##############

#########
# Notes #
#########
- This app includes several features designed to improve performance, including:
	- compression - Middleware designed to compress response bodies.
	- uglify-js - A tool used to minify bundle.js, the main javascript file.