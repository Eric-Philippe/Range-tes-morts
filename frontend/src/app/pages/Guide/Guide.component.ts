import { Component } from '@angular/core';
import { ImportsModule } from '../../imports';
import { HeaderComponent } from '../../components/header/header.component';

/**
 * Guide list:
 *
 * - How to select a grave
 * - How to add a new dead
 * - How to delete a dead
 * - How to update a dead
 * - How to search all the empty graves
 * - How to search a grave by the dead name
 * - How to read the gravery details
 * - How to make a backup of the grave
 */

interface GuideStep {
  title: string;
  illustrations: string[];
  steps: string[];
}

interface Guide {
  title: string;
  description: string;
  steps: GuideStep[];
}

@Component({
  standalone: true,
  imports: [ImportsModule, HeaderComponent],
  templateUrl: './Guide.component.html',
})
export class GuideComponent {}
