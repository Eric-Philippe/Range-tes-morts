import { Component } from '@angular/core';
import { ImportsModule } from '../../imports';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './Login.component.html',
  providers: [],
})
export class LoginComponent {
  formGroup!: FormGroup;

  ngOnInit() {
    this.formGroup = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
    });
  }

  onSubmit() {}
}
