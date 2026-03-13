import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isLoggedIn = signal(localStorage.getItem('loggedIn') === 'true');

  isLoggedIn = this._isLoggedIn.asReadonly();

  login(username: string, password: string) {
    if (username === 'admin' && password === '1234') {
      this._isLoggedIn.set(true);
      localStorage.setItem('loggedIn', 'true');

      return true;
    }

    return false;
  }

  logout() {
    this._isLoggedIn.set(false);
    localStorage.removeItem('loggedIn');
  }
}
