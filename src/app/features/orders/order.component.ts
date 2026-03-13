import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OrderService } from './order.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { computed } from '@angular/core';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './order.component.html',
})
export class OrderComponent {
  statuses = {
    pendiente: {
      label: 'Pendiente',
      color: 'bg-yellow-100 text-yellow-700',
    },
    preparando: {
      label: 'Preparando',
      color: 'bg-blue-100 text-blue-700',
    },
    completado: {
      label: 'Completado',
      color: 'bg-green-100 text-green-700',
    },
    cancelado: {
      label: 'Cancelado',
      color: 'bg-red-100 text-red-700',
    },
  };

  router = inject(Router);

  filters = signal({
    matricula: '',
    fecha: '',
    status: '',
  });

  draftFilters = {
    matricula: '',
    fecha: '',
    status: '',
  };

  page = signal(1);
  pageSize = signal(5);

  // ------------------------------------------------------------
  // MODO ACTUAL: paginación y filtros en memoria (front-end)
  //
  // - El servicio trae TODOS los pedidos (sin paginación).
  // - Aquí filtramos y paginamos con signals y `slice`.
  //
  // CUANDO EL BACKEND SOPORTE PAGINACIÓN:
  // - Puedes cambiar fácilmente a modo "paginado en servidor".
  // - Abajo, en la sección "MODO PAGINADO (BACKEND)", tienes
  //   un ejemplo completo comentado de cómo quedaría.
  // ------------------------------------------------------------
  statusKeys = Object.keys(this.statuses) as (keyof typeof this.statuses)[];

  filteredOrders = computed(() => {
    const filters = this.filters();
    const orders = this.orders();

    return orders.filter((order: any) => {
      const matricula = (order.matricula ?? '').toLowerCase();

      const matchMatricula =
        !filters.matricula || matricula.includes(filters.matricula.toLowerCase());

      const matchStatus = !filters.status || order.status === filters.status;

      const matchFecha =
        !filters.fecha || new Date(order.createdAt).toISOString().slice(0, 10) === filters.fecha;

      return matchMatricula && matchStatus && matchFecha;
    });
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredOrders().length / this.pageSize());
  });

  paginatedOrders = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return this.filteredOrders().slice(start, end);
  });

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
    }
  }

  applyFilters() {
    console.log('Aplicando filtros:', this.draftFilters);

    this.filters.set({ ...this.draftFilters });

    console.log('Signal filters ahora:', this.filters());
    this.page.set(1);
  }

  resetFilters() {
    this.draftFilters = {
      matricula: '',
      fecha: '',
      status: '',
    };

    this.filters.set({ ...this.draftFilters });
    this.page.set(1);
  }

  openDetail(order: any) {
    this.router.navigate(['/orders', order.id]);
  }

  getStatusLabel(status: string) {
    return this.statuses[status as keyof typeof this.statuses]?.label ?? status;
  }

  orderService = inject(OrderService);

  orders = this.orderService.orders;

  ngOnInit() {
    this.orderService.loadOrders();
  }

  // ============================================================
  // MODO PAGINADO (BACKEND) - EJEMPLO PARA CAMBIAR FÁCILMENTE
  // ------------------------------------------------------------
  // Pasos para activar cuando el backend ya pagine:
  //
  // 1) En `OrderService`:
  //    - Activa la versión paginada de `loadOrders(page, pageSize, filters)`
  //      y el signal `totalOrders` (ver comentarios en ese archivo).
  //
  // 2) En este componente:
  //    a) Elimina/comenta `filteredOrders` y `paginatedOrders` de arriba.
  //    b) Sustituye la siguiente propiedad y métodos por los comentados aquí:
  //
  //       - `orders = this.orderService.orders;` (se mantiene igual)
  //       - Nueva propiedad: `totalOrders = this.orderService.totalOrders;`
  //       - Nuevo `totalPages` basado en `totalOrders`.
  //       - Método privado `loadPage()` que llama al servicio.
  //       - `ngOnInit`, `nextPage`, `prevPage`, `applyFilters` y
  //         `resetFilters` deben llamar a `loadPage()`.
  //
  // 3) En la plantilla `order.component.html`:
  //    - Cambiar `@for (order of paginatedOrders(); ...)` por
  //      `@for (order of orders(); ...)`.
  //    - Cambiar la condición de vacío de `filteredOrders().length === 0`
  //      a `orders().length === 0`.
  //
  // Código de referencia (descomentar y ajustar cuando uses backend paginado):
  //
  //   totalOrders = this.orderService.totalOrders;
  //
  //   totalPages = computed(() => {
  //     const total = this.totalOrders();
  //     return total ? Math.ceil(total / this.pageSize()) : 1;
  //   });
  //
  //   private loadPage() {
  //     this.orderService.loadOrders(this.page(), this.pageSize(), this.filters());
  //   }
  //
  //   ngOnInit() {
  //     this.loadPage();
  //   }
  //
  //   nextPage() {
  //     if (this.page() < this.totalPages()) {
  //       this.page.update((p) => p + 1);
  //       this.loadPage();
  //     }
  //   }
  //
  //   prevPage() {
  //     if (this.page() > 1) {
  //       this.page.update((p) => p - 1);
  //       this.loadPage();
  //     }
  //   }
  //
  //   applyFilters() {
  //     this.filters.set({ ...this.draftFilters });
  //     this.page.set(1);
  //     this.loadPage();
  //   }
  //
  //   resetFilters() {
  //     this.draftFilters = { matricula: '', fecha: '', status: '' };
  //     this.filters.set({ ...this.draftFilters });
  //     this.page.set(1);
  //     this.loadPage();
  //   }
  // ============================================================

  getStatusColor(status: string) {
    return this.statuses[status as keyof typeof this.statuses]?.color ?? '';
  }

  getProgress(order: any) {
    const total = order.items.reduce((acc: number, i: any) => acc + i.cantidadSolicitada, 0);

    const surtido = order.items.reduce((acc: number, i: any) => acc + i.cantidadSurtida, 0);

    return `${surtido}/${total}`;
  }
}
