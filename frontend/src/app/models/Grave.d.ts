import { Dead } from "./Dead";

export type Grave = {
    id: string;
    identifier: string;
    state: number;
    deads: Dead[] | null;
}