import { Component, Input } from '@angular/core';
import { Lot } from '../../../models/Lot';
import { GraveSelectionService } from '../../../services/GraveSelection.service';
import { GraveUtils } from '../../../utils/GraveUtils';
import { Grave } from '../../../models/Grave';
import { ImportsModule } from '../../../imports';

@Component({
  standalone: true,
  imports: [ImportsModule],
  selector: 'table-general',
  templateUrl: './general.component.html',
})
export class TableGeneral {
  constructor(private graveSelectedService: GraveSelectionService) {
    this.graveSelectedService.selectedItem$.subscribe((grave) => {
      if (grave) {
        this.selectedGrave = grave;
        this.expandedRows = this.lots.reduce((acc, lot) => {
          // @ts-ignore
          acc[lot.id] = lot.graves.some((g) => g.id === grave.id);
          return acc;
        }, {});
      } else {
        this.selectedGrave = null;
        this.expandedRows = {};
      }
    });
  }

  @Input() lots: Lot[] = [];
  expandedRows = {};
  selectedGrave: Grave | null = null;

  getParcelleCount(lot: Lot): string {
    let count = lot.graves ? lot.graves.length : 0;
    return '' + count;
  }

  getGraveType(grave: Grave): string {
    return GraveUtils.getGraveType(grave.state);
  }

  getColor(grave: Grave): string {
    return GraveUtils.getColor(grave.state);
  }

  getDeadCount(grave: Grave): string {
    let count = grave.deads ? grave.deads.length : 0;
    return '' + count;
  }

  getLotName(lot: Lot): string {
    if (lot && lot.name === 'PERPETUAL') return 'Perpétuel';
    return lot ? lot.name : '';
  }

  onRowSelect(event: any) {
    this.graveSelectedService.selectItem(event.data, true, false);
  }
}
