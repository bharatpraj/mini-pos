import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id?: string;
  name: string;
  sku?: string;
  price: number;
  image?: string;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _cart = new BehaviorSubject<CartItem[]>([]);
  cart$ = this._cart.asObservable();

  constructor() {
    // optionally hydrate from localStorage
    try {
      const raw = localStorage.getItem('pos_cart');
      if (raw) this._cart.next(JSON.parse(raw));
    } catch (e) {}
  }

  private persist() {
    try {
      localStorage.setItem('pos_cart', JSON.stringify(this._cart.value));
    } catch (e) {}
  }

  snapshot(): CartItem[] {
    return JSON.parse(JSON.stringify(this._cart.value));
  }

  add(item: CartItem) {
    const cart = this._cart.value.slice();
    const idx = cart.findIndex(c => c.sku === item.sku);
    if (idx >= 0) {
      cart[idx].qty += item.qty ?? 1;
    } else {
      cart.push({ ...item, qty: item.qty ?? 1 });
    }
    this._cart.next(cart);
    this.persist();
  }

  remove(index: number) {
    const cart = this._cart.value.slice();
    cart.splice(index, 1);
    this._cart.next(cart);
    this.persist();
  }

  updateQty(index: number, qty: number) {
    const cart = this._cart.value.slice();
    if (!cart[index]) return;
    cart[index].qty = qty;
    this._cart.next(cart);
    this.persist();
  }

  clear() {
    this._cart.next([]);
    this.persist();
  }

  totals() {
    const cart = this._cart.value;
    const totalItems = cart.reduce((s, i) => s + (i.qty || 0), 0);
    const totalPrice = cart.reduce((s, i) => s + (i.price * (i.qty || 0)), 0);
    return { totalItems, totalPrice };
  }
}
