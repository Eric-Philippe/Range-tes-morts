import { Component, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { MONTHS, MONTHS_SHORT } from './utils/Utils';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.primengConfig.setTranslation({
      monthNames: MONTHS,
      monthNamesShort: MONTHS_SHORT,
      today: "Aujourd'hui",
      clear: 'Effacer',
      addRule: 'Ajouter une règle',
      equals: 'Egale',
      notEquals: 'Différent',
      matchAll: 'Tout correspond',
      matchAny: "N'importe quel correspondance",
      apply: 'Appliquer',
      contains: 'Contient',
      startsWith: 'Commence par',
      endsWith: 'Finit par',
      notContains: 'Ne contient pas',
    });
  }
}
