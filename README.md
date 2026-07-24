# Paris Stay Map

A small personal map for comparing places to stay near Gare du Nord.

[Open the interactive map](https://genesistrading.github.io/martina-paris-map/)

The coloured areas reflect personal accommodation preferences. Walking contours and travel
times are generated from pedestrian routing data.

## Contents

- `index.html` — interactive Leaflet and OpenStreetMap map
- `data/` — recommendation zones, walking contours, places and route times
- `src/geography.mjs` — editable geographic definitions
- `validation-report.md` — coordinates, sources and generated walking-time checks
- `exports/paris-accommodation-map.png` — static high-resolution export

## Run Locally

```powershell
npm install
npm run serve
```

Then open `http://127.0.0.1:4173/`.

## Rebuild The Data

```powershell
npm run build:data
```

The default generator uses the public OSRM-compatible pedestrian routing service at
`routing.openstreetmap.de` and spaces requests by at least one second.

If `ORS_API_KEY` is set, the generator uses OpenRouteService for walking isochrones:

```powershell
$env:ORS_API_KEY="your-api-key"
npm run build:data
```

To regenerate the static PNG:

```powershell
npm run export:png
```

## Notes

The walking contours and route times are generated data. The green and blue recommendation
areas—and the accommodation judgments attached to every colour—are subjective. They should
not be read as general travel or safety advice, and the exact street still matters.

## License And Attribution

Original source code is licensed under the [MIT License](./LICENSE). Geographic datasets,
recommendation data and exported images have additional terms described in
[DATA_LICENSE.md](./DATA_LICENSE.md).

Map data and basemap © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).
