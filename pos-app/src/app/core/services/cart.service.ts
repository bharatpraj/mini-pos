import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart = new BehaviorSubject<any[]>([]);
  cart$ = this.cart.asObservable();

  add(item: any) {
    const items = [...this.cart.value];
    const existing = items.find(i => i.id === item.id);

    if (existing) {
      existing.qty++;
    } else {
      items.push({ ...item, qty: 1 });
    }

    this.cart.next(items);
  }

  updateQty(index: number, qty: number) {
    const items = [...this.cart.value];
    items[index].qty = Number(qty);
    this.cart.next(items);
  }

  remove(index: number) {
    const items = [...this.cart.value];
    items.splice(index, 1);
    this.cart.next(items);
  }

  clear() {
    this.cart.next([]);
  }

  totals() {
    const items = this.cart.value;

    const totalItems = items.reduce((a, b) => a + b.qty, 0);
    const totalPrice = items.reduce((a, b) => a + b.price * b.qty, 0);

    return { totalItems, totalPrice };
  }
}
