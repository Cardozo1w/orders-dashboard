import { Injectable, signal, computed } from '@angular/core';
import { Product } from './product.model';

const MOCK_PRODUCTS: Product[] = [
  { id: 1, nombre: 'Laptop', almacen: 'A1', stock: 10 },
  { id: 2, nombre: 'Mouse', almacen: 'A2', stock: 25 },
  { id: 3, nombre: 'Teclado', almacen: 'A1', stock: 15 },
  { id: 4, nombre: 'Monitor', almacen: 'B1', stock: 8 },
  { id: 5, nombre: 'Impresora', almacen: 'B2', stock: 12 },
  { id: 6, nombre: 'Tablet', almacen: 'A3', stock: 20 },
  { id: 7, nombre: 'Auriculares', almacen: 'A2', stock: 30 },
  { id: 8, nombre: 'Cargador', almacen: 'A1', stock: 50 },
  { id: 9, nombre: 'Webcam', almacen: 'B1', stock: 18 },
  { id: 10, nombre: 'Altavoz', almacen: 'A3', stock: 22 },
  { id: 11, nombre: 'Microfono', almacen: 'B2', stock: 14 },
  { id: 12, nombre: 'Router', almacen: 'A1', stock: 16 },
  { id: 13, nombre: 'Switch', almacen: 'A2', stock: 9 },
  { id: 14, nombre: 'Cable HDMI', almacen: 'A3', stock: 40 },
  { id: 15, nombre: 'Disco SSD', almacen: 'B1', stock: 11 },
  { id: 16, nombre: 'Memoria RAM', almacen: 'A2', stock: 27 },
  { id: 17, nombre: 'Fuente Poder', almacen: 'B2', stock: 7 },
  { id: 18, nombre: 'Placa Madre', almacen: 'A1', stock: 5 },
  { id: 19, nombre: 'Tarjeta Video', almacen: 'A3', stock: 6 },
  { id: 20, nombre: 'CPU', almacen: 'B1', stock: 4 },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _products = signal<Product[]>(MOCK_PRODUCTS);

  products = this._products.asReadonly();

  getProducts() {
    return this.products();
  }
}
