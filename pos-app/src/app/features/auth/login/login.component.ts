import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule],
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  email = '';
  password = '';

  constructor() {
    // 👇 If already logged in, redirect to POS
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/pos']);
    }
  }

  /**
   * Login to the application.
   * If the credentials are valid, it will redirect to the POS page.
   * If not, it will show an alert with an error message.
   */
  async login() {
    if (!this.email || !this.password) {
      alert('Please enter both email and password');
      return;
    }

    const success:any = await this.auth.login(this.email, this.password);

    if (success) {
      this.router.navigate(['/pos']);   // 👈 redirect on success
    } else {
      alert('Invalid credentials!');
    }
  }
}
