// Télécharge les contours précis des régions (IGN/Etalab, 100 m) et génère
// public/data/regions.geojson et public/data/france.geojson (métropole uniquement).
// Usage : node scripts/build-geo.mjs
import { writeFile } from 'node:fs/promises';

const URL_REGIONS = 'https://etalab-datasets.geo.data.gouv.fr/contours-administratifs/2024/geojson/regions-100m.geojson';

const round = (coords) =>
  typeof coords[0] === 'number' ? coords.map((n) => Math.round(n * 1e5) / 1e5) : coords.map(round);

const src = await (await fetch(URL_REGIONS)).json();
const features = src.features
  .filter((f) => Number(f.properties.code) >= 11 && Number(f.properties.code) <= 94)
  .map((f) => ({
    type: 'Feature',
    properties: { code: f.properties.code, nom: f.properties.nom },
    geometry: { type: f.geometry.type, coordinates: round(f.geometry.coordinates) },
  }));

const polygons = features.flatMap((f) =>
  f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates,
);

const out = (name) => new URL(`../public/data/${name}`, import.meta.url);
await writeFile(out('regions.geojson'), JSON.stringify({ type: 'FeatureCollection', features }));
await writeFile(
  out('france.geojson'),
  JSON.stringify({ type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates: polygons } }),
);
console.log(features.map((f) => f.properties.nom).join(', '));
