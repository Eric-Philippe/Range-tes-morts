import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

const primeNgModules = [
  ButtonModule,
  TabViewModule,
  TableModule,
  CommonModule,
  TagModule,
];

@NgModule({
  imports: primeNgModules,
  exports: primeNgModules,
})
export class ImportsModule {}
