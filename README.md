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

This app is currently deployed to Heroku. To deploy, set up the Heroku remote and run

`$ git push heroku master`

################
# Node Scripts #
################

The package.json file contains a number of scripts intended to improve this app's performance. Here is a brief description of each script:

- "bundle" - this script calls 'browserify' and 'concat-css' scripts.
- "browserify" - this script consolidates all of the client-side js into one file, piping build/scripts/main.js into public/scripts/bundle.js.
- "concat-css" - similar to 'browserify', this script consolidates all of the css dependencies (which are manually listed in the script) into public/stylesheets/bundle.css.
- "uglify" - calls 'uglifyjs' and 'uglifycss', which minify public/scripts/bundle.js and public/scripts/bundle.css into .../bundle.min.js and .../bundle.min.css, respectively.
- "start" - the main app start script - calls 'npm start:dev' or 'npm start:prod', depending on the app's context.
- "start:dev" - starts the app in development mode, which runs 'lint', 'bundle', and 'uglify', followed by concurrent 'ssl-proxy' and 'nodemon' - 'nodemon' is a local development utility that allows for reloading after changes without restarting the server.
- "start:prod" - starts the app.
- "ssl-proxy" - used in local development mode, this will create an ssl proxy on port 3001, allowing a user to simulate https - https://localhost:3001
- "lint" - checks the specified javascript files for errors/problems.
- "postinstall" - run following Heroku deployment - it calls 'bundle' followed by 'uglify', which prepare the scripts and stylesheets for production mode.

#########
# Notes #
#########
- This app includes several features designed to improve performance, including:
	- compression - Middleware designed to compress response bodies.
	- browserify, concat, uglifyjs, and uglifycss, which concatenate and minify the client-side javascript and css files.