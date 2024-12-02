import { Component, Input, OnInit } from '@angular/core';
import { Lot } from '../../../models/Lot';
import { GraveSelectionService } from '../../../services/GraveSelection.service';
import { GraveUtils } from '../../../utils/GraveUtils';
import { Grave } from '../../../models/Grave';
import { ImportsModule } from '../../../imports';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [ImportsModule],
  selector: 'grave-card',
  templateUrl: './grave.component.html',
  styleUrls: ['./grave.component.css'],
})
export class GraveCard {
  @Input() lots: Lot[] = [];
  grave: Grave | null = null;
  uneditedGrave: Grave | null = null;
  isModified = false;

  constructor(
    private graveSelectedService: GraveSelectionService,
    private http: HttpClient,
  ) {
    this.graveSelectedService.selectedItem$.subscribe((grave) => {
      if (grave) {
        this.grave = grave;
        this.uneditedGrave = JSON.parse(JSON.stringify(grave)); // Deep copy
      }
    });
  }

  onModelChange() {
    if (!this.grave?.deads || !this.uneditedGrave?.deads) return;

    const formatDate = (date: any) => {
      const d = new Date(date);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    };

    this.isModified = this.grave.deads.some((dead, index) => {
      const originalDead = this.uneditedGrave!.deads![index];
      return (
        dead.firstname !== originalDead.firstname ||
        dead.lastname !== originalDead.lastname ||
        formatDate(dead.entrydate).getTime() !==
          formatDate(originalDead.entrydate).getTime()
      );
    });
  }

  onSubmit() {
    if (this.grave) {
      this.http.post('/api/update-grave', this.grave).subscribe((response) => {
        console.log('Grave updated:', response);
        this.uneditedGrave = JSON.parse(JSON.stringify(this.grave)); // Update uneditedGrave to the new state
        this.isModified = false;
      });
    }
  }

  getGraveLotName(): string {
    let name = '';

    if (this.grave) {
      let parentLot = this.grave.id.split('#')[0];

      name = this.lots.find((lot) => lot.name === parentLot)?.name || '';
      if (name === 'PERPETUAL') name = 'Perpétuel';
    }

    return name;
  }

  getGraveStatut(): string {
    if (!this.grave) return '';
    return GraveUtils.getGraveType(this.grave);
  }

  getGraveTagSeverity() {
    if (!this.grave) return 'secondary';
    return GraveUtils.getContrastedColor(this.grave);
  }
}
