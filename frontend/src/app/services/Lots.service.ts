import { Injectable } from "@angular/core";

import { API } from "../conf/env";
import { Lot } from "../models/Lot";

@Injectable()
export class LotsService {
    async getAll(): Promise<Lot[]> {
            return await fetch(`${API}/lots`).then((response) => {
            if (response.ok) {
                return response.json();
            }

            return Promise.reject(response);
        });
       
    }
}