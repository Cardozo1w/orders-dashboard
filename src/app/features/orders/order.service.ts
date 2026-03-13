import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderItem } from './order-item.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private api = 'http://localhost:3000/orders';

  private readonly _items = signal<OrderItem[]>([]);
  private readonly _orders = signal<any[]>([]);

  items = this._items.asReadonly();
  orders = this._orders.asReadonly();

  constructor() {}

  // ------------------------
  // CART
  // ------------------------

  addProduct(item: OrderItem) {
    const current = this._items();
    const index = current.findIndex((i) => i.productId === item.productId);

    if (index > -1) {
      const updated = [...current];
      updated[index] = {
        ...updated[index],
        cantidadSolicitada: updated[index].cantidadSolicitada + item.cantidadSolicitada,
      };

      this._items.set(updated);
      return;
    }

    this._items.set([
      ...current,
      {
        ...item,
        cantidadSurtida: 0,
      },
    ]);
  }

  updateQuantity(productId: number, cantidad: number) {
    const updated = this._items().map((i) => (i.productId === productId ? { ...i, cantidad } : i));

    this._items.set(updated);
  }

  removeProduct(productId: number) {
    this._items.set(this._items().filter((i) => i.productId !== productId));
  }

  clear() {
    this._items.set([]);
  }

  getOrderItems() {
    return this._items();
  }

  totalItems = computed(() =>
    this._items().reduce((acc, item) => acc + item.cantidadSolicitada, 0),
  );

  // ------------------------
  // ORDERS API (modo actual: sin paginación real)
  //
  // IMPORTANTE PARA ENTREGA:
  // - Actualmente el front carga TODOS los pedidos y pagina/filtra en memoria.
  // - Esto simplifica la demo con el mock server.
  //
  // CUANDO EL BACKEND YA SOPORTE PAGINACIÓN:
  // 1) Implementar un endpoint tipo:
  //    GET /orders?page=1&limit=5
  //    que devuelva algo como:
  //    {
  //      first: 1,
  //      prev: null,
  //      next: 2,
  //      last: 10,
  //      pages: 10,
  //      items: 95,      // total de registros
  //      data: [ ... ]   // pedidos de la página actual
  //    }
  //
  // 2) Reemplazar este método por la versión paginada que está
  //    comentada más abajo (ver "VERSIÓN CON PAGINACIÓN REAL").
  //
  // 3) Ajustar el componente `OrderComponent` según las instrucciones
  //    que están documentadas en ese archivo (sección "MODO PAGINADO").
  // ------------------------

  loadOrders() {
    this.http.get<any[]>(this.api).subscribe((orders) => {
      this._orders.set(orders.reverse());
    });
  }

  /*
  // ============================================================
  // VERSIÓN CON PAGINACIÓN REAL (para usar cuando el backend esté listo)
  // ------------------------------------------------------------
  // Pasos para activarla:
  //
  // 1) Descomenta este bloque y elimina el `loadOrders()` simple de arriba.
  // 2) Cambia `api` si tu endpoint es distinto (`/api/orders`, etc).
  // 3) Asegúrate de que el backend reciba `page` y `limit` y
  //    devuelva `{ first, prev, next, last, pages, items, data }`.
  // 4) Sigue las instrucciones en `order.component.ts` para usar
  //    `totalOrders`, `loadPage()` y quitar la paginación en memoria.
  // ============================================================

  private readonly _totalOrders = signal(0);
  totalOrders = this._totalOrders.asReadonly();

  loadOrders(
    page: number = 1,
    pageSize: number = 5,
    filters?: { matricula?: string; fecha?: string; status?: string },
  ) {
    // EJEMPLO: GET /orders?page=1&limit=5&status=pendiente
    let params = new HttpParams()
      .set('page', page)
      .set('limit', pageSize);

    if (filters) {
      if (filters.matricula) {
        params = params.set('matricula', filters.matricula);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.fecha) {
        params = params.set('fecha', filters.fecha);
      }
    }

    this.http.get<any>(this.api, { params }).subscribe((resp) => {
      const data = resp?.data ?? [];
      const total = resp?.items ?? data.length ?? 0;

      this._orders.set(data);
      this._totalOrders.set(total);
    });
  }
  */

  finalizeOrder(matricula: string) {
    const items = this._items();

    if (!items.length) return;

    const order = {
      matricula,
      items: [...items],
      status: 'pendiente',
      createdAt: new Date(),
    };

    this.http.post<any>(this.api, order).subscribe((newOrder) => {
      this._orders.set([...this._orders(), newOrder]);
      this.clear();
    });
  }

  updateStatus(orderId: number, status: string) {
    this.http.patch<any>(`${this.api}/${orderId}`, { status }).subscribe((updated) => {
      const orders = this._orders().map((o) => (o.id === orderId ? updated : o));

      this._orders.set(orders);
    });
  }

  updateOrder(orderId: number, data: any) {
    this.http.patch<any>(`${this.api}/${orderId}`, data).subscribe((updated) => {
      const orders = this._orders().map((o) => (o.id === orderId ? updated : o));

      this._orders.set(orders);
    });
  }
}
