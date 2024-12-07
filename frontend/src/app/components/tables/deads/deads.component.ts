import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Lot } from '../../../models/Lot';
import { GraveSelectionService } from '../../../services/GraveSelection.service';
import { GraveTypesMeta, GraveUtils } from '../../../utils/GraveUtils';
import { ImportsModule } from '../../../imports';
import { Dead } from '../../../models/Dead';
import { MONTHS } from '../../../utils/Utils';

type DeadT = Dead & {
  state: string;
  lot: string;
  grave: string;
  entrydate: Date | string;
  expired: boolean;
};

@Component({
  standalone: true,
  imports: [ImportsModule],
  selector: 'table-deads',
  templateUrl: './deads.component.html',
})
export class TableDeads implements OnChanges {
  constructor(private graveSelectedService: GraveSelectionService) {
    this.graveSelectedService.selectedItem$.subscribe((grave) => {
      if (!grave) {
        this.selectedDead = null;
      }
    });
  }

  GraveTypesArray: { label: string; value: string; index: number }[] = GraveTypesMeta.map(
    (type) => ({
      label: type.label,
      value: type.label,
      index: type.code,
    }),
  );

  @Input() lots: Lot[] = [];
  deads: DeadT[] = [];
  selectedDead: Dead | null = null;
  filteredDeads: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['lots'] &&
      changes['lots'].currentValue &&
      changes['lots'].currentValue.length > 0
    ) {
      this.deads = [];
      for (let lot of this.lots) {
        if (!lot.graves) continue;
        for (let grave of lot.graves) {
          if (grave.deads) {
            for (let dead of grave.deads) {
              this.deads.push({
                ...dead,
                state: GraveUtils.getGraveType(grave.state),
                lot: this.getLotName(lot.name),
                grave: grave.identifier,
                // @ts-ignore
                entrydate: dead.entrydate ? new Date(dead.entrydate) : 'Non renseignée',
                expired: GraveUtils.isDeadExpired(dead, grave),
              });
            }
          }
        }
      }
    }
  }

  onRowSelect(event: any) {
    let graveId = event.data.grave_id;
    let grave = this.lots.flatMap((lot) => lot.graves ?? []).find((grave) => grave.id == graveId);
    this.graveSelectedService.selectItem(grave, true, false);
  }

  entryDateToReadable(entryDate: string): string {
    let date = new Date(entryDate);
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${MONTHS[month - 1]} ${year}`;
  }

  getLotName(str: string): string {
    if (str === 'PERPETUAL') return 'Perpétuel';
    return str;
  }

  getGraveState(deadId: number): string {
    let grave = this.getGraveFromDead(deadId);
    if (grave) return GraveUtils.getGraveType(grave.state);

    return 'Inconnu';
  }

  getGraveTypeColor(deadId: number): string {
    let grave = this.getGraveFromDead(deadId);
    if (grave) return GraveUtils.getContrastedColor(grave.state);

    return 'black';
  }

  getGraveTypeSeverity(value: number): any {
    return GraveUtils.getContrastedColor(value);
  }

  private getGraveFromDead(deadId: number): any {
    return this.lots
      .flatMap((lot) => lot.graves ?? [])
      .find((grave) => grave.deads?.some((dead) => dead.id == deadId));
  }
}
