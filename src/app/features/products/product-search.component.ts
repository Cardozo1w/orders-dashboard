import { Component, inject } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Trash } from 'lucide-angular';
import { OrderService } from '../orders/order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './product-search.component.html',
})
export class ProductSearchComponent {
  searchTerm = '';
  showDropdown = false;
  matricula = '';

  productService = inject(ProductService);
  orderService = inject(OrderService);

   ngOnInit() {
    this.productService.loadProducts();
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.showDropdown = this.searchTerm.length > 0;
  }

  filteredProducts() {
    const term = this.searchTerm.toLowerCase();
    return this.productService.products().filter((p) => p.nombre.toLowerCase().includes(term));
  }

  addToOrder(product: Product) {
    this.orderService.addProduct({
      productId: product.id,
      nombre: product.nombre,
      almacen: product.almacen,
      cantidadSolicitada: 1,
      cantidadSurtida: 0,
    });
  }

  orderCount() {
    return this.orderService.items().length;
  }

  goToOrder() {
    // Navega a la pantalla de pedido
    window.location.href = '/orders';
  }

  selectProduct(product: Product) {
    this.orderService.addProduct({
      productId: product.id,
      nombre: product.nombre,
      almacen: product.almacen,
      cantidadSolicitada: 1,
      cantidadSurtida: 0,
    });

    this.searchTerm = '';
    this.showDropdown = false;
  }

  orderItems() {
    return this.orderService.items();
  }
  updateQuantity(productId: number, event: any) {
    const qty = Number(event.target.value);
    this.orderService.updateQuantity(productId, qty);
  }
  removeItem(productId: number) {
    this.orderService.removeProduct(productId);
  }

  increaseQuantity(productId: number) {
    const item = this.orderService.items().find((i) => i.productId === productId);

    if (item) {
      this.orderService.updateQuantity(productId, item.cantidadSolicitada + 1);
    }
  }

  decreaseQuantity(productId: number) {
    const item = this.orderService.items().find((i) => i.productId === productId);

    if (item && item.cantidadSolicitada > 1) {
      this.orderService.updateQuantity(productId, item.cantidadSolicitada - 1);
    }
  }

  finalizeOrder() {
    this.orderService.finalizeOrder(this.matricula);
  }
}
