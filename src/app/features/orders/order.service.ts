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
  // ORDERS API
  // ------------------------

  loadOrders() {
    this.http.get<any[]>(this.api).subscribe((orders) => {
      this._orders.set(orders.reverse());
    });
  }

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
