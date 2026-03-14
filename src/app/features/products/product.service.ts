import { Injectable, signal, computed, inject } from '@angular/core';
import { Product } from './product.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductService {
  http = inject(HttpClient);
  private api = 'https://orders-server-mock.onrender.com/products';

    private readonly _products = signal<Product[]>([]);


   loadProducts() {
    this.http.get<any[]>(this.api).subscribe((products) => {      
      this._products.set(products);
    });
  }
  products = this._products.asReadonly();

  getProducts() {
    return this.products();
  }
}
