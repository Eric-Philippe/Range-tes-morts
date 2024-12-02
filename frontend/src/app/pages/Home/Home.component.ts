import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../imports';
import { LotsService } from '../../services/Lots.service';
import { Lot } from '../../models/Lot';
import { HeaderComponent } from '../../components/header/header.component';
import { MapComponent } from '../../components/map/map.component';
import { TableGeneral } from '../../components/tables/general/general.component';
import { TableDeads } from '../../components/tables/deads/deads.component';
import { GraveSelectionService } from '../../services/GraveSelection.service';
import { GraveCard } from '../../components/tables/grave/grave.component';

@Component({
  standalone: true,
  imports: [
    ImportsModule,
    HeaderComponent,
    MapComponent,
    TableGeneral,
    TableDeads,
    GraveCard,
  ],
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css'],
  providers: [LotsService],
})
export class HomeComponent implements OnInit {
  lots: Lot[] = [];
  activeIndex: number = 0;
  graveSelected: boolean = false;

  constructor(
    private lotsService: LotsService,
    private graveSelectedService: GraveSelectionService,
  ) {
    this.graveSelectedService.selectedItem$.subscribe((grave) => {
      if (grave) {
        this.activeIndex = 2;
        this.graveSelected = true;
      } else {
        this.activeIndex = 0;
        this.graveSelected = false;
      }
    });
  }

  ngOnInit(): void {
    this.lotsService.getAll().then((lots) => {
      for (let lot of lots) {
        if (!lot.graves) continue;
        for (let grave of lot.graves) {
          if (grave.deads) {
            for (let dead of grave.deads) {
              dead.entrydate = new Date(dead.entrydate as unknown as string);
            }
          }
        }
      }

      this.lots = lots;
    });
  }
}
