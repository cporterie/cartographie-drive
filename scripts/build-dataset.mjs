// Génère public/data/dataset.json à partir de source-data.mjs en géocodant
// villes et adresses via l'API Adresse (api-adresse.data.gouv.fr).
// Usage : node scripts/build-dataset.mjs
import { writeFile } from 'node:fs/promises';
import {
  ALL_REGIONS,
  REGION_DRAW,
  CITIES,
  CITY_GEOCODE_ALIAS,
  CITIES_PER_REGION,
  STORES,
} from './source-data.mjs';

const API = 'https://api-adresse.data.gouv.fr/search/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(params) {
  const url = `${API}?${new URLSearchParams(params)}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url);
    if (res.ok) return (await res.json()).features ?? [];
    await sleep(1000 * (attempt + 1));
  }
  throw new Error(`Échec géocodage : ${url}`);
}

async function geocodeCity(name, region) {
  const q = CITY_GEOCODE_ALIAS[name] ?? name;
  const features = await search({ q, type: 'municipality', limit: '15' });
  const match = features.find((f) => f.properties.context.endsWith(region));
  if (!match) throw new Error(`Ville introuvable : ${name} (${region})`);
  const [lng, lat] = match.geometry.coordinates;
  return { lat, lng, citycode: match.properties.citycode, department: match.properties.context.split(',').slice(0, 2).join(',').trim() };
}

const ABBREVIATIONS = [
  [/\bRte\b\.?/g, 'Route'],
  [/\bAv\.\s*/g, 'Avenue '],
  [/\bBd\b\.?/g, 'Boulevard'],
  [/\bPl\.\s*/g, 'Place '],
];

function expand(address) {
  return ABBREVIATIONS.reduce((acc, [re, rep]) => acc.replace(re, rep), address);
}

async function geocodeStore(address, city) {
  const features = await search({ q: expand(address), citycode: city.citycode, limit: '1' });
  const best = features[0];
  if (best && best.properties.score >= 0.45 && best.properties.type !== 'municipality') {
    const [lng, lat] = best.geometry.coordinates;
    return { lat, lng, approx: false, label: best.properties.label };
  }
  // Second essai : communes voisines du même département (zones commerciales en périphérie).
  const deptCode = city.department.split(',')[0];
  const nearby = await search({ q: `${expand(address)} ${city.name}`, limit: '5' });
  const match = nearby.find(
    (f) => f.properties.context.startsWith(`${deptCode},`) && f.properties.score >= 0.5 && f.properties.type !== 'municipality',
  );
  if (match) {
    const [lng, lat] = match.geometry.coordinates;
    return { lat, lng, approx: false, label: match.properties.label };
  }
  return null;
}

const BRAND_KEYWORD = {
  Auchan: 'auchan',
  Carrefour: 'carrefour',
  'Coopérative U': 'u',
  'E.Leclerc': 'leclerc',
  Intermarché: 'intermarch',
};

const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function distanceKm(a, b) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

// Troisième essai : recherche du magasin (POI) dans OpenStreetMap via Nominatim.
async function geocodeStoreOsm(brand, address, type, city, placed) {
  await sleep(1100);
  const params = new URLSearchParams({ q: `${brand} ${city.name}`, format: 'jsonv2', countrycodes: 'fr', limit: '15' });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { 'User-Agent': 'cartographie-drive-dataset/1.0' },
  });
  if (!res.ok) return null;
  const keyword = BRAND_KEYWORD[brand];
  const results = (await res.json())
    .map((r) => ({ ...r, lat: +r.lat, lng: +r.lon }))
    .filter((r) => ['shop', 'amenity'].includes(r.category))
    .filter((r) => norm(r.name ?? '').split(/[^a-z]+/).some((w) => w.startsWith(keyword)))
    .filter((r) => distanceKm(r, city) < 12)
    .filter((r) => !placed.some((p) => distanceKm(r, p) < 0.3));
  if (!results.length) return null;
  const streetWords = norm(expand(address)).split(/[^a-z]+/).filter((w) => w.length > 3);
  const byStreet = results.find((r) => streetWords.some((w) => norm(r.display_name).includes(w)));
  const isMarket = /market/i.test(type);
  const byType = results.find((r) => /market/i.test(r.name ?? '') === isMarket);
  const best = byStreet ?? byType ?? results[0];
  return { lat: best.lat, lng: best.lng, approx: false, label: `OSM: ${best.display_name}` };
}

const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

async function main() {
  const regions = ALL_REGIONS.map((name) => ({
    name,
    drawOrder: REGION_DRAW.includes(name) ? REGION_DRAW.indexOf(name) + 1 : null,
  }));

  const storeCities = new Set();
  for (const [region, byBrand] of Object.entries(STORES)) {
    for (const { candidates } of Object.values(byBrand)) {
      for (const [city] of candidates) storeCities.add(`${region}|${city}`);
    }
  }

  const cities = [];
  const cityIndex = new Map();
  for (const region of REGION_DRAW) {
    const def = CITIES[region];
    const statusOf = (name) =>
      name === def.prefRegion ? 'prefecture-region' : def.prefs.includes(name) ? 'prefecture' : 'sous-prefecture';
    for (const [i, name] of def.draw.entries()) {
      const geo = await geocodeCity(name, region);
      const drawOrder = i + 1;
      const selection =
        drawOrder <= CITIES_PER_REGION ? 'tirage' : storeCities.has(`${region}|${name}`) ? 'supplementaire' : null;
      const city = { id: slug(`${region}-${name}`), name, region, status: statusOf(name), drawOrder, selection, department: geo.department, lat: geo.lat, lng: geo.lng };
      cities.push(city);
      cityIndex.set(`${region}|${name}`, { ...city, citycode: geo.citycode });
      process.stdout.write(`✓ ${name}\n`);
      await sleep(40);
    }
  }

  const stores = [];
  const fallbackCount = new Map();
  const pending = [];
  for (const [region, byBrand] of Object.entries(STORES)) {
    for (const [brand, { candidates, drawn, retained }] of Object.entries(byBrand)) {
      for (const [cityName, address, type] of candidates) {
        const city = cityIndex.get(`${region}|${cityName}`);
        if (!city) throw new Error(`Ville inconnue pour magasin : ${cityName}`);
        const geo = await geocodeStore(address, city);
        const store = {
          id: slug(`${region}-${brand}-${cityName}-${address}`),
          region,
          city: cityName,
          brand,
          address,
          type,
          drawn: address === drawn,
          retained: address === retained,
          approx: true,
          lat: city.lat,
          lng: city.lng,
        };
        stores.push(store);
        if (geo) {
          Object.assign(store, { approx: false, lat: geo.lat, lng: geo.lng });
          process.stdout.write(`✓ ${brand} ${address} → ${geo.label}\n`);
        } else {
          pending.push({ store, city });
        }
        await sleep(40);
      }
    }
  }

  for (const { store, city } of pending) {
    const placed = stores.filter((s) => !s.approx);
    const geo = await geocodeStoreOsm(store.brand, store.address, store.type, city, placed);
    if (geo) {
      Object.assign(store, { approx: false, lat: geo.lat, lng: geo.lng });
      process.stdout.write(`✓ ${store.brand} ${store.address} → ${geo.label}\n`);
    } else {
      // Repli : centre-ville légèrement décalé pour éviter les superpositions.
      const n = fallbackCount.get(city.id) ?? 0;
      fallbackCount.set(city.id, n + 1);
      const angle = n * 2.4;
      Object.assign(store, { lat: city.lat + 0.006 * Math.cos(angle), lng: city.lng + 0.009 * Math.sin(angle) });
      process.stdout.write(`~ ${store.brand} ${store.address} (${city.name}) → position approximative\n`);
    }
  }

  const dataset = { generatedAt: new Date().toISOString(), regions, cities, stores };
  await writeFile(new URL('../public/data/dataset.json', import.meta.url), JSON.stringify(dataset, null, 1));
  console.log(`\n${regions.length} régions, ${cities.length} villes, ${stores.length} magasins.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
