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

export type GraveTypeMetadataT = {
  label: string;
  color: string;
  contrastedColor: string;
  icon: string;
  code: number;
};

export const GraveTypesMeta: GraveTypeMetadataT[] = [
  {
    label: 'Vide',
    color: '#8a8888',
    contrastedColor: '#ebf0ec',
    icon: 'pi pi-times-circle',
    code: 0,
  },
  {
    label: 'Réservée',
    color: '#ffcc99',
    contrastedColor: '#ff9966',
    icon: 'pi pi-clipboard',
    code: 1,
  },
  {
    label: 'Perpétuité',
    color: '#ff9999',
    contrastedColor: '#ff6666',
    icon: 'pi pi-calendar',
    code: 2,
  },
  {
    label: '15 ans',
    color: '#ffccff',
    contrastedColor: '#ff99ff',
    icon: 'pi pi-angle-right',
    code: 3,
  },
  {
    label: '30 ans',
    color: '#cc99ff',
    contrastedColor: '#9966ff',
    icon: 'pi pi-angle-double-right',
    code: 4,
  },
  { label: '50 ans', color: '#99ccff', contrastedColor: '#6699ff', icon: 'pi pi-forward', code: 5 },
];

export class GraveUtils {
  static toString(grave: Grave): string {
    let state = GraveTypeEnum[grave.state];
    let deadCount = grave.deads ? grave.deads.length : 0;
    return `${grave.id} - ${state} - ${deadCount} dead`;
  }

  static getColor(state: number): string {
    return GraveTypesMeta.find((type) => type.code === state)?.color || '#8a8888';
  }

  static getContrastedColor(state: number): string {
    return GraveTypesMeta.find((type) => type.code === state)?.contrastedColor || '#ebf0ec';
  }

  static getGraveType(state: number): string {
    return GraveTypesMeta.find((type) => type.code === state)?.label || 'Inconnu';
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
