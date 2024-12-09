import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Lot } from '../../../models/Lot';
import { GraveSelectionService } from '../../../services/GraveSelection.service';
import { GraveTypeMetadataT, GraveTypesMeta, GraveUtils } from '../../../utils/GraveUtils';
import { Grave } from '../../../models/Grave';
import { ImportsModule } from '../../../imports';
import { LotSelectionService } from '../../../services/LotSelection.service';

@Component({
  standalone: true,
  imports: [ImportsModule],
  selector: 'table-general',
  templateUrl: './general.component.html',
})
export class TableGeneral implements OnChanges {
  @Input() lots: Lot[] = [];
  filteredLots: Lot[] = [];
  expandedRows = {};
  selectedGrave: Grave | null = null;

  graveTypes: GraveTypeMetadataT[] = GraveTypesMeta;
  selectedType: GraveTypeMetadataT;

  first = 0;

  constructor(
    private graveSelectedService: GraveSelectionService,
    private lotSelectedService: LotSelectionService,
  ) {
    this.graveTypes.push({ code: -1, label: 'Tous' });
    this.selectedType = this.graveTypes[this.graveTypes.length - 1];
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

  ngOnChanges() {
    this.filteredLots = this.lots;

    // Sort the filteredLots by name, but the first one should be the perpetual lot
    this.filteredLots.sort((a, b) => {
      if (a.name === 'PERPETUAL') return -1;
      if (b.name === 'PERPETUAL') return 1;
      return a.name.localeCompare(b.name);
    });
  }

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

  onFilterSelect(event: any) {
    if (this.selectedType.code == -1) this.filteredLots = this.lots;
    else
      this.filteredLots = this.lots.filter((lot) =>
        lot.graves.some((grave) => grave.state === this.selectedType.code),
      );
  }

  onFilterClear() {
    this.selectedType = this.graveTypes[this.graveTypes.length - 1];
    this.filteredLots = this.lots;
    this.first = 0;
  }

  onHover(lot: Lot) {
    this.lotSelectedService.selectItem(lot);
  }

  onLeave(lot: Lot) {
    this.lotSelectedService.selectItem(null);
  }
}
