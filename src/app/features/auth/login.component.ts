import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-6"
    >
      <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-semibold text-slate-800 mb-6 text-center">Iniciar sesión</h2>

        <form (submit)="onLogin($event)" class="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Usuario"
            [value]="usuario"
            (input)="usuario = $event.target.value"
            name="usuario"
            required
            class="border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
          />

          <input
            type="password"
            placeholder="Contraseña"
            [value]="contrasena"
            (input)="contrasena = $event.target.value"
            name="contrasena"
            required
            class="border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
          />

          <button
            type="submit"
            class="bg-blue-600 text-white py-3 rounded-xl shadow hover:bg-blue-700 transition font-medium"
          >
            Iniciar sesión
          </button>
        </form>

        @if (error) {
          <div class="mt-4 text-sm text-red-600 text-center">Usuario o contraseña incorrectos</div>
        }

        <div class="mt-6 text-xs text-slate-500 text-center border-t pt-4">
          <strong class="text-slate-600">Superusuario de prueba</strong>
          <div class="mt-1">
            Usuario: <code class="bg-slate-100 px-2 py-1 rounded">superuser</code>
          </div>
          <div class="mt-1">
            Contraseña: <code class="bg-slate-100 px-2 py-1 rounded">superpass</code>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        max-width: 320px;
        margin: 40px auto;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 8px #ccc;
      }
      input {
        display: block;
        width: 100%;
        margin-bottom: 12px;
        padding: 8px;
      }
      button {
        width: 100%;
        padding: 8px;
      }
      div[ngIf] {
        color: red;
        margin-top: 8px;
      }
    `,
  ],
})
export class LoginComponent {
  usuario = '';
  contrasena = '';
  error = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onLogin(event: Event) {
    event.preventDefault();
    this.error = false;

    const success = this.auth.login(this.usuario, this.contrasena);
    this.error = !success;

    if (success) {
      this.router.navigate(['/home']);
    }
  }
}
