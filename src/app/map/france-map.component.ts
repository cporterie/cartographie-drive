import {
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import type { Feature, FeatureCollection, MultiPolygon } from 'geojson';
import { BRAND_BY_NAME, REGION_COLORS } from '../models/constants';
import type { City, Dataset, Step, Store } from '../models/entities';
import { escapeHtml as esc } from './map-html.util';
import { MapBaseLayerService } from './map-base-layer.service';
import { MapLabelService } from './map-label.service';
import { MapPopupService } from './map-popup.service';

const NEUTRAL = '#cbd5e1';

@Component({
  selector: 'app-france-map',
  template: `<div #host class="map-host"></div>`,
  styles: `
    :host { display: block; position: relative; height: 100%; }
    .map-host { position: absolute; inset: 0; }
  `,
})
export class FranceMapComponent implements OnDestroy {
  private readonly labelService = inject(MapLabelService);
  private readonly baseLayerService = inject(MapBaseLayerService);
  private readonly popupService = inject(MapPopupService);

  readonly step = input.required<Step>();
  readonly data = input.required<Dataset>();
  readonly geo = input.required<FeatureCollection>();
  readonly outline = input.required<Feature<MultiPolygon>>();
  readonly brands = input.required<ReadonlySet<string>>();
  readonly hovered = output<string | null>();

  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');
  private readonly ready = signal(false);

  private map!: L.Map;
  private regionLayer!: L.GeoJSON;
  private readonly regionPaths = new Map<string, L.Path>();
  private readonly overlay = L.layerGroup();
  private readonly labels = L.layerGroup();
  private readonly markers = new Map<string, L.Marker | L.CircleMarker>();
  private readonly baseRadius = new Map<string, number>();
  private lastStep: Step | null = null;
  private activeId: string | null = null;

  constructor() {
    afterNextRender(() => this.init());
    effect(() => {
      const step = this.step();
      this.brands();
      if (this.ready()) this.render(step);
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  // ---------- API publique ----------

  resetView(): void {
    this.fitStep(this.step());
  }

  focusRegion(name: string): void {
    const path = this.regionPaths.get(name) as L.Polygon | undefined;
    if (path) this.map.flyToBounds(path.getBounds(), { padding: [40, 40], duration: 1 });
  }

  focusMarker(id: string): void {
    const marker = this.markers.get(id);
    if (!marker) return;
    const zoom = marker instanceof L.CircleMarker ? 10 : 15;
    this.map.once('moveend', () => (marker.getPopup() ? marker.openPopup() : marker.openTooltip()));
    this.map.flyTo(marker.getLatLng(), Math.max(zoom, this.map.getZoom()), { duration: 1.1 });
  }

  highlight(id: string | null): void {
    if (this.activeId === id) return;
    this.setActive(this.activeId, false);
    this.activeId = id;
    this.setActive(id, true);
  }

  // ---------- Initialisation ----------

  private init(): void {
    this.map = L.map(this.host().nativeElement, {
      zoomControl: false,
      minZoom: 5,
      maxZoom: 18,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 120,
      maxBounds: L.latLngBounds([40, -8.5], [53, 12.5]),
      maxBoundsViscosity: 0.8,
    }).setView([46.6, 2.4], 6);

    const cleanLayer = this.baseLayerService.initialize(this.map, this.outline(), () => this.resetView());

    this.regionLayer = L.geoJSON(this.geo(), {
      style: (f) => this.regionStyle(f!, this.step()),
      onEachFeature: (f, layer) => this.bindRegion(f, layer as L.Path),
    }).addTo(this.map);

    this.overlay.addTo(this.map);
    this.labels.addTo(this.map);

    const host = this.host().nativeElement;
    const updateZoomClass = () => {
      const z = this.map.getZoom();
      host.classList.toggle('zoom-mid', z >= 7);
      host.classList.toggle('zoom-detail', z >= 9);
      cleanLayer.setOpacity(z < 8 ? 0 : z < 9 ? 0.55 : 1);
    };
    this.map.on('zoomend', updateZoomClass);
    updateZoomClass();

    this.ready.set(true);
  }

  // ---------- Régions ----------

  private regionInfo(name: string) {
    return this.data().regions.find((r) => r.name === name);
  }

  private regionStyle(f: Feature, step: Step): L.PathOptions {
    const name = f.properties?.['nom'] as string;
    const info = this.regionInfo(name);
    const color = REGION_COLORS[name];
    const drawn = !!info?.drawOrder;

    if (!info) {
      return { fillColor: '#f1f5f9', fillOpacity: 0.5, color: '#cbd5e1', weight: 1, dashArray: '4 4' };
    }
    if (step === 1) {
      return drawn
        ? { fillColor: color, fillOpacity: 0.62, color: '#fff', weight: 2.5 }
        : { fillColor: NEUTRAL, fillOpacity: 0.55, color: '#fff', weight: 2 };
    }
    if (step === 2) {
      return drawn
        ? { fillColor: color, fillOpacity: 0.12, color, weight: 2.5 }
        : { fillColor: NEUTRAL, fillOpacity: 0.25, color: '#fff', weight: 1.5 };
    }
    return drawn
      ? { fillColor: color, fillOpacity: 0.08, color, weight: 1.5, opacity: 0.7 }
      : { fillColor: NEUTRAL, fillOpacity: 0.3, color: '#fff', weight: 1 };
  }

  private bindRegion(f: Feature, layer: L.Path): void {
    const name = f.properties?.['nom'] as string;
    this.regionPaths.set(name, layer);
    layer.bindTooltip(() => this.regionTooltip(name), { sticky: true, className: 'map-tip', direction: 'top', offset: [0, -8] });
    layer.on({
      mouseover: () => {
        this.emphasizeRegion(name, true);
        this.hovered.emit(`region:${name}`);
      },
      mouseout: () => {
        this.emphasizeRegion(name, false);
        this.hovered.emit(null);
      },
      click: () => {
        if (this.step() > 1 && this.regionInfo(name)?.drawOrder) this.focusRegion(name);
      },
    });
  }

  private regionTooltip(name: string): string {
    const info = this.regionInfo(name);
    const status = !info
      ? '<span class="muted">Hors périmètre</span>'
      : info.drawOrder
        ? `<span class="tag" style="--c:${REGION_COLORS[name]}">Tirée · n°${info.drawOrder}</span>`
        : '<span class="muted">Non tirée</span>';
    const cityCount = this.data().cities.filter((c) => c.region === name).length;
    const extra = info?.drawOrder ? `<div class="muted">${cityCount} villes éligibles</div>` : '';
    return `<div class="tip-title">${esc(name)}</div>${status}${extra}`;
  }

  private emphasizeRegion(name: string, on: boolean): void {
    const path = this.regionPaths.get(name);
    if (!path) return;
    const base = this.regionStyle({ type: 'Feature', properties: { nom: name }, geometry: null as never }, this.step());
    path.setStyle(
      on
        ? { ...base, fillOpacity: Math.min((base.fillOpacity ?? 0.3) + 0.18, 0.85), weight: (base.weight ?? 1) + 1.5 }
        : base,
    );
  }

  // ---------- Rendu des étapes ----------

  private render(step: Step): void {
    this.overlay.clearLayers();
    this.labels.clearLayers();
    this.markers.clear();
    this.baseRadius.clear();
    this.activeId = null;
    this.regionLayer.setStyle((f) => this.regionStyle(f!, step));
    this.host().nativeElement.dataset['step'] = String(step);

    switch (step) {
      case 1:
        this.renderRegionLabels();
        break;
      case 2:
        this.renderCities();
        break;
      case 3:
      case 4: {
        const stores = this.data().stores.filter((s) => (step === 3 || s.retained) && this.brands().has(s.brand));
        const cities = this.data().cities.filter((c) => c.selection && stores.some((s) => s.city === c.name));
        this.renderRegionTags([...stores, ...cities]);
        this.renderPlaceLabels(cities);
        this.renderStores(stores, step === 4);
        break;
      }
    }

    if (step !== this.lastStep) {
      this.lastStep = step;
      this.fitStep(step);
    }
  }

  private fitStep(step: Step): void {
    let bounds: L.LatLngBounds;
    const data = this.data();
    if (step === 1) {
      bounds = L.latLngBounds([41.3, -5.2], [51.1, 9.6]);
    } else if (step === 2) {
      bounds = L.latLngBounds(data.cities.map((c) => [c.lat, c.lng] as L.LatLngTuple));
    } else {
      const stores = step === 4 ? data.stores.filter((s) => s.retained) : data.stores;
      bounds = L.latLngBounds(stores.map((s) => [s.lat, s.lng] as L.LatLngTuple));
    }
    this.map.flyToBounds(bounds, { padding: [50, 50], duration: 1.2 });
  }

  private renderRegionLabels(): void {
    this.regionLayer.eachLayer((layer) => {
      const f = (layer as L.GeoJSON).feature as Feature;
      const name = f.properties?.['nom'] as string;
      const info = this.regionInfo(name);
      if (!info) return;
      const center = this.labelService.findRegionLabel(f, []);
      const html = info.drawOrder
        ? `<div class="region-badge" style="--c:${REGION_COLORS[name]}"><b>${info.drawOrder}</b><span>${esc(name)}</span></div>`
        : `<div class="region-name">${esc(name)}</div>`;
      L.marker(center, {
        icon: L.divIcon({ html, className: 'region-label', iconSize: [0, 0] }),
        interactive: false,
        keyboard: false,
      }).addTo(this.labels);
    });
  }

  private renderRegionTags(avoid: { lat: number; lng: number }[]): void {
    this.regionLayer.eachLayer((layer) => {
      const f = (layer as L.GeoJSON).feature as Feature;
      const name = f.properties?.['nom'] as string;
      if (!this.regionInfo(name)?.drawOrder) return;
      L.marker(this.labelService.findRegionLabel(f, avoid), {
        icon: L.divIcon({
          html: `<div class="region-tag" style="--c:${REGION_COLORS[name]}">${esc(name)}</div>`,
          className: 'region-label',
          iconSize: [0, 0],
        }),
        interactive: false,
        keyboard: false,
        zIndexOffset: -1000,
      }).addTo(this.labels);
    });
  }

  private renderCities(): void {
    const cities = [...this.data().cities].sort((a, b) => Number(!!a.selection) - Number(!!b.selection));
    const totals = new Map<string, number>();
    for (const c of cities) totals.set(c.region, (totals.get(c.region) ?? 0) + 1);

    for (const city of cities) {
      const color = REGION_COLORS[city.region];
      const size = city.status === 'prefecture-region' ? 2 : city.status === 'prefecture' ? 1 : 0;
      let marker: L.CircleMarker;
      if (city.selection === 'tirage') {
        marker = L.circleMarker([city.lat, city.lng], {
          radius: 8 + size * 1.5,
          fillColor: color,
          fillOpacity: 1,
          color: '#fff',
          weight: 3,
          className: 'city-dot city-dot--drawn',
        });
        marker.bindTooltip(
          `<span class="city-rank" style="--c:${color}">${city.drawOrder}</span>${esc(city.name)}`,
          { permanent: true, direction: 'right', offset: [10, 0], className: 'city-label', interactive: true },
        );
      } else if (city.selection === 'supplementaire') {
        marker = L.circleMarker([city.lat, city.lng], {
          radius: 8 + size * 1.5,
          fillColor: '#fff',
          fillOpacity: 1,
          color,
          weight: 3.5,
          dashArray: '3 3',
          className: 'city-dot',
        });
        marker.bindTooltip(
          `<span class="city-rank city-rank--extra" style="--c:${color}">+</span>${esc(city.name)}`,
          { permanent: true, direction: 'right', offset: [10, 0], className: 'city-label city-label--extra', interactive: true },
        );
      } else {
        marker = L.circleMarker([city.lat, city.lng], {
          radius: 3.5 + size * 1.5,
          fillColor: '#fff',
          fillOpacity: 1,
          color: '#64748b',
          weight: 1.5,
          className: 'city-dot',
        });
      }
      marker.bindPopup(this.popupService.city(city, totals.get(city.region)!), { className: 'map-popup', closeButton: true });
      marker.on('mouseover', () => this.hovered.emit(city.id));
      marker.on('mouseout', () => this.hovered.emit(null));
      marker.addTo(this.overlay);
      this.markers.set(city.id, marker);
      this.baseRadius.set(city.id, marker.getRadius());
    }
  }

  /** Nom des seules villes concernées, sous les épingles. */
  private renderPlaceLabels(cities: City[]): void {
    for (const city of cities) {
      L.marker([city.lat, city.lng], {
        icon: L.divIcon({
          html: `<div class="place-dot"></div><div class="place-name">${esc(city.name)}</div>`,
          className: 'place-label',
          iconSize: [0, 0],
        }),
        interactive: false,
        keyboard: false,
        zIndexOffset: -800,
      }).addTo(this.labels);
    }
  }

  private renderStores(stores: Store[], final: boolean): void {
    const visible = this.brands();
    const data = this.data();
    for (const store of stores) {
      if (!visible.has(store.brand)) continue;
      const brand = BRAND_BY_NAME[store.brand];
      const star = !final && store.drawn ? '<i class="pin-star">★</i>' : '';
      const label = final
        ? `<div class="pin-label"><b>${esc(store.brand)}</b> · ${esc(store.city)}</div>`
        : '';
      const icon = L.divIcon({
        className: 'pin-wrap',
        html: `<div class="pin ${final ? 'pin--lg' : ''} ${store.drawn && !final ? 'pin--drawn' : ''}" style="--c:${brand.color}"><span>${brand.letter}</span></div>${star}${label}`,
        iconSize: final ? [38, 38] : [28, 28],
        iconAnchor: final ? [19, 38] : [14, 28],
        popupAnchor: [0, final ? -36 : -26],
        tooltipAnchor: [final ? 16 : 12, final ? -22 : -16],
      });
      const marker = L.marker([store.lat, store.lng], {
        icon,
        riseOnHover: true,
        zIndexOffset: store.drawn || final ? 500 : 0,
        title: `${store.brand} – ${store.address}, ${store.city}`,
      });
      marker.bindTooltip(
        `<div class="tip-title">${esc(store.type)}</div><div>${esc(store.address)}, ${esc(store.city)}</div>`,
        { className: 'map-tip', direction: 'right' },
      );
      marker.bindPopup(this.popupService.store(store, final, data), { className: 'map-popup', maxWidth: 300 });
      marker.on('mouseover', () => this.hovered.emit(store.id));
      marker.on('mouseout', () => this.hovered.emit(null));
      marker.addTo(this.overlay);
      this.markers.set(store.id, marker);
    }
  }

  private setActive(id: string | null, on: boolean): void {
    if (!id) return;
    if (id.startsWith('region:')) {
      this.emphasizeRegion(id.slice(7), on);
      return;
    }
    const marker = this.markers.get(id);
    if (!marker) return;
    if (marker instanceof L.CircleMarker) {
      const r = this.baseRadius.get(id) ?? 6;
      marker.setRadius(on ? r * 1.6 : r);
      if (on) marker.bringToFront();
    } else {
      marker.getElement()?.classList.toggle('is-active', on);
      marker.setZIndexOffset(on ? 2000 : 500);
    }
  }
}
