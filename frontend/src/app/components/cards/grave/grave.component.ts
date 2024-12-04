import { Component, Input, ViewChild } from '@angular/core';
import { Lot } from '../../../models/Lot';
import { GraveSelectionService } from '../../../services/GraveSelection.service';
import { GraveTypeMetadataT, GraveTypesMeta, GraveUtils } from '../../../utils/GraveUtils';
import { Grave } from '../../../models/Grave';
import { ImportsModule } from '../../../imports';
import { Dead } from '../../../models/Dead';
import { Message } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { GravesService } from '../../../services/Graves.service';

type DeadT = Dead & {
  new: boolean;
};

@Component({
  standalone: true,
  imports: [ImportsModule],
  selector: 'grave-card',
  templateUrl: './grave.component.html',
  styleUrls: ['./grave.component.css'],
  providers: [GravesService],
})
export class GraveCard {
  @Input() lots: Lot[] = [];
  @ViewChild('op') overlayPanel: OverlayPanel | null = null;

  graveTypes = GraveTypesMeta;

  grave: Grave | null = null;
  uneditedGrave: Grave | null = null;
  selectedGraveType = this.graveTypes[0];
  originalGraveType = this.graveTypes[0];
  deletedDeads: DeadT[] = [];

  isModified: boolean = false;
  messages: Message[] = [];
  outputMessages: Message[] = [];

  constructor(
    private graveSelectedService: GraveSelectionService,
    private gravesService: GravesService,
  ) {
    this.graveSelectedService.selectedItem$.subscribe((grave) => this.reload(grave));
  }

  onModelChange() {
    const pastState = this.isModified;
    this.isModified = this._isModified();

    if (this.overlayPanel) this.overlayPanel.hide();

    if (this.isModified && this.isModified !== pastState) {
      this.messages = [
        {
          severity: 'warn',
          summary: 'Modifications non sauvegardées',
          detail: 'Veuillez sauvegarder les modifications avant de quitter',
        },
      ];
    }
  }

  onRemoveDead(index: number, deadId: number) {
    if (!this.grave?.deads) return;

    const dead: Dead | DeadT = this.grave.deads[index];

    if ((dead as DeadT).new != null) {
      this.grave.deads.splice(index, 1);
    } else {
      const deadIndex = this.deletedDeads.findIndex((dead) => dead.id === deadId);
      if (deadIndex !== -1) {
        this.deletedDeads.splice(deadIndex, 1);
      } else {
        this.deletedDeads.push(dead as DeadT);
      }
    }

    if (this.grave.deads.length === this.deletedDeads.length) {
      this.selectedGraveType = this.graveTypes[0];
    } else if (this.uneditedGrave?.state === 0) {
      this.selectedGraveType = this.graveTypes[1];
    } else {
      this.selectedGraveType = this.getGraveStatutCode();
    }

    this.onModelChange();
  }

  onAddDead() {
    if (this.grave && !this.grave.deads) this.grave.deads = [];

    this.grave?.deads?.push({
      id: this.grave.deads.length,
      firstname: '',
      lastname: '',
      entrydate: new Date(),
      new: true,
    } as Dead);

    if (this.uneditedGrave?.state === 0) {
      this.selectedGraveType = this.graveTypes[1];
    }

    this.onModelChange();
  }

  async onSubmit() {
    const newGrave = JSON.parse(JSON.stringify(this.grave)) as Grave;

    newGrave.state = this.selectedGraveType.code;

    if (this.deletedDeads.length > 0) {
      await this.gravesService.deleteDeads(this.deletedDeads);
      // @ts-ignore
      newGrave.deads = newGrave.deads?.filter((dead) => !this.isOnDeletedDead(dead.id));
    }

    // Get all the deads that are not new but have been modified
    const modifiedDeads = newGrave.deads?.filter((dead) => !(dead as DeadT).new);
    if (modifiedDeads) await this.gravesService.editDeads(modifiedDeads);

    await this.gravesService.updateGrave(newGrave);

    this.graveSelectedService.selectItem(newGrave, true, true);

    this.outputMessages = [
      {
        severity: 'success',
        summary: 'Sauvegarde réussie',
        detail: 'Les modifications ont été enregistrées',
      },
    ];
  }

  isOnDeletedDead(deadId: number): boolean {
    return this.deletedDeads.findIndex((dead) => dead.id === deadId) !== -1;
  }

  getGraveLotName(): string {
    return this.grave
      ? (this.lots.find((lot) => lot.name === this.grave?.id.split('#')[0])?.name || '').replace(
          'PERPETUAL',
          'Perpétuel',
        )
      : '';
  }

  getGraveStatutCode(): any {
    if (!this.grave) return this.graveTypes[0];
    return this.graveTypes.find((type) => type.code === this.grave?.state) || this.graveTypes[0];
  }

  getGraveStatut(): string {
    if (!this.grave) return '';

    return GraveUtils.getGraveType(this.selectedGraveType.code);
  }

  getGraveTagSeverity() {
    if (!this.grave) return 'secondary';
    return GraveUtils.getContrastedColor(this.selectedGraveType.code);
  }

  getDeadExpired(dead: Dead): boolean {
    if (!this.grave) return false;
    return GraveUtils.isDeadExpired(dead, this.grave);
  }

  private reload(grave: Grave | null) {
    if (grave) {
      this.grave = grave;
      this.selectedGraveType = this.getGraveStatutCode();
      this.uneditedGrave = JSON.parse(JSON.stringify(grave)); // Deep copy
      this.originalGraveType = this.getGraveStatutCode();
      this.selectedGraveType = this.originalGraveType;
      this.deletedDeads = [];
      this.isModified = false;
    }
  }

  private _isModified() {
    if (this.deletedDeads.length > 0) return true;

    return (
      !GraveUtils.compare(this.grave, this.uneditedGrave) ||
      this.originalGraveType.code !== this.selectedGraveType.code
    );
  }
}
