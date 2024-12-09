import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../imports';
import { LotsService } from '../../services/Lots.service';
import { Lot } from '../../models/Lot';
import { HeaderComponent } from '../../components/header/header.component';
import { MapComponent } from '../../components/map/map.component';
import { TableGeneral } from '../../components/tables/general/general.component';
import { TableDeads } from '../../components/tables/deads/deads.component';
import { GraveSelectionService } from '../../services/GraveSelection.service';
import { GraveCard } from '../../components/cards/grave/grave.component';
import { StatsCard } from '../../components/cards/stats/stats.component';
import { SaveCard } from '../../components/cards/save/save.component';

@Component({
  standalone: true,
  imports: [
    ImportsModule,
    HeaderComponent,
    MapComponent,
    TableGeneral,
    TableDeads,
    StatsCard,
    SaveCard,
    GraveCard,
  ],
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css'],
  providers: [LotsService],
})
export class HomeComponent implements OnInit {
  lotIsEmpty: boolean = false;
  lots: Lot[] = [];
  activeIndex: number = 0;
  graveSelected: boolean = false;

  constructor(
    private lotsService: LotsService,
    private graveSelectedService: GraveSelectionService,
  ) {
    this.graveSelectedService.selectedItem$.subscribe((grave) => {
      if (grave) {
        this.activeIndex = 4;
        this.graveSelected = true;
      } else {
        this.activeIndex = 0;
        this.graveSelected = false;
      }

      if (this.graveSelectedService.needReloadData()) {
        this.loadLots();
        this.graveSelectedService.toggleReloadData();
      }
    });
  }

  ngOnInit(): void {
    this.loadLots();
  }

  loadLots(): void {
    this.lotsService.getAll().then((lots) => {
      lots.forEach((lot) => {
        lot.graves?.forEach((grave) => {
          grave.deads?.forEach((dead) => {
            dead.entrydate = new Date(dead.entrydate as unknown as string);
          });
        });
      });

      this.lots = lots;
      this.lotIsEmpty = this.lots.length === 0;
    });
  }
}
