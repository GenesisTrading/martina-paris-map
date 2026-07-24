# Paris accommodation map validation report

Checked date: 2026-07-24
Generated: 2026-07-24T18:32:59.078Z

## Conclusion

The deliverable distinguishes objective walking-time contours from subjective accommodation recommendation zones. Per the latest map-owner decision, the red recommendation fill deliberately reuses the objective 15-minute pedestrian isochrone from Gare du Nord. Green and blue recommendation polygons remain separate manually selected accommodation zones. Recommendation polygons are explicit editable GeoJSON geometries and are not inferred from neighbourhood names.

## Sources

- Named locations: Nominatim / OpenStreetMap geocoding (https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=...).
- Street-intersection vertices: OpenStreetMap geometry queried with Overpass (https://overpass.openstreetmap.fr/api/interpreter); manual vertices are explicitly marked where the boundary is a selected station frontage or side-street edge rather than a clean shared OSM node.
- Walking routes: routing.openstreetmap.de routed-foot server, OSRM-compatible foot profile (https://routing.openstreetmap.de/routed-foot).
- Walking contours: OSRM table service sampled on a regular grid, then contoured programmatically.
- Basemap: OpenStreetMap tiles with attribution preserved in the Leaflet map (https://www.openstreetmap.org/copyright).

## Named Locations And Walking Times

Single origin: Gare du Nord, 2.3562878, 48.8819585.

| Location | Coordinate lon, lat | Geocoding source | Walking time | Route distance | Origin snap |
| --- | --- | --- | --- | --- | --- |
| Gare du Nord | 2.3562878, 48.8819585 | Nominatim / OpenStreetMap; way/736530618 | 0.0 min | 0 m | 0 m |
| Gare de l'Est | 2.3594905, 48.8770979 | Nominatim / OpenStreetMap; node/2506241285 | 10.9 min | 817 m | 4 m |
| Avenue Trudaine | 2.3423161, 48.8811577 | Nominatim / OpenStreetMap; way/107612538 | 16.2 min | 1,214 m | 4 m |
| Rue des Martyrs | 2.3400276, 48.8811569 | Nominatim / OpenStreetMap; way/36893345 | 18.8 min | 1,407 m | 4 m |
| Rue Cadet | 2.3440609, 48.8762375 | Nominatim / OpenStreetMap; way/120519181 | 16.8 min | 1,258 m | 4 m |
| Porte Saint-Martin | 2.3556515, 48.8691459 | Nominatim / OpenStreetMap; relation/3178897 | 21.6 min | 1,621 m | 4 m |
| Canal Saint-Martin | 2.3671691, 48.8689561 | Nominatim / OpenStreetMap; relation/1164565 | 26.7 min | 2,004 m | 4 m |
| Place Jacques Bonsergent | 2.3610301, 48.8710142 | Nominatim / OpenStreetMap; relation/14358328 | 18.7 min | 1,403 m | 4 m |
| Place de la République | 2.3639583, 48.8675421 | Nominatim / OpenStreetMap; way/450130138 | 25.0 min | 1,905 m | 4 m |

## Recommendation Zone Label Walking Times

These are pedestrian routes to the label point of each recommendation polygon. For green and blue, they are not claims that every point inside the polygon has that same walking time. For red, the polygon itself is the generated 15-minute walking contour.

| Zone | Label coordinate lon, lat | Walking time | Route distance | Snapped target |
| --- | --- | --- | --- | --- |
| 15-minute walking red zone | 2.3563000, 48.8799000 | 3.8 min | 288 m | 2.3563190, 48.8799430 |
| Avenue Trudaine | 2.3426000, 48.8817500 | 16.6 min | 1,241 m | 2.3423570, 48.8817030 |
| Lower rue des Martyrs | 2.3393500, 48.8778500 | 19.7 min | 1,478 m | 2.3394640, 48.8778360 |
| Rue Cadet | 2.3433500, 48.8749000 | 18.6 min | 1,392 m | 2.3431000, 48.8749870 |
| Porte Saint-Martin | 2.3556500, 48.8691500 | 21.6 min | 1,621 m | 2.3556280, 48.8691110 |
| Canal Saint-Martin central | 2.3635500, 48.8736000 | 18.6 min | 1,397 m | 2.3633430, 48.8735300 |
| Jacques Bonsergent / République edge | 2.3618000, 48.8710000 | 19.6 min | 1,468 m | 2.3617000, 48.8710450 |

## Label-In-Polygon Validation

| Zone ID | Label | Label coordinate lon, lat | Inside polygon |
| --- | --- | --- | --- |
| red_15_min_walking_contour | 15-min red zone | 2.3563000, 48.8799000 | yes |
| green_avenue_trudaine | Avenue Trudaine | 2.3426000, 48.8817500 | yes |
| green_lower_rue_des_martyrs | Lower rue des Martyrs | 2.3393500, 48.8778500 | yes |
| green_rue_cadet | Rue Cadet | 2.3433500, 48.8749000 | yes |
| blue_porte_saint_martin | Porte Saint-Martin | 2.3556500, 48.8691500 | yes |
| blue_canal_saint_martin_central | Canal Saint-Martin | 2.3635500, 48.8736000 | yes |
| blue_jacques_bonsergent_republique_edge | Toward République | 2.3618000, 48.8710000 | yes |

Result: all labels lie inside their assigned polygons.

## Recommendation Polygons

Recommendation polygon bbox: 2.3376500, 48.8681500, 2.3684907, 48.8898224.

### 15-minute walking red zone

Category: Not recommended

Boundary: Objective 15-minute pedestrian isochrone from Gare du Nord, intentionally used as the full red recommendation fill.

| Geometry item | Value |
| --- | --- |
| Geometry type | MultiPolygon |
| Exact coordinate source | data/walking-isochrones.geojson feature walk_15_min |
| Source method | osrm-route-sampled-contours |
| Coordinate count | 87 coordinate positions |
| Bounding box lon, lat | 2.3438186, 48.8725684, 2.3684907, 48.8898224 |
| GeoJSON feature | data/recommendation-zones.geojson feature red_15_min_walking_contour |

### Avenue Trudaine

Category: Recommended

Boundary: Avenue Trudaine immediate surroundings from Rue des Martyrs to Rue Marguerite-de-Rochechouart / Place d'Anvers, bounded by Boulevard Marguerite-de-Rochechouart to the north and Avenue Trudaine frontage to the south.

| # | Coordinate lon, lat | Source | Street / note |
| --- | --- | --- | --- |
| 1 | 2.3396650, 48.8819055 | OSM node 583011680 | Boulevard Marguerite-de-Rochechouart x Rue des Martyrs |
| 2 | 2.3445259, 48.8827966 | OSM node 94210394 | Boulevard Marguerite-de-Rochechouart x Place d'Anvers |
| 3 | 2.3466024, 48.8819948 | OSM node 19715146 | Avenue Trudaine x Rue Marguerite-de-Rochechouart |
| 4 | 2.3425309, 48.8811236 | OSM node 299271453 | Avenue Trudaine x Rue Bochart-de-Saron |
| 5 | 2.3402436, 48.8807224 | OSM node 94178357 | Avenue Trudaine x Rue des Martyrs |

### Lower rue des Martyrs

Category: Recommended

Boundary: Lower rue des Martyrs from Rue Notre-Dame-de-Lorette / Rue Saint-Lazare to Rue Clauzel / Rue de Navarin, with immediate side-street frontage only.

| # | Coordinate lon, lat | Source | Street / note |
| --- | --- | --- | --- |
| 1 | 2.3392274, 48.8767703 | OSM node 8296960601 | Rue des Martyrs x Rue Notre-Dame-de-Lorette / Rue Saint-Lazare |
| 2 | 2.3401000, 48.8768600 | manual vertex | Manual east-side lower rue des Martyrs frontage vertex |
| 3 | 2.3406500, 48.8787500 | manual vertex | Manual east-side vertex near Rue Manuel / Rue Clauzel |
| 4 | 2.3398288, 48.8789160 | OSM node 94220177 | Rue des Martyrs x Rue Clauzel |
| 5 | 2.3376500, 48.8791800 | manual vertex | Manual west-side vertex near Rue Henry-Monnier / Rue Clauzel |
| 6 | 2.3379500, 48.8772500 | manual vertex | Manual west-side lower rue des Martyrs frontage vertex |

### Rue Cadet

Category: Recommended

Boundary: Rue Cadet and pleasant immediate surroundings bounded by Rue La Fayette, Rue Richer, Rue du Faubourg-Montmartre, Rue Bleue and Rue de Trévise.

| # | Coordinate lon, lat | Source | Street / note |
| --- | --- | --- | --- |
| 1 | 2.3410134, 48.8750946 | OSM node 94172435 | Rue La Fayette x Rue du Faubourg-Montmartre |
| 2 | 2.3436186, 48.8757784 | OSM node 13361133305 | Rue Cadet x Rue La Fayette |
| 3 | 2.3446491, 48.8760412 | OSM node 13932131988 | Rue Bleue x Rue La Fayette |
| 4 | 2.3453266, 48.8740337 | OSM node 94159488 | Rue de Trévise x Rue Richer |
| 5 | 2.3423548, 48.8740484 | OSM node 94171698 | Rue Cadet x Rue Richer |

### Porte Saint-Martin

Category: Acceptable compromise — check the exact street

Boundary: Porte Saint-Martin compromise polygon around Boulevard Saint-Denis / Boulevard Saint-Martin, Rue du Faubourg Saint-Denis, Rue du Faubourg Saint-Martin and Rue René-Boulanger / Rue Meslay.

| # | Coordinate lon, lat | Source | Street / note |
| --- | --- | --- | --- |
| 1 | 2.3529500, 48.8697400 | manual vertex | Manual west boundary vertex near Boulevard Saint-Denis / Rue du Faubourg Saint-Denis |
| 2 | 2.3563500, 48.8702300 | manual vertex | Manual Boulevard Saint-Martin north edge vertex |
| 3 | 2.3587500, 48.8701500 | manual vertex | Manual east boundary vertex near Boulevard Saint-Martin / Rue du Faubourg Saint-Martin |
| 4 | 2.3587875, 48.8689332 | OSM node 289568129 | Rue René-Boulanger x Rue Taylor |
| 5 | 2.3540500, 48.8681500 | manual vertex | Manual south-west vertex on the Rue René-Boulanger / Rue Meslay side |

### Canal Saint-Martin central

Category: Acceptable compromise — check the exact street

Boundary: Pleasant western and central canal-side section bounded by Quai de Valmy and Quai de Jemmapes between Rue des Récollets / Rue Lucien-Sampaix and Rue de Lancry / Rue Bichat.

| # | Coordinate lon, lat | Source | Street / note |
| --- | --- | --- | --- |
| 1 | 2.3628097, 48.8744529 | OSM node 5851342227 | Rue Lucien-Sampaix x Quai de Valmy |
| 2 | 2.3635398, 48.8740589 | OSM node 367947 | Quai de Jemmapes x Rue Bichat |
| 3 | 2.3643500, 48.8727800 | manual vertex | Manual east-bank vertex near Rue de Lancry / Quai de Jemmapes |
| 4 | 2.3637458, 48.8729141 | OSM node 94142445 | Quai de Valmy x Rue de Lancry |

### Jacques Bonsergent / République edge

Category: Acceptable compromise — check the exact street

Boundary: Selected realistically accessible parts toward République, bounded by Boulevard de Magenta, Rue de Lancry, Quai de Valmy / Rue Beaurepaire and Rue Yves-Toudic / Rue de Marseille.

| # | Coordinate lon, lat | Source | Street / note |
| --- | --- | --- | --- |
| 1 | 2.3612095, 48.8705348 | OSM node 243635109 | Rue de Lancry x Boulevard de Magenta |
| 2 | 2.3637458, 48.8729141 | OSM node 94142445 | Quai de Valmy x Rue de Lancry |
| 3 | 2.3642500, 48.8716000 | manual vertex | Manual east boundary vertex on the Quai de Valmy / Rue Beaurepaire side |
| 4 | 2.3637672, 48.8699297 | OSM node 94141550 | Rue Beaurepaire x Rue Yves-Toudic |
| 5 | 2.3626499, 48.8712258 | OSM node 94141551 | Rue Yves-Toudic x Rue de Marseille |

## Walking-Time Contours

- 15-minute pedestrian contour: objective routing-derived contour from the single Gare du Nord origin; also used as the red recommendation fill.
- 20-minute pedestrian contour: objective routing-derived contour from the single Gare du Nord origin.
- Contours file: data/walking-isochrones.geojson.
- Source method: osrm-route-sampled-contours.

## Assumptions And Uncertainties

- Gare du Nord is represented by the Nominatim coordinate for OSM way/736530618. OSRM snaps route starts to the nearest routable pedestrian graph point; the snap distance is reported above.
- Long street geocodes, especially Rue des Martyrs and Canal Saint-Martin, represent full linear features. The approved green and blue accommodation polygons use manually selected subsections and separate label points inside those polygons.
- Manual vertices were selected for green and blue to follow approved boundary streets and to avoid oversized generic neighbourhood polygons.
- The active red recommendation geometry is not the earlier compact station-frontage selection. It is the full 15-minute walking contour by explicit map-owner instruction.
- OSRM / ORS walking times are modelled routing-service times based on available OSM pedestrian data, not observed travel times.
- If ORS_API_KEY is not provided, contours are generated from OSRM route-duration samples and interpolation between sampled points. That is routing-derived but approximate between grid points.
- The 15-minute red contour may include any street segment the routing service considers reachable from Gare du Nord within 15 minutes, including parts north or east of the station. That reachability result is now intentional for red only.
