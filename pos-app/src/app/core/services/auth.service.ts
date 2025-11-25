import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private afAuth: Auth 
  ) {
    this.loadUser();
  }

  private get canUseLocalStorage(): boolean {
    return isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';
  }

  async login(email: string, password: string) {
  try {
    // -------------------------------
    // 1) Online Login (Firebase)
    // -------------------------------
    const result = await signInWithEmailAndPassword(this.afAuth, email, password);
    const token = await result.user.getIdToken();

    const user: User = {
      id: result.user.uid,
      email: result.user.email ?? '',
      name: result.user.displayName ?? 'Staff',
      token,
    };

    // Save to localStorage only in browser
    if (this.canUseLocalStorage) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    this.currentUser.next(user);

    // Redirect after success
    this.router.navigate(['/pos']);
    return true;
  } 

  catch (err) {
    console.warn('Firebase unreachable → Trying cache login...');

    // ------------------------------------------
    // 2) Offline Login (No Firebase connection)
    // ------------------------------------------
    if (this.canUseLocalStorage) {
      const cached = localStorage.getItem('user');

      if (cached) {
        const cachedUser: User = JSON.parse(cached);

        // Only allow login if the email matches
        if (cachedUser.email === email) {
          this.currentUser.next(cachedUser);

          alert('Offline mode: Logged in using cached credentials');

          // Choose what you prefer:
          this.router.navigate(['/pos']);   
          // this.router.navigate(['/orders']);  // your previous behavior
          return true;
        }
      }
    }

    // ------------------------------------------
    // 3) Authentication failed
    // ------------------------------------------
    alert('Authentication failed. No cache available.');
    return false;
  }
}


  logout() {
    if (this.canUseLocalStorage) {
      localStorage.removeItem('user');
    }
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  loadUser() {
    if (!this.canUseLocalStorage) return;
    const data = localStorage.getItem('user');
    if (data) this.currentUser.next(JSON.parse(data));
  }

  get token(): string | null {
    return this.currentUser.value?.token ?? null;
  }

  
  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false; 
    }

    return !!localStorage.getItem('user');
  }
}