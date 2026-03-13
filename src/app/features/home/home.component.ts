import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div
      class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-8"
    >
      <div class="w-full max-w-4xl text-center mb-10">
        <h1 class="text-3xl font-semibold text-slate-800 mb-2">Dashboard de pedidos</h1>
        <p class="text-slate-500">Gestiona productos y pedidos desde un solo lugar</p>
      </div>

      <div class="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        <!-- BUSCADOR -->
        <div
          class="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:bg-blue-50 transition flex flex-col items-center gap-4"
          (click)="navigate('products')"
        >
          <div
            class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl"
          >
            🔍
          </div>

          <span class="text-lg font-medium text-slate-800"> Buscador de productos </span>

          <span class="text-sm text-slate-500 text-center">
            Busca productos y crea nuevos pedidos
          </span>
        </div>

        <!-- PEDIDOS -->
        <div
          class="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:bg-blue-50 transition flex flex-col items-center gap-4"
          (click)="navigate('orders')"
        >
          <div
            class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl"
          >
            🛒
          </div>

          <span class="text-lg font-medium text-slate-800"> Mis pedidos </span>

          <span class="text-sm text-slate-500 text-center">
            Consulta y administra el estado de los pedidos
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .home-full {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1976d2 0%, #43a047 100%);
        color: #fff;
      }
      h1 {
        font-size: 2.5rem;
        margin-bottom: 48px;
        font-weight: 700;
        letter-spacing: 1px;
      }
      .nav-cards {
        display: flex;
        gap: 32px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .card {
        background: #fff;
        color: #1976d2;
        border-radius: 16px;
        box-shadow: 0 2px 16px #0002;
        padding: 40px 32px;
        min-width: 220px;
        min-height: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: 600;
        cursor: pointer;
        transition:
          transform 0.2s,
          box-shadow 0.2s;
      }
      .card:hover {
        transform: translateY(-6px) scale(1.04);
        box-shadow: 0 6px 24px #1976d2aa;
      }
      .icon {
        font-size: 2.5rem;
        margin-bottom: 12px;
      }
      @media (max-width: 600px) {
        .nav-cards {
          flex-direction: column;
          gap: 24px;
        }
        .card {
          min-width: 90vw;
          padding: 32px 16px;
        }
      }
    `,
  ],
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
