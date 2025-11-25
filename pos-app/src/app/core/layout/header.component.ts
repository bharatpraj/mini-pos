import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe
  ]
})
export class HeaderComponent {
  auth = inject(AuthService);
  currentUser$ = this.auth.currentUser$;

  logout() {
    this.auth.logout();
  }
}
