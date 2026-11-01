import type { BrandStyle, CityStatus, Step } from './entities';

export const BRAND_LIST: BrandStyle[] = [
  { name: 'Auchan', color: '#e11d48', letter: 'A' },
  { name: 'Carrefour', color: '#1d4ed8', letter: 'C' },
  { name: 'Coopérative U', color: '#0891b2', letter: 'U' },
  { name: 'E.Leclerc', color: '#ea580c', letter: 'L' },
  { name: 'Intermarché', color: '#16a34a', letter: 'I' },
];

export const BRAND_BY_NAME: Record<string, BrandStyle> = Object.fromEntries(
  BRAND_LIST.map((brand) => [brand.name, brand]),
);

export const REGION_COLORS: Record<string, string> = {
  'Grand Est': '#7c3aed',
  'Bourgogne-Franche-Comté': '#db2777',
  'Nouvelle-Aquitaine': '#059669',
  'Hauts-de-France': '#2563eb',
  'Centre-Val de Loire': '#d97706',
};

export const CITY_STATUS_LABELS: Record<CityStatus, string> = {
  'prefecture-region': 'Préfecture de région',
  prefecture: 'Préfecture de département',
  'sous-prefecture': 'Sous-préfecture',
};

export interface StepDefinition {
  id: Step;
  title: string;
  subtitle: string;
}

export const STEP_LIST: StepDefinition[] = [
  { id: 1, title: 'Régions', subtitle: 'Tirage des régions' },
  { id: 2, title: 'Villes', subtitle: 'Tirage des villes' },
  { id: 3, title: 'Magasins éligibles', subtitle: 'Drives & tirage par enseigne' },
  { id: 4, title: 'Sélection finale', subtitle: 'Drives retenus' },
];
