# Data and map licensing

The repository contains original software, geographic datasets derived from third-party
sources, subjective recommendation data, and rendered map images. They do not all share the
same licensing basis.

## Original software

The original HTML, CSS, JavaScript and supporting build scripts are licensed under the
[MIT License](./LICENSE).

## Geographic and recommendation data

The files under `data/`, the geographic definitions in `src/geography.mjs`, and
`validation-report.md` contain or derive from OpenStreetMap data and routing services based
on OpenStreetMap.

OpenStreetMap data is © OpenStreetMap contributors and is available under the
[Open Database License 1.0](https://opendatacommons.org/licenses/odbl/1-0/). To the extent
that the repository's geographic datasets constitute a derivative database, they are made
available under the same ODbL 1.0 terms.

The manually authored recommendation classifications, labels and polygon refinements are
also made available under ODbL 1.0 when distributed as part of those datasets. Third-party
data remains subject to its original source licence and terms; no ownership of third-party
material is claimed.

## Rendered map images

Files under `exports/` are produced works containing OpenStreetMap's standard basemap and
data. The basemap and data are © OpenStreetMap contributors. The original recommendation
overlay and composition are © 2026 Raphael M. and are made available under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), subject to preserving the
OpenStreetMap attribution and complying with the applicable OpenStreetMap terms.

## Attribution

Public uses of the data or rendered maps must retain a clear attribution:

> © OpenStreetMap contributors

See the [OpenStreetMap copyright and licence page](https://www.openstreetmap.org/copyright)
and the [OpenStreetMap Foundation attribution guidelines](https://osmfoundation.org/wiki/Licence/Attribution_Guidelines)
for details.
