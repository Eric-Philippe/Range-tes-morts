import { Component, OnInit } from '@angular/core';
import { ImportsModule } from '../../imports';
import { LotsService } from '../../services/Lots.service';
import { Lot } from '../../models/Lot';
import { HeaderComponent } from '../../components/header/header.component';
import { MapComponent } from '../../components/map/map.component';
import { TableGeneral } from '../../components/tables/general/general.component';
import { TableDeads } from '../../components/tables/deads/deads.component';

@Component({
  standalone: true,
  imports: [
    ImportsModule,
    HeaderComponent,
    MapComponent,
    TableGeneral,
    TableDeads,
  ],
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css'],
  providers: [LotsService],
})
export class HomeComponent implements OnInit {
  lots: Lot[] = [];

  constructor(private lotsService: LotsService) {}

  ngOnInit(): void {
    this.lotsService.getAll().then((lots) => {
      this.lots = lots;
    });
  }
}
