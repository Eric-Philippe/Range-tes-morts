import { Component } from "@angular/core";
import { ImportsModule } from "../../imports";
import { LotsService } from "../../services/Lots.service";

@Component({
    standalone: true,
    imports: [ImportsModule],
    templateUrl: "./Login.component.html",
    providers: [LotsService]
})
export class LoginComponent {

}