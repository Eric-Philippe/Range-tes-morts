import { Component } from '@angular/core';
import { ImportsModule } from '../../imports';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/Auth.service';
import { Message } from 'primeng/api';

@Component({
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './Login.component.html',
  providers: [AuthService],
})
export class LoginComponent {
  formGroup!: FormGroup;
  messages: Message[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
    });
  }

  onSubmit() {
    this.authService
      .login(this.formGroup.value)
      .then((response) => {
        localStorage.setItem('token', response.token);
        window.location.href = '/home';
      })
      .catch((error) => {
        this.messages = [
          {
            severity: 'error',
            summary: 'Erreur',
            detail: "Nom d'utilisateur ou mot de passe incorrect",
          },
        ];
      });
  }
}
