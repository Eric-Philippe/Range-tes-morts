import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CalendarModule } from 'primeng/calendar';

const primeNgModules = [
  ButtonModule,
  TabViewModule,
  TableModule,
  CommonModule,
  TagModule,
  CardModule,
  DividerModule,
  FormsModule,
  InputTextModule,
  FloatLabelModule,
  CalendarModule,
];

@NgModule({
  imports: primeNgModules,
  exports: primeNgModules,
})
export class ImportsModule {}
