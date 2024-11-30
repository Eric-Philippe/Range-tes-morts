import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Lot } from "../../../models/Lot";
import { GraveSelectionService } from "../../../services/GraveSelection.service";
import { GraveUtils } from "../../../utils/GraveUtils";
import { Grave } from "../../../models/Grave";
import { ImportsModule } from "../../../imports";
import { Dead } from "../../../models/Dead";

const MONTHS = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]

@Component({
    standalone: true, 
    imports: [ImportsModule],
    selector: "table-deads",
    templateUrl: "./deads.component.html",
})
export class TableDeads implements OnChanges{
    deads: Dead[] = [];

    constructor(private graveSelectedService: GraveSelectionService) {
        this.graveSelectedService.selectedItem$.subscribe(grave => {
            if (grave) {
                alert(GraveUtils.toString(grave as Grave) + " NOT FROM DEADS TABLE");
            }
        })
    }

    @Input() lots: Lot[] = [];

    ngOnChanges(changes: SimpleChanges) {
        if (changes["lots"] && changes["lots"].currentValue && changes["lots"].currentValue.length > 0) {
            for (let lot of this.lots) {
                if (!lot.graves) continue;
                for (let grave of lot.graves) {
                    if (grave.deads) {
                        for (let dead of grave.deads) {
                            this.deads.push(dead);
                        }
                    }
                }
            }
        }
    }

    entryDateToReadable(entryDate: string): string {
        const [year, month] = entryDate.split("-");
        return `${MONTHS[parseInt(month) - 1]} ${year}`;
    }

    getLotName(deadId: number): string {
        let lot = this.lots.find(lot => lot.graves?.some(grave => grave.deads?.some(dead => dead.id == deadId)));

        if (lot && lot.name === "PERPETUAL") return "Perpétuelles";
        return lot ? lot.name : "";
    }

    getTombeIdentifier(deadId: number): string {
        let grave = this.lots.flatMap(lot => lot.graves ?? []).find(grave => grave.deads?.some(dead => dead.id == deadId));
        return grave ? grave.identifier : "";
    }

    getGraveState(deadId: number): string {
        let grave = this.lots.flatMap(lot => lot.graves ?? []).find(grave => grave.deads?.some(dead => dead.id == deadId));
        if (grave) return GraveUtils.getGraveType(grave);

        return "Inconnu";
    }
}