import { Injectable, signal } from '@angular/core';

export type UserRole = 'almacenista' | 'tecnico';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // ---------------------------------------------
  // MOCK DE AUTENTICACIÓN 100% EN FRONT
  //
  // Usuarios de prueba:
  // - almacen / almacen123  -> rol: 'almacenista'
  // - tecnico / tecnico123  -> rol: 'tecnico'
  //
  // La expiración de 12 horas se maneja sólo en
  // el front con localStorage (sin endpoint POST).
  // ---------------------------------------------

  private readonly _isLoggedIn = signal(false);
  private readonly _role = signal<UserRole | null>(null);

  isLoggedIn = this._isLoggedIn.asReadonly();
  role = this._role.asReadonly();

  // Clave única para guardar la sesión en localStorage
  private readonly STORAGE_KEY = 'auth_session';

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        this._isLoggedIn.set(false);
        this._role.set(null);
        return;
      }

      const data = JSON.parse(raw) as {
        loggedIn?: boolean;
        role?: UserRole;
        expiresAt?: number;
      };

      const expiresAt = typeof data.expiresAt === 'number' ? data.expiresAt : 0;

      if (!expiresAt || Date.now() >= expiresAt || !data.loggedIn) {
        this._isLoggedIn.set(false);
        this._role.set(null);
        localStorage.removeItem(this.STORAGE_KEY);
        return;
      }

      this._isLoggedIn.set(true);
      this._role.set(data.role ?? null);
    } catch {
      this._isLoggedIn.set(false);
      this._role.set(null);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  // Método simple para usar en el guard.
  // Refresca desde localStorage y devuelve el estado actual.
  isAuthenticated(): boolean {
    this.restoreSession();
    return this._isLoggedIn();
  }

  // ---------------------------------------------
  // LOGIN (mock en memoria)
  //
  // - Valida contra credenciales fijas:
  //   - almacen / almacen123  -> 'almacenista'
  //   - tecnico / tecnico123  -> 'tecnico'
  // - Si son correctas:
  //   - marca loggedIn
  //   - guarda role
  //   - crea expiración de 12 horas
  // - Devuelve boolean (síncrono) para simplificar el flujo.
  // ---------------------------------------------

  login(username: string, password: string): boolean {
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;

    let role: UserRole | null = null;

    if (username === 'almacen' && password === 'almacen123') {
      role = 'almacenista';
    } else if (username === 'tecnico' && password === 'tecnico123') {
      role = 'tecnico';
    }

    if (!role) {
      this._isLoggedIn.set(false);
      this._role.set(null);
      localStorage.removeItem(this.STORAGE_KEY);
      return false;
    }

    const expiresAt = Date.now() + TWELVE_HOURS;

    this._isLoggedIn.set(true);
    this._role.set(role);

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify({
        loggedIn: true,
        role,
        expiresAt,
      }),
    );

    return true;
  }

  logout() {
    this._isLoggedIn.set(false);
    this._role.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Helpers de rol para usar en componentes/plantillas
  isAlmacenista(): boolean {
    return this.role() === 'almacenista';
  }

  isTecnico(): boolean {
    return this.role() === 'tecnico';
  }
}
