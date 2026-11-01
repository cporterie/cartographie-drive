import { Component, HostListener, inject, signal, viewChild } from '@angular/core';
import { DataService } from './data/data.service';
import { PresentationDataService } from './data/presentation-data.service';
import { AppHeaderComponent } from './layout/app-header.component';
import { MapLegendComponent } from './layout/map-legend.component';
import { FranceMapComponent } from './map/france-map.component';
import { BRAND_BY_NAME, BRAND_LIST, CITY_STATUS_LABELS, REGION_COLORS, STEP_LIST } from './models/constants';
import type { City, Step, Store } from './models/entities';
import { StepContentComponent } from './steps/step-content.component';

@Component({
  selector: 'app-root',
  imports: [AppHeaderComponent, StepContentComponent, FranceMapComponent, MapLegendComponent],
  templateUrl: './app.html',
})
export class App {
  private readonly dataService = inject(DataService);
  private readonly presentation = inject(PresentationDataService);
  private readonly map = viewChild(FranceMapComponent);

  readonly steps = STEP_LIST;
  readonly brandList = BRAND_LIST;
  readonly regionColors = REGION_COLORS;
  readonly statusLabels = CITY_STATUS_LABELS;
  readonly brandByName = BRAND_BY_NAME;

  readonly data = this.presentation.dataset;
  readonly geo = this.dataService.regionsGeo;
  readonly outline = this.dataService.franceOutline;
  readonly error = this.dataService.error;
  readonly stats = this.presentation.stats;
  readonly drawnRegions = this.presentation.drawnRegions;
  readonly otherRegions = this.presentation.otherRegions;
  readonly citiesByRegion = this.presentation.citiesByRegion;
  readonly storesByRegion = this.presentation.storesByRegion;

  readonly step = signal<Step>(1);
  readonly visibleBrands = signal<ReadonlySet<string>>(new Set(BRAND_LIST.map((brand) => brand.name)));
  readonly hoveredId = signal<string | null>(null);
  readonly expandedRegions = signal<ReadonlySet<string>>(new Set());

  constructor() {
    this.dataService.load();
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') this.next();
    if (e.key === 'ArrowLeft') this.prev();
  }

  goTo(step: Step): void {
    this.step.set(step);
    this.hoveredId.set(null);
  }

  next(): void {
    if (this.step() < 4) this.goTo((this.step() + 1) as Step);
  }

  prev(): void {
    if (this.step() > 1) this.goTo((this.step() - 1) as Step);
  }

  toggleBrand(name: string): void {
    const set = new Set(this.visibleBrands());
    if (set.has(name) && set.size > 1) set.delete(name);
    else set.add(name);
    this.visibleBrands.set(set);
  }

  showAllBrands(): void {
    this.visibleBrands.set(new Set(BRAND_LIST.map((brand) => brand.name)));
  }

  toggleExpanded(region: string): void {
    const set = new Set(this.expandedRegions());
    if (set.has(region)) set.delete(region);
    else set.add(region);
    this.expandedRegions.set(set);
  }

  hover(id: string | null): void {
    this.map()?.highlight(id);
  }

  focusRegion(name: string): void {
    this.map()?.focusRegion(name);
  }

  focus(item: City | Store): void {
    if ('brand' in item && !this.visibleBrands().has(item.brand)) this.toggleBrand(item.brand);
    // Laisse la carte recréer le marqueur si le filtre vient de changer.
    setTimeout(() => this.map()?.focusMarker(item.id));
  }

  onMapHover(id: string | null): void {
    this.hoveredId.set(id);
  }
}
