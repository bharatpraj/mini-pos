import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  auth = inject(AuthService);
  router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  async signup() {
    if (!this.name || !this.email || !this.password) {
      alert('Please fill all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const result = await this.auth.signup(this.name, this.email, this.password);
      alert('Signup successful! Please login.');
      this.router.navigate(['/login']);
  }
}
