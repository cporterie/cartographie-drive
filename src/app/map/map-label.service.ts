import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import type { Feature, MultiPolygon, Polygon } from 'geojson';

@Injectable({ providedIn: 'root' })
export class MapLabelService {
  findRegionLabel(feature: Feature, avoid: { lat: number; lng: number }[]): L.LatLng {
    const longitudeScale = 0.69;
    const geometry = feature.geometry as Polygon | MultiPolygon;
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
    const simplifyRing = (ring: number[][]) =>
      ring.filter((_, index) => index % Math.ceil(ring.length / 300) === 0);
    const rings = polygons.flat().map((ring) =>
      simplifyRing(ring).map(([longitude, latitude]) => [longitude * longitudeScale, latitude]),
    );
    const obstacles = avoid.map((point) => [point.lng * longitudeScale, point.lat]);

    const extent = (ring: number[][]) => {
      const longitudes = ring.map((point) => point[0]);
      const latitudes = ring.map((point) => point[1]);
      return [Math.min(...longitudes), Math.min(...latitudes), Math.max(...longitudes), Math.max(...latitudes)];
    };
    const [minX, minY, maxX, maxY] = polygons
      .map((polygon) => extent(polygon[0].map(([longitude, latitude]) => [longitude * longitudeScale, latitude])))
      .sort((a, b) => (b[2] - b[0]) * (b[3] - b[1]) - (a[2] - a[0]) * (a[3] - a[1]))[0];

    const containsPoint = (x: number, y: number) => {
      let isInside = false;
      for (const ring of rings) {
        for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current++) {
          const [currentX, currentY] = ring[current];
          const [previousX, previousY] = ring[previous];
          if (
            currentY > y !== previousY > y &&
            x < ((previousX - currentX) * (y - currentY)) / (previousY - currentY) + currentX
          ) {
            isInside = !isInside;
          }
        }
      }
      return isInside;
    };

    const distanceToBorder = (x: number, y: number) => {
      let nearest = Infinity;
      for (const ring of rings) {
        for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current++) {
          const [startX, startY] = ring[previous];
          const [endX, endY] = ring[current];
          const deltaX = endX - startX;
          const deltaY = endY - startY;
          const lengthSquared = deltaX * deltaX + deltaY * deltaY;
          const ratio = Math.max(
            0,
            Math.min(1, ((x - startX) * deltaX + (y - startY) * deltaY) / (lengthSquared || 1)),
          );
          nearest = Math.min(nearest, Math.hypot(x - startX - ratio * deltaX, y - startY - ratio * deltaY));
        }
      }
      return nearest;
    };

    const gridSize = 28;
    let bestPoint: [number, number] = [(minX + maxX) / 2, (minY + maxY) / 2];
    let bestScore = -Infinity;
    for (let xIndex = 1; xIndex < gridSize; xIndex++) {
      for (let yIndex = 1; yIndex < gridSize; yIndex++) {
        const x = minX + ((maxX - minX) * xIndex) / gridSize;
        const y = minY + ((maxY - minY) * yIndex) / gridSize;
        if (!containsPoint(x, y)) continue;

        const obstacleDistance = obstacles.reduce(
          (minimum, [obstacleX, obstacleY]) => Math.min(minimum, Math.hypot((x - obstacleX) * 0.5, y - obstacleY)),
          Infinity,
        );
        const borderDistance = distanceToBorder(x, y);
        const score = Math.min(borderDistance * 1.4, obstacleDistance) + borderDistance * 0.15;
        if (score > bestScore) {
          bestScore = score;
          bestPoint = [x, y];
        }
      }
    }

    return L.latLng(bestPoint[1], bestPoint[0] / longitudeScale);
  }
}
