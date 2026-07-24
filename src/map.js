const categoryStyles = {
  red: {
    label: "Best to avoid",
    className: "swatch--red"
  },
  green: {
    label: "Lovely picks",
    className: "swatch--green"
  },
  blue: {
    label: "Good compromise — check the street",
    className: "swatch--blue"
  }
};

const contourStyles = {
  15: {
    color: "#111827",
    dashArray: "1 0",
    weight: 6
  },
  20: {
    color: "#5f6975",
    dashArray: "10 9",
    weight: 5
  }
};

const visibleContourMinutes = new Set([15, 20]);

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

function latLng([lon, lat]) {
  return [lat, lon];
}

function renderRecommendationLegend() {
  const legend = document.querySelector("#recommendationLegend");
  legend.innerHTML = Object.entries(categoryStyles)
    .map(
      ([category, style]) => `
        <div class="legend-row">
          <span class="swatch ${style.className}" aria-hidden="true"></span>
          <span>${style.label}</span>
        </div>
      `
    )
    .join("");
}

function renderRouteTimes(routes) {
  const list = document.querySelector("#timeList");
  const featured = routes.zoneLabelRoutes.filter((route) =>
    [
      "Avenue Trudaine",
      "Lower rue des Martyrs",
      "Rue Cadet",
      "Saint-Georges / Lorette edge",
      "Chabrol / Hauteville edge",
      "Porte Saint-Martin",
      "Faubourg Poissonnière / Enghien",
      "Canal Saint-Martin central",
      "Northern Temple / Vertbois",
      "Jacques Bonsergent / République edge"
    ].includes(route.targetName)
  );
  list.innerHTML = featured
    .map(
      (route) => `
        <div class="time-row">
          <span>${route.targetName}</span>
          <span>${route.durationMinutes.toFixed(1)} min</span>
        </div>
      `
    )
    .join("");
}

function addRecommendationZones(map, geojson) {
  const layer = L.geoJSON(geojson, {
    style: (feature) => ({
      color: feature.properties.stroke,
      fillColor: feature.properties.fill,
      fillOpacity: 0.38,
      opacity: 0.96,
      weight: 5
    })
  }).addTo(map);

  geojson.features.forEach((feature) => {
    L.marker(latLng(feature.properties.labelPoint), {
      interactive: false,
      icon: L.divIcon({
        className: "zone-label-marker",
        html: `<div class="zone-label zone-label--${feature.properties.category}">${feature.properties.label}</div>`,
        iconSize: [1, 1],
        iconAnchor: [0, 0]
      })
    }).addTo(map);
  });

  return layer;
}

function addIsochrones(map, geojson) {
  const visibleGeojson = {
    ...geojson,
    features: geojson.features.filter((feature) =>
      visibleContourMinutes.has(feature.properties.minutes)
    )
  };

  return L.geoJSON(visibleGeojson, {
    pane: "overlayPane",
    style: (feature) => {
      const style = contourStyles[feature.properties.minutes] ?? contourStyles[20];
      return {
        color: style.color,
        dashArray: style.dashArray,
        fill: false,
        opacity: 0.95,
        weight: style.weight
      };
    }
  }).addTo(map);
}

function addPlaces(map, places) {
  const origin = places.origin;
  L.circleMarker(latLng(origin.coordinates), {
    radius: 10,
    color: "#111827",
    weight: 4,
    fillColor: "#ffffff",
    fillOpacity: 1
  }).addTo(map);

  L.marker(latLng(origin.coordinates), {
    interactive: false,
    icon: L.divIcon({
      className: "",
      html: `<div class="station-label">${origin.label}</div>`,
      iconSize: null,
      iconAnchor: [-8, 36]
    })
  }).addTo(map);

  const supportingMarkers = new Set(["gare_de_lest", "place_de_la_republique"]);
  places.namedPlaces
    .filter((place) => supportingMarkers.has(place.id))
    .forEach((place) => {
      L.circleMarker(latLng(place.coordinates), {
        radius: 5,
        color: "#334155",
        weight: 2,
        fillColor: "#ffffff",
        fillOpacity: 1
      }).addTo(map);

      L.marker(latLng(place.coordinates), {
        interactive: false,
        icon: L.divIcon({
          className: "",
          html: `<div class="place-label">${place.label}</div>`,
          iconSize: null,
          iconAnchor: [6, -8]
        })
      }).addTo(map);
    });
}

async function main() {
  renderRecommendationLegend();
  const isMobileLayout = window.matchMedia("(max-width: 960px)").matches;

  const [zones, places, routes, isochrones] = await Promise.all([
    loadJson("./data/recommendation-zones.geojson"),
    loadJson("./data/places.json"),
    loadJson("./data/routes.json"),
    loadJson("./data/walking-isochrones.geojson")
  ]);

  const map = L.map("map", {
    zoomControl: true,
    attributionControl: true,
    preferCanvas: true,
    dragging: !isMobileLayout
  });
  map.setView(places.mapView.center, places.mapView.zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.control.scale({ metric: true, imperial: false, position: "bottomleft" }).addTo(map);

  const zoneLayer = addRecommendationZones(map, zones);
  const contourLayer = addIsochrones(map, isochrones);
  addPlaces(map, places);
  renderRouteTimes(routes);

  const bounds = L.latLngBounds([]);
  contourLayer.eachLayer((layer) => bounds.extend(layer.getBounds()));
  zoneLayer.eachLayer((layer) => bounds.extend(layer.getBounds()));
  map.fitBounds(bounds.pad(0.06));
}

main().catch((error) => {
  const sidebar = document.querySelector(".sidebar");
  const errorNode = document.createElement("pre");
  errorNode.textContent = error.stack ?? error.message;
  sidebar.append(errorNode);
});
