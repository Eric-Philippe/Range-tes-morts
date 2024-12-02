import { Grave } from './Grave';

export interface Lot {
  id: number;
  name: string;
  graves: Grave[] | null;
}
