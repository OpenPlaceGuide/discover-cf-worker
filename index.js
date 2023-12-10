import {Router} from 'itty-router'

import PolygonLookup from "polygon-lookup";

const Eritrea = require('./areas/eritrea');
const Ethiopia = require('./areas/ethiopia');
const SouthSudan = require('./areas/south-sudan');

// Create a new router
const router = Router()

/*
Our index route, a simple hello world.
*/
router.get("/", () => {
    return new Response('<h1>Welcome to the OpenPlaceGuide Discover V2 API Service</h1>' +
        '<p>Sample request: <a href="/v2/discover?lat=8.9776209&38&lon=38.7617240&osmId=way/162817836">/v2/discover?lat=8.9776209&38&lon=38.7617240&osmId=way/162817836</a></p>' +
        '<p><a href="https://github.com/openplaceguide/discover-cf-worker">GitHub</a></p>',
        {
            headers: {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*"
            }
        }
    )
})

/*
This route demonstrates path parameters, allowing you to extract fragments from the request
URL.

Try visit /example/hello and see the response.
*/
router.get("/v2/discover?", (req) => {
    const {params, query} = req

    const lon = query.lon ?? query.lng;
    const lat = query.lat;
    const osmId = query.osmId ?? '${type}/${id}';

    let areas = [];

    // Add new Areas / Countries here
    // areas.push(Eritrea);
    areas.push(Ethiopia);
    // areas.push(SouthSudan);

    var featureCollection = {
        type: 'FeatureCollection',
        features: areas
    };

    var lookup = new PolygonLookup(featureCollection);
    var poly = lookup.search(lon, lat);

    if (typeof poly === 'undefined') {
        return new Response(JSON.stringify([]), {
            headers: {
                "Content-Type": "text/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }

    const response = [{
        "url": poly.properties.url + osmId,
        "name": poly.properties.name
    }]

    // Return the HTML with the string to the client
    return new Response(JSON.stringify(response), {
        headers: {
            "Content-Type": "text/json",
            "Access-Control-Allow-Origin": "*"
        }
    })
})


/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).

Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all("*", () => new Response("404, not found!", {status: 404}))

/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener('fetch', (e) => {
    e.respondWith(router.handle(e.request))
})
