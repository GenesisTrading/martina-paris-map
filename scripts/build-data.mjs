import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contours } from "d3-contour";
import {
  point,
  booleanPointInPolygon,
  bbox as turfBbox
} from "@turf/turf";
import {
  categoryStyles,
  checkedDate,
  mapView,
  namedPlaces,
  origin,
  recommendationZones,
  serviceSources
} from "../src/geography.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const dataDir = path.join(projectRoot, "data");
const reportPath = path.join(projectRoot, "validation-report.md");

const osrmBaseUrl = "https://routing.openstreetmap.de/routed-foot";
const userAgent = "CodexParisAccommodationMap/1.0";
const routingRequestDelayMs = 1100;
const redRecommendationMinutes = 10;
const contourMinutes = [redRecommendationMinutes, 15, 20];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const formatCoordinate = ([lon, lat]) => `${lon.toFixed(7)}, ${lat.toFixed(7)}`;
const routeCoordinate = ([lon, lat]) => `${lon},${lat}`;
const closeRing = (coords) => {
  const first = coords[0];
  const last = coords[coords.length - 1];
  if (first[0] === last[0] && first[1] === last[1]) return coords;
  return [...coords, first];
};

function zoneToFeature(zone) {
  const style = categoryStyles[zone.category];
  return {
    type: "Feature",
    properties: {
      id: zone.id,
      name: zone.name,
      category: zone.category,
      categoryLabel: style.label,
      stroke: style.color,
      fill: style.fillColor,
      boundaryDescription: zone.boundaryDescription,
      boundaryStreets: zone.boundaryStreets,
      label: zone.label,
      labelPoint: zone.labelPoint,
      vertices: zone.vertices
    },
    geometry: {
      type: "Polygon",
      coordinates: [closeRing(zone.vertices.map((vertex) => vertex.coordinates))]
    }
  };
}

function cloneGeometry(geometry) {
  return JSON.parse(JSON.stringify(geometry));
}

function countCoordinates(coordinates) {
  if (typeof coordinates?.[0] === "number") return 1;
  return coordinates.reduce((total, child) => total + countCoordinates(child), 0);
}

function buildRedIsochroneZoneFeature(isochrones) {
  const sourceFeature = isochrones.features.find(
    (feature) => feature.properties?.minutes === redRecommendationMinutes
  );
  if (!sourceFeature) {
    throw new Error(
      `Unable to build red recommendation zone: missing ${redRecommendationMinutes}-minute isochrone.`
    );
  }

  const style = categoryStyles.red;
  return {
    type: "Feature",
    properties: {
      id: `red_${redRecommendationMinutes}_min_walking_contour`,
      name: `${redRecommendationMinutes}-minute walking red zone`,
      category: "red",
      categoryLabel: style.label,
      stroke: style.color,
      fill: style.fillColor,
      boundaryDescription:
        `Objective ${redRecommendationMinutes}-minute pedestrian isochrone from Gare du Nord, intentionally used as the full red recommendation fill.`,
      boundaryStreets: [
        `Routing-derived ${redRecommendationMinutes}-minute pedestrian isochrone from Gare du Nord`
      ],
      label: `${redRecommendationMinutes}-min red`,
      labelPoint: [2.3563, 48.8799],
      vertices: [],
      derivedFrom: {
        file: "data/walking-isochrones.geojson",
        featureId: sourceFeature.properties.id,
        method: isochrones.method,
        coordinateCount: countCoordinates(sourceFeature.geometry.coordinates)
      }
    },
    geometry: cloneGeometry(sourceFeature.geometry)
  };
}

function buildRecommendationGeojson(isochrones) {
  const redIsochroneZone = buildRedIsochroneZoneFeature(isochrones);
  const manualGreenBlueZones = recommendationZones
    .filter((zone) => zone.category !== "red")
    .map(zoneToFeature);

  return {
    type: "FeatureCollection",
    name: "Paris accommodation recommendation polygons",
    checkedDate,
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
    },
    features: [redIsochroneZone, ...manualGreenBlueZones]
  };
}

function buildPlacesJson(recommendationGeojson) {
  return {
    checkedDate,
    coordinateOrder: "longitude, latitude",
    origin,
    namedPlaces,
    zoneLabels: recommendationGeojson.features.map((feature) => ({
      id: `${feature.properties.id}_label`,
      zoneId: feature.properties.id,
      name: feature.properties.name,
      label: feature.properties.label,
      category: feature.properties.category,
      coordinates: feature.properties.labelPoint,
      source: "Manual label point placed inside the explicit recommendation polygon"
    })),
    mapView,
    sources: serviceSources
  };
}

