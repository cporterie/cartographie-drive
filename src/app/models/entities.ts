export type CityStatus = 'prefecture-region' | 'prefecture' | 'sous-prefecture';

export interface Region {
  name: string;
  drawOrder: number | null;
}

export interface City {
  id: string;
  name: string;
  region: string;
  status: CityStatus;
  drawOrder: number;
  selection: 'tirage' | 'supplementaire' | null;
  department: string;
  lat: number;
  lng: number;
}

export interface Store {
  id: string;
  region: string;
  city: string;
  brand: string;
  address: string;
  type: string;
  drawn: boolean;
  retained: boolean;
  approx: boolean;
  lat: number;
  lng: number;
}

export interface Dataset {
  generatedAt: string;
  regions: Region[];
  cities: City[];
  stores: Store[];
}

export type Step = 1 | 2 | 3 | 4;

export interface BrandStyle {
  name: string;
  color: string;
  letter: string;
}
