import { computed, inject, Injectable } from '@angular/core';
import { BRAND_LIST, REGION_COLORS } from '../models/constants';
import type { City, Store } from '../models/entities';
import { DataService } from './data.service';

export interface BrandGroup {
  brand: string;
  color: string;
  letter: string;
  candidates: Store[];
  drawn?: Store;
  retained?: Store;
}

export interface RegionCities {
  region: string;
  color: string;
  all: City[];
  selected: City[];
}

export interface RegionStores {
  region: string;
  color: string;
  brands: BrandGroup[];
}

export interface PresentationStats {
  regions: number;
  drawnRegions: number;
  cities: number;
  drawnCities: number;
  extraCities: number;
  stores: number;
  drawnStores: number;
  retained: number;
  retainedSame: number;
}

@Injectable({ providedIn: 'root' })
export class PresentationDataService {
  private readonly dataService = inject(DataService);
  readonly dataset = this.dataService.dataset;

  readonly drawnRegions = computed(() =>
    (this.dataset()?.regions ?? []).filter((region) => region.drawOrder !== null)
      .sort((a, b) => a.drawOrder! - b.drawOrder!),
  );
  readonly otherRegions = computed(() =>
    (this.dataset()?.regions ?? []).filter((region) => region.drawOrder === null),
  );

  readonly citiesByRegion = computed<RegionCities[]>(() =>
    this.drawnRegions().map((region) => {
      const all = (this.dataset()?.cities ?? [])
        .filter((city) => city.region === region.name)
        .sort((a, b) => a.drawOrder - b.drawOrder);
      return {
        region: region.name,
        color: REGION_COLORS[region.name],
        all,
        selected: all.filter((city) => city.selection !== null),
      };
    }),
  );

  readonly storesByRegion = computed<RegionStores[]>(() =>
    this.drawnRegions().map((region) => {
      const stores = (this.dataset()?.stores ?? []).filter((store) => store.region === region.name);
      const brands = BRAND_LIST.map((brand) => {
        const candidates = stores.filter((store) => store.brand === brand.name);
        return {
          brand: brand.name,
          color: brand.color,
          letter: brand.letter,
          candidates,
          drawn: candidates.find((store) => store.drawn),
          retained: candidates.find((store) => store.retained),
        };
      });
      return { region: region.name, color: REGION_COLORS[region.name], brands };
    }),
  );

  readonly stats = computed<PresentationStats | null>(() => {
    const dataset = this.dataset();
    if (!dataset) return null;

    const retainedStores = dataset.stores.filter((store) => store.retained);
    return {
      regions: dataset.regions.length,
      drawnRegions: this.drawnRegions().length,
      cities: dataset.cities.length,
      drawnCities: dataset.cities.filter((city) => city.selection === 'tirage').length,
      extraCities: dataset.cities.filter((city) => city.selection === 'supplementaire').length,
      stores: dataset.stores.length,
      drawnStores: dataset.stores.filter((store) => store.drawn).length,
      retained: retainedStores.length,
      retainedSame: retainedStores.filter((store) => store.drawn).length,
    };
  });
}
