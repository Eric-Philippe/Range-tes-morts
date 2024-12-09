import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lot } from '../models/Lot';

@Injectable({
  providedIn: 'root',
})
export class LotSelectionService {
  private selectedItemSource = new BehaviorSubject<Lot | null>(null);
  selectedItem$ = this.selectedItemSource.asObservable();

  selectItem(item: any): void {
    this.selectedItemSource.next(item);
  }

  getSelectedItem(): Lot | null {
    return this.selectedItemSource.getValue();
  }
}
