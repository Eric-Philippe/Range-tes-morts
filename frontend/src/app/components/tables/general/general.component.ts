import { Component, Input } from "@angular/core";
import { Lot } from "../../../models/Lot";
import { GraveSelectionService } from "../../../services/GraveSelection.service";
import { GraveUtils } from "../../../utils/GraveUtils";
import { Grave } from "../../../models/Grave";
import { ImportsModule } from "../../../imports";

@Component({
    standalone: true, 
    imports: [ImportsModule],
    selector: "table-general",
    templateUrl: "./general.component.html",
})
export class TableGeneral {
    constructor(private graveSelectedService: GraveSelectionService) {
        this.graveSelectedService.selectedItem$.subscribe(grave => {
            if (grave) {
                alert(GraveUtils.toString(grave as Grave) + " NOT FROM GENERAL TABLE");
            }
        })
    }

    @Input() lots: Lot[] = [];

    getParcelleCount(lot: Lot): string {
        let count = lot.graves ? lot.graves.length : 0;
        return "" + count;
    }
}