# OpenPlaceGuide - Discover API

OpenPlaceGuide is a federated business directory.

The discover component is a Cloudflare Worker which provides an API to
match given coordinates to the OpenPlaceGuide instance.

## How it works

Discovery is a two step process.

You need the location (latitude, longitude) and optional the osmType (point, way, relation) and osmId (positive integer).

Example:

`GET https://discover.openplaceguide.org/v2/discover?lat=8.9776209&38&lon=38.7617240&osmId=way/162817836`

returns:

```json
[{"url":"https://opg.addismap.com/way/162817836","name":"AddisMap"}]
```

The returned url will redirect to the micro page for the OSM object.

## Add your country / thematic website

Active contributors / teams of the OpenStreetMap are invited to set up a data repository for their country and register
the country in here.

1. Supply your `.poly` file, for example from download.openstreetmap.fr or GeoFabrik

2. Convert the `.poly` file to a geojson file
   ```bash
   git clone https://github.com/spatialoperator/osmosis2geojson.git
   cd osmosis2geojson
   yarn
   ./osmosis2geojson.js your-country.poly > ../discover/storage/app/areas/your-country.geojson
   ```

3. Format the file

4. Add the end of the file, add additional properties

## Development

`npm run dev`
