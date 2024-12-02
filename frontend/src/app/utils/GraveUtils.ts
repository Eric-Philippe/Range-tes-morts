import { Grave } from '../models/Grave';

export enum GraveTypeEnum {
  EMPTY = 0,
  RESERVED = 1,
  PERPETUAL = 2,
  FIFTEEN = 3,
  THIRTY = 4,
  FIFTY = 5,
}

// Pastel color, Empty is almost white, and then pastel colors
const GraveTypeColors: { [key: number]: string } = {
  0: '#e0e0e0',
  1: '#ffcc99',
  2: '#ff9999',
  3: '#ffccff',
  4: '#cc99ff',
  5: '#99ccff',
};

export class GraveUtils {
  static toString(grave: Grave): string {
    let state = GraveTypeEnum[grave.state];
    let deadCount = grave.deads ? grave.deads.length : 0;
    return `${grave.id} - ${state} - ${deadCount} dead`;
  }

  static getColor(grave: Grave): string {
    return GraveTypeColors[grave.state];
  }

  static getGraveType(grave: Grave): string {
    switch (grave.state) {
      case 0:
        return 'Vide';
      case 1:
        return 'Réservée';
      case 2:
        return 'Perpétuelle';
      case 3:
        return '15 ans';
      case 4:
        return '30 ans';
      case 5:
        return '50 ans';
      default:
        return 'Inconnu';
    }
  }
}
