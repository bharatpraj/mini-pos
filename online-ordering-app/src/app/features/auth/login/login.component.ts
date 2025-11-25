import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login.component',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  email = '';
  password = '';


  constructor() {
    // 👇 If already logged in, redirect 
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/products']);
    }
  }

  // Normal Login
  async login() {
    if (!this.email || !this.password) {
      alert('Please enter both email and password');
      return;
    }

    const success = await this.auth.login(this.email, this.password);

    if (success) {
      this.router.navigate(['/products']);
    }
  }
}
