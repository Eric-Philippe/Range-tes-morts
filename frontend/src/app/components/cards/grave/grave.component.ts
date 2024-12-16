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
import { DeadsService } from '../../../services/Deads.service';

@Component({
  standalone: true,
  imports: [ImportsModule],
  selector: 'grave-card',
  templateUrl: './grave.component.html',
  styleUrls: ['./grave.component.css'],
  providers: [GravesService, DeadsService],
})
export class GraveCard {
  @Input() lots: Lot[] = [];
  @ViewChild('op') overlayPanel: OverlayPanel | null = null;

  graveTypes = GraveTypesMeta;

  grave: Grave | null = null;
  selectedGraveType = this.graveTypes[0];
  manuallyChangedGraveType = false;

  currentDeads: Dead[] = [];
  createdDeads: Dead[] = [];
  deletedDeads: Dead[] = [];
  updatedDeads: Dead[] = [];

  isModified: boolean = false;
  messages: Message[] = [];

  constructor(
    private graveSelectedService: GraveSelectionService,
    private gravesService: GravesService,
    private deadsService: DeadsService,
  ) {
    this.graveSelectedService.selectedItem$.subscribe((grave) => this.reload(grave));
  }

  onModelChange() {
    this.updateUpdatedDead();

    const graveDeadsCount = this.grave?.deads?.length || 0;

    // If the grave has no more deads, we reset the state to the default one
    if (this.deletedDeads.length == graveDeadsCount && this.createdDeads.length == 0) {
      this.selectedGraveType = this.graveTypes[0];
    }

    // If the grave was empty and this.createdDeads is not empty, we set the state to the first one
    if (
      this.createdDeads.length > 0 &&
      this.grave?.state == 0 &&
      this.selectedGraveType &&
      !this.manuallyChangedGraveType
    ) {
      this.selectedGraveType = this.graveTypes[2];
      this.manuallyChangedGraveType = false;
    }

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

  onAddDead() {
    this.createdDeads.push({
      id: 0,
      firstname: '',
      lastname: '',
      entrydate: new Date(),
      grave_id: this.grave?.id || '',
    });

    this.onModelChange();
  }

  onRemoveDead(index: number) {
    const dead = this.currentDeads[index];
    if (dead.id) {
      this.deletedDeads.push(dead);
    } else {
      this.createdDeads.splice(index, 1);
    }

    this.onModelChange();
  }

  onRollbackRemoveDead(deadId: number) {
    const dead = this.deletedDeads.find((dead) => dead.id === deadId);
    if (!dead) return;

    this.deletedDeads = this.deletedDeads.filter((dead) => dead.id !== deadId);

    this.onModelChange();
  }

  onRemoveNewlyDead(index: number) {
    this.createdDeads.splice(index, 1);

    this.onModelChange();
  }

  onEditGraveState() {
    this.manuallyChangedGraveType = true;

    this.onModelChange();
  }

  async onSubmit() {
    if (!this.grave) return;

    let updatedGrave: Grave = {
      ...this.grave,
      state: this.selectedGraveType.code,
    };

    try {
      // If the state has been changed, we need to update the grave
      if (this.grave.state !== this.selectedGraveType.code) {
        await this.gravesService.updateGrave(updatedGrave);
      }

      // If there are new deads, we need to create them
      if (this.createdDeads.length > 0) {
        await this.deadsService.createDeads(this.createdDeads);
      }

      // If there are updated deads, we need to update them
      if (this.updatedDeads.length > 0) {
        await this.deadsService.updateDeads(this.updatedDeads);
      }

      // If there are removed deads, we need to delete them
      if (this.deletedDeads.length > 0) {
        await this.deadsService.deleteDeads(this.deletedDeads);
      }

      updatedGrave = await this.gravesService.getGrave(this.grave.id);

      this.reload(updatedGrave);
      this.graveSelectedService.selectItem(updatedGrave, false, true);

      this.messages = [
        {
          severity: 'success',
          summary: 'Modifications sauvegardées',
          detail: 'Les modifications ont été sauvegardées avec succès',
        },
      ];
    } catch (error) {
      console.log(error);

      this.messages = [
        {
          severity: 'error',
          summary: 'Erreur',
          detail: 'Une erreur est survenue lors de la sauvegarde des modifications',
        },
      ];
    }
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

  displayMessage(): boolean {
    if (this.messages.length > 0 && this.messages[0].severity === 'warn' && !this.isModified)
      return false;

    return this.messages.length > 0;
  }

  private updateUpdatedDead() {
    this.updatedDeads = this.currentDeads.filter((dead) => {
      const originalDead = this.grave?.deads?.find((d) => d.id === dead.id);
      if (!originalDead) return false;
      return !GraveUtils.compareDead(dead, originalDead);
    });
  }

  private reload(grave: Grave | null) {
    if (grave) {
      this.grave = grave;
      this.selectedGraveType = this.getGraveStatutCode();

      this.createdDeads = [];
      // Make a deep copy of the deads
      this.currentDeads = JSON.parse(JSON.stringify(grave.deads || []));
      this.updatedDeads = [];
      this.deletedDeads = [];

      this.isModified = false;
      this.manuallyChangedGraveType = false;
    }
  }

  private _isModified() {
    if (this.deletedDeads.length > 0) return true;

    if (this.createdDeads.length > 0) return true;

    if (this.updatedDeads.length > 0) return true;

    if (this.grave && this.grave.state !== this.selectedGraveType.code) return true;

    return false;
  }
}
