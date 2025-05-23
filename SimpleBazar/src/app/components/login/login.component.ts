import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router) {}

  login() {
    if (this.username === 'admin' && this.password === 'prova') {
      localStorage.setItem('authenticated', 'true');
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Credenziali non valide';
    }
  }
}
