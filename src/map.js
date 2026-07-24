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

const parisBoundsCoordinates = [
  [48.8156, 2.2241],
  [48.9022, 2.4699]
];

function recommendationZoneStyle(feature, isMobileLayout) {
  return {
    color: feature.properties.stroke,
    fillColor: feature.properties.fill,
    fillOpacity: 0.38,
    opacity: 0.96,
    weight: isMobileLayout ? 3 : 5
  };
}

function walkingContourStyle(feature, isMobileLayout) {
  const style = contourStyles[feature.properties.minutes] ?? contourStyles[20];
  const mobileWeight = feature.properties.minutes === 15 ? 4 : 3;
  return {
    color: style.color,
    dashArray: style.dashArray,
    fill: false,
    opacity: isMobileLayout ? 0.82 : 0.95,
    weight: isMobileLayout ? mobileWeight : style.weight
  };
}

function syncParisViewLimits(map, parisBounds) {
  const minZoom = map.getBoundsZoom(parisBounds, true);
  map.setMinZoom(minZoom);
  if (map.getZoom() < minZoom) map.setZoom(minZoom);
}

const leafletScriptUrls = [
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"
];

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.crossOrigin = "anonymous";
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", () => reject(new Error(`Failed to load ${url}`)), {
      once: true
    });
    document.head.append(script);
  });
}

async function loadLeaflet() {
  if (window.L) return;

  for (const url of leafletScriptUrls) {
    try {
      await loadScript(url);
      if (window.L) return;
    } catch {
      // Try the next pinned CDN source.
    }
  }

  throw new Error("Leaflet could not be loaded");
}

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

function renderMapDescription(geojson) {
  const description = document.querySelector("#mapDescription");
  const areas = geojson.features.map((feature) => {
    const category = categoryStyles[feature.properties.category]?.label ?? "Mapped area";
    return `${feature.properties.label}: ${category}`;
  });
  description.textContent = `Accommodation areas shown on the map. ${areas.join(". ")}.`;
}

function addRecommendationZones(map, geojson, isMobileLayout) {
  const layer = L.geoJSON(geojson, {
    style: (feature) => recommendationZoneStyle(feature, isMobileLayout),
    onEachFeature: (feature, zoneLayer) => {
      const category = categoryStyles[feature.properties.category]?.label ?? "Mapped area";
      const popupContent = document.createElement("span");
      const label = document.createElement("strong");
      label.textContent = feature.properties.label;
      popupContent.append(label, document.createTextNode(` — ${category}`));
      zoneLayer.bindPopup(popupContent, { closeButton: false });
      zoneLayer.on("add", () => {
        const element = zoneLayer.getElement();
        if (!element) return;
        element.setAttribute("role", "button");
        element.setAttribute("tabindex", "0");
        element.setAttribute("aria-label", `${feature.properties.label}: ${category}`);
        element.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          zoneLayer.openPopup();
        });
      });
    }
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

function addIsochrones(map, geojson, isMobileLayout) {
  const visibleGeojson = {
    ...geojson,
    features: geojson.features.filter((feature) =>
      visibleContourMinutes.has(feature.properties.minutes)
    )
  };

  return L.geoJSON(visibleGeojson, {
    pane: "overlayPane",
    style: (feature) => walkingContourStyle(feature, isMobileLayout)
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
  await loadLeaflet();
  const mobileLayoutQuery = window.matchMedia("(max-width: 960px)");

  const [zones, places, routes, isochrones] = await Promise.all([
    loadJson("./data/recommendation-zones.geojson"),
    loadJson("./data/places.json"),
    loadJson("./data/routes.json"),
    loadJson("./data/walking-isochrones.geojson")
  ]);

  const parisBounds = L.latLngBounds(parisBoundsCoordinates);
  const map = L.map("map", {
    zoomControl: true,
    attributionControl: true,
    preferCanvas: false,
    dragging: !mobileLayoutQuery.matches,
    maxBounds: parisBounds,
    maxBoundsViscosity: 1
  });
  map.setView(places.mapView.center, places.mapView.zoom);
  syncParisViewLimits(map, parisBounds);
  map.on("resize", () => syncParisViewLimits(map, parisBounds));

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  map.attributionControl.setPrefix(false);

  L.control.scale({ metric: true, imperial: false, position: "bottomleft" }).addTo(map);

  const zoneLayer = addRecommendationZones(map, zones, mobileLayoutQuery.matches);
  const contourLayer = addIsochrones(map, isochrones, mobileLayoutQuery.matches);
  mobileLayoutQuery.addEventListener("change", (event) => {
    if (event.matches) {
      map.dragging.disable();
    } else {
      map.dragging.enable();
    }
    zoneLayer.setStyle((feature) => recommendationZoneStyle(feature, event.matches));
    contourLayer.setStyle((feature) => walkingContourStyle(feature, event.matches));
  });
  addPlaces(map, places);
  renderMapDescription(zones);
  renderRouteTimes(routes);

  const bounds = L.latLngBounds([]);
  contourLayer.eachLayer((layer) => bounds.extend(layer.getBounds()));
  zoneLayer.eachLayer((layer) => bounds.extend(layer.getBounds()));
  map.fitBounds(bounds.pad(0.06));
}

main().catch((error) => {
  console.error(error);
  const map = document.querySelector("#map");
  const message = document.createElement("p");
  message.className = "map-error__message";
  message.textContent =
    "The interactive map could not load. Check your connection, then reload the page.";
  map.classList.add("map-error");
  map.replaceChildren(message);
});
