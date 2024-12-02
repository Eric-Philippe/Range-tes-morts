import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Grave } from '../models/Grave';
import { Dead } from '../models/Dead';

@Injectable({
  providedIn: 'root',
})
export class GraveSelectionService {
  private selectedItemSource = new BehaviorSubject<Grave | null>(null);
  private selectedFromMap = false;
  selectedItem$ = this.selectedItemSource.asObservable();

  selectItem(item: any, fromMap = false): void {
    this.selectedFromMap = fromMap;
    this.selectedItemSource.next(item);
  }

  getSelectedItem(): Grave | Dead | null {
    return this.selectedItemSource.getValue();
  }

  isSelectedFromMap(): boolean {
    return this.selectedFromMap;
  }
}
