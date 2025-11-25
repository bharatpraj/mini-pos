import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();

  // 🔹 NEW: EASY ACCESS TO CURRENT USER
  get currentUserValue(): User | null {
    return this.currentUser.value;
  }

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private afAuth: Auth
  ) {
    this.loadUser();
  }

  // Check localStorage safely (SSR compatible)
  private get canUseLocalStorage(): boolean {
    return isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';
  }

  // --------------------------------------------
  // 🔹 CUSTOMER SIGNUP (Firebase + Local Cache)
  // --------------------------------------------
  async signup(name: string, email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.afAuth, email, password);

      const token = await result.user.getIdToken();

      const user: User = {
        id: result.user.uid,
        email: result.user.email ?? '',
        name,
        token,
      };

      if (this.canUseLocalStorage) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      this.currentUser.next(user);
      this.router.navigate(['/products']);
    }
    catch (err: any) {
      console.error('Signup error:', err);
      alert(err.message || 'Signup failed.');
    }
  }

  // --------------------------------------------
  // 🔹 NORMAL LOGIN (Firebase + Offline Support)
  // --------------------------------------------
  async login(email: string, password: string): Promise<boolean> {
    try {
      const result = await signInWithEmailAndPassword(this.afAuth, email, password);
      const token = await result.user.getIdToken();

      const user: User = {
        id: result.user.uid,
        email: result.user.email ?? '',
        name: result.user.displayName ?? email.split('@')[0],
        token,
      };

      if (this.canUseLocalStorage) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      this.currentUser.next(user);
      return true; // 🔥 success
    }
    catch (err) {
      console.warn('Firebase unreachable — trying offline login...');

      if (this.canUseLocalStorage) {
        const cached = localStorage.getItem('user');
        if (cached) {
          const cachedUser = JSON.parse(cached);
          if (cachedUser.email === email) {
            alert('Offline mode → Logged in using saved credentials');
            this.currentUser.next(cachedUser);
            return true;
          }
        }
      }

      alert('Login failed. Please try again.');
      return false;
    }
  }

  // --------------------------------------------
  // 🔹 GUEST LOGIN SUPPORT
  // --------------------------------------------
  guestLogin() {
    const user: User = {
      id: 'guest',
      email: '',
      name: 'Guest User',
      token: '',
    };

    if (this.canUseLocalStorage) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    this.currentUser.next(user);
    this.router.navigate(['/pos']);
  }

  // --------------------------------------------
  // 🔹 LOGOUT
  // --------------------------------------------
  logout() {
    if (this.canUseLocalStorage) {
      localStorage.removeItem('user');
    }

    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  // --------------------------------------------
  // 🔹 LOAD USER FROM CACHE ON APP START
  // --------------------------------------------
  loadUser() {
    if (!this.canUseLocalStorage) return;

    const data = localStorage.getItem('user');
    if (data) {
      this.currentUser.next(JSON.parse(data));
    }
  }

  // --------------------------------------------
  // 🔹 TOKEN GETTER
  // --------------------------------------------
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
