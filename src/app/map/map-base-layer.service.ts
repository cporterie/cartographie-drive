import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import type { Feature, MultiPolygon } from 'geojson';

@Injectable({ providedIn: 'root' })
export class MapBaseLayerService {
  initialize(map: L.Map, outline: Feature<MultiPolygon>, resetView: () => void): L.TileLayer {
    const esri = 'https://server.arcgisonline.com/ArcGIS/rest/services';
    const clean = L.tileLayer(`${esri}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
      attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
      maxNativeZoom: 16,
      opacity: 0,
    }).addTo(map);
    const detailed = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> France',
      subdomains: 'abc',
      maxNativeZoom: 19,
    });
    const satellite = L.tileLayer(
      `${esri}/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
      { attribution: 'Tiles &copy; Esri' },
    );

    L.control.zoom({ position: 'topright', zoomInTitle: 'Zoomer', zoomOutTitle: 'Dézoomer' }).addTo(map);
    this.addHomeControl(map, resetView);
    L.control.layers({ Épuré: clean, 'Plan détaillé': detailed, Satellite: satellite }, undefined, {
      position: 'topright',
    }).addTo(map);
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);
    this.addFranceMask(map, outline);
    return clean;
  }

  private addFranceMask(map: L.Map, outline: Feature<MultiPolygon>): void {
    const pane = map.createPane('mask');
    pane.style.zIndex = '350';
    pane.style.pointerEvents = 'none';

    const world: L.LatLngTuple[] = [[85, -179], [85, 179], [-85, 179], [-85, -179]];
    const holes = outline.geometry.coordinates.map((polygon) =>
      polygon[0].map(([longitude, latitude]) => [latitude, longitude] as L.LatLngTuple),
    );
    L.polygon([world, ...holes], {
      pane: 'mask',
      fillColor: '#dde4ed',
      fillOpacity: 1,
      stroke: false,
      interactive: false,
      smoothFactor: 0.5,
    }).addTo(map);
  }

  private addHomeControl(map: L.Map, resetView: () => void): void {
    const Home = L.Control.extend({
      onAdd: () => {
        const button = L.DomUtil.create('a', 'leaflet-bar map-home-btn');
        button.href = '#';
        button.title = 'Recentrer la carte';
        button.setAttribute('role', 'button');
        button.innerHTML =
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h3m12 0h3M12 3v3m0 12v3"/><circle cx="12" cy="12" r="5"/></svg>';
        L.DomEvent.on(button, 'click', (event) => {
          L.DomEvent.preventDefault(event);
          resetView();
        });
        L.DomEvent.disableClickPropagation(button);
        return button;
      },
    });
    new Home({ position: 'topright' }).addTo(map);
  }
}
