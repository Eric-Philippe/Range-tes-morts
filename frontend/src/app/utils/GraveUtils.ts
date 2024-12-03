import { Dead } from '../models/Dead';
import { Grave } from '../models/Grave';

export enum GraveTypeEnum {
  EMPTY = 0,
  RESERVED = 1,
  PERPETUAL = 2,
  FIFTEEN = 3,
  THIRTY = 4,
  FIFTY = 5,
}

export const GraveTypes = [
  { name: 'Vide', code: 0 },
  { name: 'Réservée', code: 1 },
  { name: 'Perpétuité', code: 2 },
  { name: '15 ans', code: 3 },
  { name: '30 ans', code: 4 },
  { name: '50 ans', code: 5 },
];

// Pastel color, Empty is almost white, and then pastel colors
const GraveTypeColors: { [key: number]: string } = {
  0: '#8a8888',
  1: '#ffcc99',
  2: '#ff9999',
  3: '#ffccff',
  4: '#cc99ff',
  5: '#99ccff',
};

// Darker color next to GraveTypeColors
const GraveTypeColorsContrasted: { [key: number]: string } = {
  0: '#ebf0ec',
  1: '#ff9966',
  2: '#ff6666',
  3: '#ff99ff',
  4: '#9966ff',
  5: '#6699ff',
};

export class GraveUtils {
  static toString(grave: Grave): string {
    let state = GraveTypeEnum[grave.state];
    let deadCount = grave.deads ? grave.deads.length : 0;
    return `${grave.id} - ${state} - ${deadCount} dead`;
  }

  static getColor(state: number): string {
    return GraveTypeColors[state];
  }

  static getContrastedColor(state: number): string {
    return GraveTypeColorsContrasted[state];
  }

  static getGraveType(state: number): string {
    return GraveTypes.find((type) => type.code === state)?.name || 'Inconnu';
  }

  static compare(a: Grave | null, b: Grave | null): boolean {
    if (a == null || b == null) return true;

    if (a.id !== b.id || a.state !== b.state) return false;

    if (a.deads == null && b.deads == null) return true;

    const deads = [a.deads || []].concat([b.deads || []]);

    if (deads[0].length !== deads[1].length) return false;

    for (let i = 0; i < deads[0].length; i++) {
      if (!this.compareDead(deads[0][i], deads[1][i])) return false;
    }

    return true;
  }

  private static compareDead(a: Dead, b: Dead): boolean {
    if (a.id !== b.id) return false;

    if (a.firstname !== b.firstname || a.lastname !== b.lastname) return false;

    if (a.entrydate && b.entrydate) {
      const aDate = new Date(a.entrydate);
      const bDate = new Date(b.entrydate);

      if (aDate.getMonth() !== bDate.getMonth()) return false;
      if (aDate.getFullYear() !== bDate.getFullYear()) return false;
    }

    return true;
  }
}
