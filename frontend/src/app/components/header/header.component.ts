import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  standalone: true,
  imports: [MenubarModule],
  styleUrls: ['./header.component.css'],
  selector: 'app-header',
  template: ` <p-menubar [model]="items" /> `,
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Accueil',
        icon: 'pi pi-fw pi-home',
        routerLink: '/home',
      },
      {
        label: 'Guide - En cours',
        icon: 'pi pi-fw pi-cog',
        routerLink: '/guide',
        disabled: true,
      },
      {
        label: 'Me déconnecter',
        icon: 'pi pi-fw pi-power-off',
        command: () => {
          localStorage.removeItem('token');
          location.reload();
        },
      },
    ];
  }
}
