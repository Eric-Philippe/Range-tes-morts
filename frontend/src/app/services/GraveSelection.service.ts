import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Grave } from '../models/Grave';
import { Dead } from '../models/Dead';

@Injectable({
  providedIn: 'root',
})
export class GraveSelectionService {
  private selectedItemSource = new BehaviorSubject<Grave | null>(null);
  private reloadSvg = false;
  private reloadData = false;
  private needZoom = false;
  selectedItem$ = this.selectedItemSource.asObservable();

  selectItem(item: any, needZoom = false, reloadData = false): void {
    this.needZoom = needZoom;
    this.reloadData = reloadData;
    this.selectedItemSource.next(item);
  }

  getSelectedItem(): Grave | Dead | null {
    return this.selectedItemSource.getValue();
  }

  isZoomIn(): boolean {
    return this.needZoom;
  }

  needReloadData(): boolean {
    return this.reloadData;
  }

  getZoomIn(): boolean {
    return this.needZoom;
  }

  toggleZoom(): void {
    this.needZoom = !this.needZoom;
  }

  toggleReloadData(): void {
    this.reloadData = !this.reloadData;
  }
}