async function fetchJson(url, options = {}, label = url, retries = 2) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "User-Agent": userAgent,
          ...(options.headers ?? {})
        }
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 240)}`);
      }
      return JSON.parse(text);
    } catch (error) {
      lastError = error;
      if (attempt < retries) await sleep(500 * (attempt + 1));
    }
  }
  throw new Error(`Failed to fetch ${label}: ${lastError.message}`);
}

async function routeFromOrigin(target, targetName) {
  if (target[0] === origin.coordinates[0] && target[1] === origin.coordinates[1]) {
    return {
      targetName,
      target,
      durationSeconds: 0,
      durationMinutes: 0,
      distanceMeters: 0,
      snappedOrigin: origin.coordinates,
      snappedTarget: target,
      originSnapDistanceMeters: 0,
      targetSnapDistanceMeters: 0,
      source: "No route needed; target is the origin"
    };
  }

  const url =
    `${osrmBaseUrl}/route/v1/foot/${routeCoordinate(origin.coordinates)};${routeCoordinate(target)}` +
    "?overview=false&alternatives=false&steps=false";
  const data = await fetchJson(url, {}, `OSRM route to ${targetName}`);
  if (data.code !== "Ok" || !data.routes?.[0]) {
    throw new Error(`OSRM route failed for ${targetName}: ${JSON.stringify(data)}`);
  }
  const route = data.routes[0];
  const waypoints = data.waypoints ?? [];
  return {
    targetName,
    target,
    durationSeconds: route.duration,
    durationMinutes: route.duration / 60,
    distanceMeters: route.distance,
    snappedOrigin: waypoints[0]?.location ?? null,
    snappedTarget: waypoints[1]?.location ?? null,
    originSnapDistanceMeters: waypoints[0]?.distance ?? null,
    targetSnapDistanceMeters: waypoints[1]?.distance ?? null,
    source: `${osrmBaseUrl}/route/v1/foot`
  };
}

async function buildRoutes(recommendationGeojson) {
  const namedPlaceRoutes = [];
  for (const place of namedPlaces) {
    namedPlaceRoutes.push(await routeFromOrigin(place.coordinates, place.name));
    await sleep(routingRequestDelayMs);
  }

  const zoneLabelRoutes = [];
  for (const feature of recommendationGeojson.features) {
    zoneLabelRoutes.push(
      await routeFromOrigin(feature.properties.labelPoint, feature.properties.name)
    );
    await sleep(routingRequestDelayMs);
  }

  return {
    generatedAt: new Date().toISOString(),
    provider: "routing.openstreetmap.de routed-foot server, OSRM-compatible foot profile",
    providerUrl: `${osrmBaseUrl}/route/v1/foot`,
    origin,
    namedPlaceRoutes,
    zoneLabelRoutes
  };
}

function transformContourGeometry(geometry, grid) {
  const { minLon, maxLon, minLat, maxLat, width, height } = grid;
  const lonSpan = maxLon - minLon;
  const latSpan = maxLat - minLat;

  const transformPoint = ([x, y]) => {
    const lon = minLon + (x / (width - 1)) * lonSpan;
    const lat = maxLat - (y / (height - 1)) * latSpan;
    return [
      Number(lon.toFixed(7)),
      Number(lat.toFixed(7))
    ];
  };

  return {
    type: geometry.type,
    coordinates: geometry.coordinates.map((polygonCoordinates) =>
      polygonCoordinates.map((ring) => ring.map(transformPoint))
    )
  };
}

async function osrmTableDurations(originCoordinate, destinations) {
  const coords = [originCoordinate, ...destinations].map(routeCoordinate).join(";");
  const url = `${osrmBaseUrl}/table/v1/foot/${coords}?sources=0&annotations=duration`;
  const data = await fetchJson(url, {}, "OSRM table sample");
  if (data.code !== "Ok" || !data.durations?.[0]) {
    throw new Error(`OSRM table failed: ${JSON.stringify(data)}`);
  }
  return data.durations[0].slice(1);
}

async function generateOsrmSampledIsochrones() {
  const grid = {
    minLon: 2.329,
    maxLon: 2.382,
    minLat: 48.862,
    maxLat: 48.895,
    width: 41,
    height: 41
  };

  const destinations = [];
  for (let y = 0; y < grid.height; y += 1) {
    const lat = grid.maxLat - (y / (grid.height - 1)) * (grid.maxLat - grid.minLat);
    for (let x = 0; x < grid.width; x += 1) {
      const lon = grid.minLon + (x / (grid.width - 1)) * (grid.maxLon - grid.minLon);
      destinations.push([Number(lon.toFixed(7)), Number(lat.toFixed(7))]);
    }
  }

  const durations = [];
  const chunkSize = 85;
  for (let start = 0; start < destinations.length; start += chunkSize) {
    const chunk = destinations.slice(start, start + chunkSize);
    durations.push(...(await osrmTableDurations(origin.coordinates, chunk)));
    await sleep(routingRequestDelayMs);
  }

  const values = durations.map((duration) =>
    Number.isFinite(duration) ? -duration : -999999
  );
  const contourGenerator = contours()
    .size([grid.width, grid.height])
    .smooth(true)
    .thresholds(contourMinutes.map((minutes) => -minutes * 60).sort((a, b) => a - b));

  const features = contourGenerator(values)
    .sort((a, b) => a.value - b.value)
    .map((contour) => {
      const minutes = Math.round(Math.abs(contour.value) / 60);
      return {
        type: "Feature",
        properties: {
          id: `walk_${minutes}_min`,
          type: "walking_isochrone",
          minutes,
          label: `${minutes}-minute walking contour`,
          source:
            "OSRM table service sampled on a regular grid, contoured with d3-contour",
          providerUrl: `${osrmBaseUrl}/table/v1/foot`,
          grid
        },
        geometry: transformContourGeometry(contour, grid)
      };
    });

  return {
    type: "FeatureCollection",
    name: "Gare du Nord pedestrian isochrones",
    generatedAt: new Date().toISOString(),
    method: "osrm-route-sampled-contours",
    assumptions: [
      "The routing.openstreetmap.de routed-foot endpoint does not provide a native isochrone endpoint.",
      "Contours are interpolated between sampled pedestrian route durations.",
      "The resulting contours are objective routing-derived estimates, not subjective accommodation zones."
    ],
    features
  };
}

async function generateOrsIsochrones() {
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) return null;

  const body = {
    locations: [origin.coordinates],
    range: contourMinutes.map((minutes) => minutes * 60).sort((a, b) => a - b),
    range_type: "time",
    attributes: ["area"],
    smoothing: 0.25
  };
  const data = await fetchJson(
    serviceSources.openRouteService,
    {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    },
    "OpenRouteService isochrones"
  );

  return {
    type: "FeatureCollection",
    name: "Gare du Nord pedestrian isochrones",
    generatedAt: new Date().toISOString(),
    method: "openrouteservice-foot-walking",
    assumptions: [
      "OpenRouteService generated native foot-walking isochrones from the single Gare du Nord origin.",
      "Contours are objective routing-derived estimates, not subjective accommodation zones."
    ],
    features: data.features.map((feature) => {
      const seconds = feature.properties.value;
      const minutes = Math.round(seconds / 60);
      return {
        ...feature,
        properties: {
          ...feature.properties,
          id: `walk_${minutes}_min`,
          type: "walking_isochrone",
          minutes,
          label: `${minutes}-minute walking contour`,
          source: "OpenRouteService isochrones foot-walking",
          providerUrl: serviceSources.openRouteService
        }
      };
    })
  };
}

function validateLabels(recommendationGeojson) {
  return recommendationGeojson.features.map((feature) => {
    const labelPoint = feature.properties.labelPoint;
    const inside = booleanPointInPolygon(
      point(labelPoint),
      feature
    );
    return {
      zoneId: feature.properties.id,
      label: feature.properties.label,
      labelPoint,
      inside
    };
  });
}

function minutes(value) {
  return `${value.toFixed(1)} min`;
}

function meters(value) {
  return `${Math.round(value).toLocaleString("en-US")} m`;
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`)
  ].join("\n");
}

