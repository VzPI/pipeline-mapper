# Pipeline Mapper

## Overview
The VLP Mapper is designed to aid field research volunteers by providing them with a simple, streamlined, custom navigation tool for a GPS-enabled mobile device. This app has been built in a NodeJS/ExpressJS framework.

The app, as presented here, is configured for use with a pipeline project in upstate New York, but will need to be configured to meet the needs of your field team, should you choose to clone and deploy this repo - see the 'Localization' section for more details on how to tailor this app to meet your needs.

The app's primary UI features are a map with relevant geometries and a button that allows a user to 'watch' their location on a Leaflet map (via the JavaScript geolocation API) to determine their proximity to those features.

Additionally, the app utilizes the HTML5 application cache feature to allow for offline-use (see the Offline Functionality section below).

This app's repository includes a 'Procfile', used for deployment to Heroku.

## Installation & Startup
To install dependencies, run 

    npm install

To start the app, run 

    npm start

in local development, the app will run on port 3000.

- in local development, this app has been set up to use Nodemon for to watch for file changes and ESLint for linting. Linting will run automatically on every server restart, and can be run independently with the command 

    npm run lint

- this app has been set up with an SSL proxy in development - it runs simultaneously with HTTP on port 3000 and HTTPS on port 3001.

## Testing
Location services require HTTPS. To test this app on mobile devices when running locally, this app includes the 'local-ssl-proxy' NOM module in its development dependencies - https://github.com/cameronhunter/local-ssl-proxy

In local development, the app will start the HTTP server on port 3000 and the HTTPS server on port 3001. When navigating to the HTTPS page, you may be prompted with a warning that the page may not be secure - click 'Advanced' and proceed.

When running on a local development machine on a wifi network, you can test this app on a mobile device (on the same network) by navigating to https://your.computer.ip.address:3001

## Localization
In its current state, the app is configured to be used in a small area in upstate New York - to make this app relevant to your project, you will need to make several changes and include your own localized data.

Code requiring localization attention has been commented with '// LOCALIZATION DEPENDENCY'. An overview of the code requiring localization attention is as follows:

### build/geojson_data/
- the files in this directory should be all of your relevant map geometries, formatted as GeoJSON data. These files will be imported and referenced in `build/main.js` and `build/map_data.js`.

### build/main.js
- set the latitude and longitude coordinates in the `tileBounds` variable so that the only maptiles that load are those that are relevant to your project's geographic scope.
- set the latitude and longitude coordinates and the zoom level in the `setView()` method of the `map` variable so that, when loading, the map centers on the project area and the zoom level provides a satisfactory perspective of the project area.
- the conditionals within the `map.on("zoomend", () => {})` block add and remove map geometries at different zoom levels. It is recommended that you comment this code out and tailor it to meed the needs of your project's geometries and zoom levels - hopefully, this is a helpful template.

### build/map_data.js
- the first block of constants in this file handle the styling and interactivity of the imported map geometries - customize this group of imports to match the GeoJSON data supplied for your project.
- the function `whenClicked()` should be tailored to meet the attributes and needs of the GeoJSON data that you provide.

## Deployment
Deploy this app as you see fit! However, note that it includes a `Procfile`, which is typical of a deployment to Heroku. Additionally, note that `package.json` includes an `engines` attribute, setting default Node and NPM versions - these are versions that were recommended by Heroku for their security and stability.

## Node Scripts
The package.json file contains a number of scripts -
- "bundle" - this script calls 'browserify' and 'concat-css' scripts.
- "browserify" - this script consolidates all of the client-side js into one file, piping build/scripts/main.js into public/scripts/bundle.js.
- "concat-css" - similar to 'browserify', this script consolidates all of the css dependencies (which are manually listed in the script) into public/stylesheets/bundle.css.
- "uglify" - calls 'uglifyjs' and 'uglifycss', which minify public/scripts/bundle.js and public/scripts/bundle.css into .../bundle.min.js and .../bundle.min.css, respectively.
- "start" - the main app start script - calls 'npm start:dev' or 'npm start:prod', depending on the app's context.
- "start:dev" - starts the app in development mode, which runs 'lint', followed by concurrent 'ssl-proxy' and 'nodemon' - 'nodemon' is a local development utility that allows for reloading after changes without restarting the server.
- "start:prod" - starts the app.
- "ssl-proxy" - used in local development mode, this will create an ssl proxy on port 3001, allowing a user to simulate https - https://localhost:3001
- "lint" - checks the specified javascript files for errors/problems.
- "postinstall" - run following Heroku deployment - it calls 'bundle', followed by 'uglify', then 'generate-cache:prod', which prepare the scripts, stylesheets, and cache manifest for production mode.
- "generate-cache:dev" - this produces the appcache.manifest for local use. This script is nearly identical to the production script, with the exception of the -w flag, which sets up watch mode - the appcache.manifest will refresh every time the cached files change. See the 'Offline Functionality' section for additional info about the app cache.
- "generate-cache:prod" - this produces the appcache.manifest for production use, called by the "postinstall" script. See the 'Offline Functionality' section for additional info about the app cache.

## Field Use
Before taking this app out in the field, users should first 'save' the app by navigating to it on their device when they have network service, and users should test the app at home or in a safe location before taking it into the field. Click the button labeled 'Watch' - after a few seconds, a yellow pulsing dot should appear on the screen - if the dot appears, the app is working as it should. (note - if the user is far away from the intended use area, the dot may simply appear on a black background - that is the expected behavior)

The pipeline-mapper is intended for use on iOS and Android mobile devices. In order to run, users must permit location services for the browser they intend to use in the field. If the user is ever prompted that the app is requesting their location, they must allow it.

The app interface is designed to be as simple as possible - clicking the blue 'Watch' button will begin the process of searching for a user's location and adding it to the map as a pulsing yellow dot (the user) surrounded by a transparent blue circle (accuracy);
the blue button will turn orange. To stop watching a user's location, click the button again.

As a user moves, the app will continuously update their location, so a user can observe their progress on the map.

## Offline Functionality
This app is intended to be used on mobile devices, and may be used in areas with inconsistent or non-existent network service - therefore, critical features of the application have been set up to use the application cache so that they may be stored on a user's device and used during times of limited/non-existent network coverage.

When a user first visits the app's URL, three critical resources are cached:
	- index.html
	- scripts/bundle.min.js
	- stylesheets/bundle.min.css

These are all of the assets that a user needs to run the application.
The only feature that is not cached is the set of map tiles which, while helping to provide context to the map area, are not a necessity.
When maptiles are not available, the map container will default to a black background, but the core map features - alignment, 100' grid, mile markers, roads, and drilling locations - will still be visible and the location functionality will still work.

After the user first visits the app's url, the app cache is set up and the targeted resources are added to it - a user can test that the assets have been added by switching their mobile device to 'airplane' mode and refreshing the page - the geometry should still load, but some or all map tiles will be missing.

A user can clear their application cache by clearing the browser history.

NOTE - the HTML application cache feature is deprecated and slated for eventual removal from browsers. However, it is still widely supported, and the replacement technology (JavaScript service workers) is still considered experimental and not supported on all browsers.

## Notes
This app includes several features designed to improve performance, including:
	- compression - Middleware designed to compress response bodies.
	- browserify, concat, uglifyjs, and uglifycss, which concatenate and minify the client-side javascript and css files.

This app depends on location services - users must have location services enabled for the browser they intend to use.
	- Additionally, location services require that assets requesting a user's location be served over HTTPS - the inclusion of the "heroku-ssl-redirect" NPM module guarantees that all users navigating to the app's URL will be directed to the HTTPS version.