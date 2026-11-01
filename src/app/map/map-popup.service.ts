import { Injectable } from '@angular/core';
import { BRAND_BY_NAME, CITY_STATUS_LABELS, REGION_COLORS } from '../models/constants';
import type { City, Dataset, Store } from '../models/entities';
import { escapeHtml } from './map-html.util';

@Injectable({ providedIn: 'root' })
export class MapPopupService {
  city(city: City, total: number): string {
    const color = this.regionColor(city.region);
    const status =
      city.selection === 'tirage'
        ? `<span class="tag" style="--c:${color}">Ville tirée</span>`
        : city.selection === 'supplementaire'
          ? `<span class="tag tag--outline" style="--c:${color}">Tirage supplémentaire</span>`
          : '<span class="tag tag--muted">Non retenue</span>';

    return `
      <div class="popup-head" style="--c:${color}">
        <div class="popup-kicker">${escapeHtml(city.region)}</div>
        <div class="popup-title">${escapeHtml(city.name)}</div>
      </div>
      <div class="popup-body">
        ${status}
        <dl>
          <dt>Statut</dt><dd>${CITY_STATUS_LABELS[city.status]}</dd>
          <dt>Département</dt><dd>${escapeHtml(city.department)}</dd>
          <dt>Rang au tirage</dt><dd><b>${city.drawOrder}</b> / ${total}</dd>
        </dl>
      </div>`;
  }

  store(store: Store, isFinalStep: boolean, dataset: Dataset): string {
    const brand = BRAND_BY_NAME[store.brand];
    const tags: string[] = [];
    if (store.drawn) tags.push('<span class="tag tag--gold">★ Tiré au sort</span>');
    if (store.retained) tags.push(`<span class="tag" style="--c:${brand.color}">✔ Retenu</span>`);

    const drawnStore = isFinalStep && !store.drawn
      ? dataset.stores.find((item) => item.region === store.region && item.brand === store.brand && item.drawn)
      : undefined;
    const replacement = drawnStore
      ? `<p class="popup-note">Remplace le magasin tiré au sort : <b>${escapeHtml(drawnStore.address)}</b> (${escapeHtml(drawnStore.city)})</p>`
      : '';
    const approximate = store.approx
      ? '<p class="popup-note popup-note--warn">Position approximative (adresse non géolocalisée précisément)</p>'
      : '';
    const query = encodeURIComponent(`${store.type} ${store.address} ${store.city}`);

    return `
      <div class="popup-head" style="--c:${brand.color}">
        <div class="popup-kicker">${escapeHtml(store.region)}</div>
        <div class="popup-title">${escapeHtml(store.type)}</div>
      </div>
      <div class="popup-body">
        <div class="popup-tags">${tags.join('')}</div>
        <dl>
          <dt>Enseigne</dt><dd>${escapeHtml(store.brand)}</dd>
          <dt>Adresse</dt><dd>${escapeHtml(store.address)}</dd>
          <dt>Ville</dt><dd>${escapeHtml(store.city)}</dd>
        </dl>
        ${replacement}${approximate}
        <a class="popup-link" href="https://www.google.com/maps/search/?api=1&query=${query}" target="_blank" rel="noopener noreferrer">Ouvrir dans Google Maps ↗</a>
      </div>`;
  }

  private regionColor(regionName: string): string {
    return REGION_COLORS[regionName] ?? '#64748b';
  }
}
