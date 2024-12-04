import { Component, Input } from '@angular/core';
import { Lot } from '../../../models/Lot';
import { ImportsModule } from '../../../imports';
import { GraveTypesMeta, GraveUtils } from '../../../utils/GraveUtils';

@Component({
  standalone: true,
  selector: 'stats-card',
  templateUrl: './stats.component.html',
  imports: [ImportsModule],
})
export class StatsCard {
  @Input() lots: Lot[] = [];
  public GraveTypesLabelsColors = GraveTypesMeta;

  getGraveCount(): number {
    return this.lots.map((lot) => lot.graves.length).reduce((a, b) => a + b, 0);
  }

  getDeadsCount(): number {
    return this.lots
      .map((lot) =>
        lot.graves
          .map((grave) => (grave.deads ? grave.deads.length : 0))
          .reduce((a, b) => a + b, 0),
      )
      .reduce((a, b) => a + b, 0);
  }

  // Return the count of graves that has a state of 0
  getGraveCountByType(state: number): number {
    return GraveUtils.getGraveTypeCount(this.lots, state);
  }

  getExpiredGravesCount(): number {
    return this.lots
      .map((lot) =>
        lot.graves
          .map((grave) =>
            grave.deads
              ? grave.deads.filter((dead) => GraveUtils.isDeadExpired(dead, grave)).length
              : 0,
          )
          .reduce((a, b) => a + b, 0),
      )
      .reduce((a, b) => a + b, 0);
  }
}
