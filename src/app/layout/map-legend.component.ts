import { Component, input, output } from '@angular/core';
import { BRAND_LIST, REGION_COLORS } from '../models/constants';
import type { Region, Step } from '../models/entities';

@Component({
  selector: 'app-map-legend',
  standalone: true,
  templateUrl: './map-legend.component.html',
})
export class MapLegendComponent {
  readonly step = input.required<Step>();
  readonly visibleBrands = input.required<ReadonlySet<string>>();
  readonly drawnRegions = input.required<Region[]>();
  readonly toggleBrand = output<string>();
  readonly showAllBrands = output<void>();

  readonly brands = BRAND_LIST;
  readonly regionColors = REGION_COLORS;
}
