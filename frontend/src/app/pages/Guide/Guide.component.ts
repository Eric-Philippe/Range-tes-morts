import { Component } from '@angular/core';
import { ImportsModule } from '../../imports';
import { HeaderComponent } from '../../components/header/header.component';

import DATA_GUIDES from '../../assets/guides.json';
import { Guide } from '../../models/Guide';
import { GuideStepCard } from '../../components/cards/guide-step/guide-step.component';

/**
 * Guide list:
 *
 * - How to select a grave !
 * - How to add a new dead !
 * - How to delete a dead !
 * - How to update a dead !
 * - How to search all the empty graves !
 * - How to search a grave by the dead name !
 * - How to read the gravery details
 * - How to make a backup of the grave
 */

@Component({
  standalone: true,
  imports: [ImportsModule, HeaderComponent, GuideStepCard],
  templateUrl: './Guide.component.html',
})
export class GuideComponent {
  guides: Guide[] = DATA_GUIDES.GUIDES;
}
