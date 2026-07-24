# Paris accommodation recommendation map

Production map centred on Gare du Nord for accommodation screening. The map is generated from explicit geographic data and routing-service outputs; it is not an illustration.

## Outputs

- `index.html` - interactive Leaflet + OpenStreetMap map.
- `data/recommendation-zones.geojson` - editable subjective recommendation polygons.
- `data/places.json` - named places, coordinates, labels and sources.
- `data/walking-isochrones.geojson` - objective 15-minute and 20-minute walking contours.
- `data/routes.json` - pedestrian route times and distances from Gare du Nord.
- `exports/paris-accommodation-map.png` - 2400 x 1600 PNG export generated with Playwright.
- `validation-report.md` - source, coordinate, polygon and walking-time validation.

## Regenerate

Install dependencies once:

```powershell
npm install
```

Regenerate the data and validation report:

```powershell
npm run build:data
```

Export the high-resolution PNG:

```powershell
npm run export:png
```

Run everything:

```powershell
npm run build
```

Serve the interactive map locally:

```powershell
npm run serve
```

Then open `http://127.0.0.1:4173/`.

## Routing And Isochrones

The default generator uses `https://routing.openstreetmap.de/routed-foot`, an OSRM-compatible OSM pedestrian routing service. Requests are paced at one request per second.

If `ORS_API_KEY` is set, `npm run build:data` uses OpenRouteService native `foot-walking` isochrones instead of sampled OSRM-compatible contours:

```powershell
$env:ORS_API_KEY="your-api-key"
npm run build:data
```

Route times in `validation-report.md` are always generated from the single Gare du Nord origin in `src/geography.mjs`.

## Edit The Map

Edit subjective areas in `src/geography.mjs`:

- Red is generated from the 15-minute pedestrian contour and is not edited as manual street vertices.
- Green and blue `recommendationZones[].vertices` define polygon vertices in GeoJSON order: longitude, latitude.
- `recommendationZones[].labelPoint` controls the map label location.
- `namedPlaces` stores geocoded place coordinates and source metadata.

After editing, run:

```powershell
npm run build:data
```

The build validates that every zone label lies inside its polygon. If a label is outside, the build fails with the offending zone ID.

## Method Boundaries

The red recommendation zone deliberately uses the objective 15-minute walking contour from Gare du Nord. Green and blue recommendation zones are subjective accommodation judgements. Do not read a green or blue polygon as a claim that every address inside it has the same walking time.

OpenStreetMap attribution is preserved in the Leaflet tile layer and should not be removed.
