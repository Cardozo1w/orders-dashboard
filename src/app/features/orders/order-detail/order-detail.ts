import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-detail.html',
})
export class OrderDetailComponent {
  route = inject(ActivatedRoute);
  orderService = inject(OrderService);
  router = inject(Router);

  http = inject(HttpClient);

  orderId = this.route.snapshot.paramMap.get('id');

  orders = this.orderService.orders;

  ngOnInit() {
  this.orderService.loadOrders();
}

  order = computed(() => {
    const found = this.orders().find((o) => o.id === this.orderId);
    console.log("orderService", this.orderService.orders());
    

    if (!found) return null;

    return {
      ...found,
      items: found.items.map((i: any) => ({
        ...i,
        cantidadSurtida: i.cantidadSurtida !== undefined ? i.cantidadSurtida : i.cantidadSolicitada,
      })),
    };
  });

  increase(item: any) {
    if (item.cantidadSurtida < item.cantidadSolicitada) {
      item.cantidadSurtida++;
    }
  }

  decrease(item: any) {
    if (item.cantidadSurtida > 0) {
      item.cantidadSurtida--;
    }
  }

  saveProgress() {
    const order = this.order();

    this.orderService.updateOrder(order.id, {
      items: order.items,
      status: 'preparando',
    });
  }

  finalizeOrder() {
    const order = this.order();

    const total = order.items.reduce((acc: number, i: any) => acc + i.cantidadSolicitada, 0);

    const surtido = order.items.reduce((acc: number, i: any) => acc + i.cantidadSurtida, 0);

    const status = surtido === total ? 'completado' : 'surtido_con_faltantes';

    this.orderService.updateOrder(order.id, {
      items: order.items,
      status,
    });
  }

  showCancelModal = false;

  openCancelModal() {
    this.showCancelModal = true;
  }

  closeCancelModal() {
    this.showCancelModal = false;
  }

  confirmCancel() {
    this.orderService.updateStatus(this.order().id, 'cancelado');
    this.showCancelModal = false;
    this.router.navigate(['/orders']);
  }

  cancelOrder() {
    this.orderService.updateStatus(this.order().id, 'cancelado');
  }

  isLocked() {
    const status = this.order()?.status;
    const lockedStatuses = ['completado', 'cancelado', 'completado_con_faltantes'];
    return lockedStatuses.includes(status);
  }
}
