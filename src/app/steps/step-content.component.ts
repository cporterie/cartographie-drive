import { Component, input, output } from '@angular/core';
import type { PresentationStats, RegionCities, RegionStores } from '../data/presentation-data.service';
import { CITY_STATUS_LABELS, REGION_COLORS } from '../models/constants';
import type { City, Region, Step, Store } from '../models/entities';

@Component({
  selector: 'app-step-content',
  standalone: true,
  templateUrl: './step-content.component.html',
})
export class StepContentComponent {
  readonly step = input.required<Step>();
  readonly stats = input.required<PresentationStats>();
  readonly drawnRegions = input.required<Region[]>();
  readonly otherRegions = input.required<Region[]>();
  readonly citiesByRegion = input.required<RegionCities[]>();
  readonly storesByRegion = input.required<RegionStores[]>();
  readonly hoveredId = input<string | null>(null);
  readonly expandedRegions = input.required<ReadonlySet<string>>();
  readonly visibleBrands = input.required<ReadonlySet<string>>();

  readonly hoverChange = output<string | null>();
  readonly focusRegion = output<string>();
  readonly focusItem = output<City | Store>();
  readonly toggleExpanded = output<string>();

  readonly statusLabels = CITY_STATUS_LABELS;
  readonly regionColors = REGION_COLORS;
}