function buildValidationReport({
  recommendationGeojson,
  places,
  routes,
  isochrones,
  labelChecks
}) {
  const namedRoutesByName = new Map(routes.namedPlaceRoutes.map((route) => [route.targetName, route]));
  const zoneRoutesByName = new Map(routes.zoneLabelRoutes.map((route) => [route.targetName, route]));

  const placeRows = places.namedPlaces.map((place) => {
    const route = namedRoutesByName.get(place.name);
    return [
      place.name,
      formatCoordinate(place.coordinates),
      `${place.source.provider}; ${place.source.osmType}/${place.source.osmId}`,
      route ? minutes(route.durationMinutes) : "n/a",
      route ? meters(route.distanceMeters) : "n/a",
      route?.originSnapDistanceMeters != null
        ? `${Math.round(route.originSnapDistanceMeters)} m`
        : "n/a"
    ];
  });

  const zoneTimeRows = routes.zoneLabelRoutes.map((route) => [
    route.targetName,
    formatCoordinate(route.target),
    minutes(route.durationMinutes),
    meters(route.distanceMeters),
    route.snappedTarget ? formatCoordinate(route.snappedTarget) : "n/a"
  ]);

  const labelRows = labelChecks.map((check) => [
    check.zoneId,
    check.label,
    formatCoordinate(check.labelPoint),
    check.inside ? "yes" : "NO"
  ]);

  const zoneSections = recommendationGeojson.features
    .map((feature) => {
      if (!feature.properties.vertices?.length) {
        const featureBbox = turfBbox(feature);
        return [
          `### ${feature.properties.name}`,
          "",
          `Category: ${feature.properties.categoryLabel}`,
          "",
          `Boundary: ${feature.properties.boundaryDescription}`,
          "",
          markdownTable(
            ["Geometry item", "Value"],
            [
              ["Geometry type", feature.geometry.type],
              [
                "Exact coordinate source",
                `${feature.properties.derivedFrom.file} feature ${feature.properties.derivedFrom.featureId}`
              ],
              ["Source method", feature.properties.derivedFrom.method],
              [
                "Coordinate count",
                `${feature.properties.derivedFrom.coordinateCount} coordinate positions`
              ],
              [
                "Bounding box lon, lat",
                featureBbox.map((value) => value.toFixed(7)).join(", ")
              ],
              [
                "GeoJSON feature",
                `data/recommendation-zones.geojson feature ${feature.properties.id}`
              ]
            ]
          )
        ].join("\n");
      }

      const rows = feature.properties.vertices.map((vertex, index) => [
        `${index + 1}`,
        formatCoordinate(vertex.coordinates),
        vertex.osmNode ? `OSM node ${vertex.osmNode}` : "manual vertex",
        vertex.note
      ]);
      return [
        `### ${feature.properties.name}`,
        "",
        `Category: ${feature.properties.categoryLabel}`,
        "",
        `Boundary: ${feature.properties.boundaryDescription}`,
        "",
        markdownTable(["#", "Coordinate lon, lat", "Source", "Street / note"], rows)
      ].join("\n");
    })
    .join("\n\n");

  const failedLabels = labelChecks.filter((check) => !check.inside);
  const bbox = turfBbox(recommendationGeojson);

  return `# Paris accommodation map validation report

Checked date: ${checkedDate}
Generated: ${new Date().toISOString()}

## Conclusion

The deliverable distinguishes objective walking-time contours from subjective accommodation recommendation zones. Per the latest map-owner decision, the red recommendation fill deliberately reuses the objective ${redRecommendationMinutes}-minute pedestrian isochrone from Gare du Nord. Green and blue recommendation polygons remain separate manually selected accommodation zones. Recommendation polygons are explicit editable GeoJSON geometries and are not inferred from neighbourhood names.

## Sources

- Named locations: Nominatim / OpenStreetMap geocoding (${serviceSources.nominatim}).
- Street-intersection vertices: OpenStreetMap geometry queried with Overpass (${serviceSources.overpass}); manual vertices are explicitly marked where the boundary is a selected station frontage or side-street edge rather than a clean shared OSM node.
- Walking routes: routing.openstreetmap.de routed-foot server, OSRM-compatible foot profile (${serviceSources.osrm}).
- Walking contours: ${isochrones.method === "openrouteservice-foot-walking" ? "OpenRouteService foot-walking native isochrones." : "OSRM table service sampled on a regular grid, then contoured programmatically."}
- Basemap: OpenStreetMap tiles with attribution preserved in the Leaflet map (${serviceSources.osmCopyright}).

## Named Locations And Walking Times

Single origin: ${origin.name}, ${formatCoordinate(origin.coordinates)}.

${markdownTable(
  [
    "Location",
    "Coordinate lon, lat",
    "Geocoding source",
    "Walking time",
    "Route distance",
    "Origin snap"
  ],
  placeRows
)}

## Recommendation Zone Label Walking Times

These are pedestrian routes to the label point of each recommendation polygon. For green and blue, they are not claims that every point inside the polygon has that same walking time. For red, the polygon itself is the generated ${redRecommendationMinutes}-minute walking contour.

${markdownTable(
  ["Zone", "Label coordinate lon, lat", "Walking time", "Route distance", "Snapped target"],
  zoneTimeRows
)}

## Label-In-Polygon Validation

${markdownTable(["Zone ID", "Label", "Label coordinate lon, lat", "Inside polygon"], labelRows)}

Result: ${failedLabels.length === 0 ? "all labels lie inside their assigned polygons." : `${failedLabels.length} labels failed validation.`}

## Recommendation Polygons

Recommendation polygon bbox: ${bbox.map((value) => value.toFixed(7)).join(", ")}.

${zoneSections}

## Walking-Time Contours

- ${redRecommendationMinutes}-minute pedestrian contour: objective routing-derived contour from the single Gare du Nord origin; also used as the red recommendation fill.
- 15-minute pedestrian contour: objective routing-derived contour from the single Gare du Nord origin.
- 20-minute pedestrian contour: objective routing-derived contour from the single Gare du Nord origin.
- Contours file: data/walking-isochrones.geojson.
- Source method: ${isochrones.method}.

## Assumptions And Uncertainties

- Gare du Nord is represented by the Nominatim coordinate for OSM way/736530618. OSRM snaps route starts to the nearest routable pedestrian graph point; the snap distance is reported above.
- Long street geocodes, especially Rue des Martyrs and Canal Saint-Martin, represent full linear features. The approved green and blue accommodation polygons use manually selected subsections and separate label points inside those polygons.
- Manual vertices were selected for green and blue to follow approved boundary streets and to avoid oversized generic neighbourhood polygons.
- The active red recommendation geometry is not the earlier compact station-frontage selection. It is the full ${redRecommendationMinutes}-minute walking contour by explicit map-owner instruction.
- OSRM / ORS walking times are modelled routing-service times based on available OSM pedestrian data, not observed travel times.
- If ORS_API_KEY is not provided, contours are generated from OSRM route-duration samples and interpolation between sampled points. That is routing-derived but approximate between grid points.
- The ${redRecommendationMinutes}-minute red contour may include any street segment the routing service considers reachable from Gare du Nord within ${redRecommendationMinutes} minutes, including parts north or east of the station. That reachability result is now intentional for red only.
`;
}

