import { Injectable, signal } from '@angular/core';
import type { Feature, FeatureCollection, MultiPolygon } from 'geojson';
import type { Dataset } from '../models/entities';

@Injectable({ providedIn: 'root' })
export class DataService {
  readonly dataset = signal<Dataset | null>(null);
  readonly regionsGeo = signal<FeatureCollection | null>(null);
  readonly franceOutline = signal<Feature<MultiPolygon> | null>(null);
  readonly error = signal<string | null>(null);

  async load(): Promise<void> {
    try {
      const [dataset, regions, outline] = await Promise.all([
        this.fetchJson<Dataset>('data/dataset.json'),
        this.fetchJson<FeatureCollection>('data/regions.geojson'),
        this.fetchJson<Feature<MultiPolygon>>('data/france.geojson'),
      ]);
      this.dataset.set(dataset);
      this.regionsGeo.set(regions);
      this.franceOutline.set(outline);
      this.error.set(null);
    } catch (error) {
      console.error('Échec du chargement des données cartographiques.', error);
      this.error.set('Impossible de charger les données. Vérifiez votre connexion puis rechargez la page.');
    }
  }

  private async fetchJson<T>(path: string): Promise<T> {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Chargement impossible (${response.status}) : ${path}`);
    return response.json() as Promise<T>;
  }
}
