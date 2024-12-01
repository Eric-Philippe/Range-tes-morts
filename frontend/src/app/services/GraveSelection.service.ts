import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Grave } from '../models/Grave';
import { Dead } from '../models/Dead';

@Injectable({
  providedIn: 'root'
})
export class GraveSelectionService {
  private selectedItemSource = new BehaviorSubject<Grave | Dead | null>(null);
  selectedItem$ = this.selectedItemSource.asObservable();

  selectItem(item: any) {
    this.selectedItemSource.next(item);
  }

  getSelectedItem(): Grave | Dead | null {
    return this.selectedItemSource.getValue();
  }
}