async function main() {
  await fs.mkdir(dataDir, { recursive: true });

  const isochrones = (await generateOrsIsochrones()) ?? (await generateOsrmSampledIsochrones());
  const recommendationGeojson = buildRecommendationGeojson(isochrones);
  const places = buildPlacesJson(recommendationGeojson);
  const labelChecks = validateLabels(recommendationGeojson);
  const failedLabels = labelChecks.filter((check) => !check.inside);
  if (failedLabels.length > 0) {
    throw new Error(`Label validation failed: ${JSON.stringify(failedLabels, null, 2)}`);
  }

  const routes = await buildRoutes(recommendationGeojson);
  const validationReport = buildValidationReport({
    recommendationGeojson,
    places,
    routes,
    isochrones,
    labelChecks
  });

  await fs.writeFile(
    path.join(dataDir, "recommendation-zones.geojson"),
    `${JSON.stringify(recommendationGeojson, null, 2)}\n`
  );
  await fs.writeFile(path.join(dataDir, "places.json"), `${JSON.stringify(places, null, 2)}\n`);
  await fs.writeFile(path.join(dataDir, "routes.json"), `${JSON.stringify(routes, null, 2)}\n`);
  await fs.writeFile(
    path.join(dataDir, "walking-isochrones.geojson"),
    `${JSON.stringify(isochrones, null, 2)}\n`
  );
  await fs.writeFile(reportPath, validationReport);

  console.log("Generated data/recommendation-zones.geojson");
  console.log("Generated data/places.json");
  console.log("Generated data/routes.json");
  console.log("Generated data/walking-isochrones.geojson");
  console.log("Generated validation-report.md");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
