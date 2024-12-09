import { Component, Input, OnInit } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { GuideStep } from '../../../models/Guide';

@Component({
  standalone: true,
  imports: [ImportsModule],
  selector: 'guide-step',
  templateUrl: './guide-step.component.html',
  styleUrls: ['./guide-step.component.css'],
})
export class GuideStepCard implements OnInit {
  @Input() step: GuideStep = { title: '', illustrations: [], steps: [] };

  public selectedImgURL: string = '';

  ngOnInit(): void {
    this.selectedImgURL = this.step.illustrations[0];
  }

  selectHoveredImg(imgUrl: string): void {
    this.selectedImgURL = imgUrl;
  }
}
