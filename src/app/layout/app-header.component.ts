import { Component, input, output } from '@angular/core';
import type { Step } from '../models/entities';
import type { StepDefinition } from '../models/constants';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  readonly currentStep = input.required<Step>();
  readonly steps = input.required<StepDefinition[]>();
  readonly stepChange = output<Step>();
  readonly previous = output<void>();
  readonly next = output<void>();
}
