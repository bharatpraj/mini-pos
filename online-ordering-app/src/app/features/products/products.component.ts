import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuService } from '../../core/services/menu.service';
import { CartService } from '../../core/services/cart.service';
import { OrdersService } from '../../core/services/orders.service';
import { MenuItem } from '../../core/models/menu-item.model';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-products.component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  auth = inject(AuthService);
  menuService = inject(MenuService);
  cartService = inject(CartService);
  ordersService = inject(OrdersService);

  currentUser$ = this.auth.currentUser$;


  items$: Observable<MenuItem[]> = this.menuService.getItems();
  cart$ = this.cartService.cart$;

  // Toggle between 'products' and 'cart'
  show: 'products' | 'cart' = 'products';

  // checkout model
  checkout = {
    name: '',
    address: '',
    phone: '',
    email: '',
    method: 'cash',
    cardNumber: '',
    cardMeta: '',
  };

  placing = false;
  orderResult: any = null;

  constructor() {}

 ngOnInit() {
  this.currentUser$.subscribe(user => {
    if (user) {
      this.checkout.email = user.email ?? '';
      this.checkout.name = user.name ?? '';
    }
  });
}

  // totals getter from service
  get totals() {
    return this.cartService.totals();
  }

  // quick add qty
  quickAdd(item: MenuItem, qty = 1) {
    this.cartService.add({ ...item, qty });
  }

  openQuickQty(item: MenuItem) {
    // an example: just add 1 for now
    this.quickAdd(item, 1);
  }

  increase(i: number) {
    const c = this.cartService.snapshot();
    const item = c[i];
    this.cartService.updateQty(i, item.qty + 1);
  }

  decrease(i: number) {
    const c = this.cartService.snapshot();
    const item = c[i];
    if (item.qty > 1) {
      this.cartService.updateQty(i, item.qty - 1);
    } else {
      this.remove(i);
    }
  }

  isInCart(sku: string) {
  return this.cartService.snapshot().some(i => i.sku === sku);
}

// Get its quantity
getCartQty(sku: string) {
  const item = this.cartService.snapshot().find(i => i.sku === sku);
  return item ? item.qty : 0;
}

// Increase qty from product card
increaseFromCard(sku: string) {
  const cart = this.cartService.snapshot();
  const index = cart.findIndex(i => i.sku === sku);
  if (index >= 0) {
    this.cartService.updateQty(index, cart[index].qty + 1);
  }
}

// Decrease qty from product card
decreaseFromCard(sku: string) {
  const cart = this.cartService.snapshot();
  const index = cart.findIndex(i => i.sku === sku);
  if (index >= 0) {
    const item = cart[index];
    if (item.qty > 1) {
      this.cartService.updateQty(index, item.qty - 1);
    } else {
      this.cartService.remove(index);
    }
  }
}

  changeQty(i: number, qty: number) {
    if (qty < 1) qty = 1;
    this.cartService.updateQty(i, qty);
  }

  remove(i: number) {
    this.cartService.remove(i);
  }

  clearCart() {
    this.cartService.clear();
  }

  scrollToCheckout() {
    this.show = 'cart';
    setTimeout(() => {
      const el = document.getElementById('checkout');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  placeOrder() {
    this.cart$.pipe(take(1)).subscribe(cart => {
      if (!cart || cart.length === 0) {
        alert('Cart is empty');
        return;
      }

      const order: any = {
        source: 'online',
        status: 'Pending',
        customerName: this.checkout.name,
        email: this.checkout.email,
        delivery: {
          name: this.checkout.name,
          address: this.checkout.address,
          phone: this.checkout.phone,
          email: this.checkout.email,
        },
        payment: {
          method: this.checkout.method,
          cardNumber: this.checkout.method === 'card' ? this.checkout.cardNumber : undefined,
        },
        items: cart.map(i => ({
          name: i.name,
          price: i.price,
          qty: i.qty,
          sku: i.sku,
          image: i.image
        })),
        total: this.totals.totalPrice,
        createdBy: this.checkout.name || 'Guest',
        createdAt: new Date().toISOString()
      };

      this.placing = true;
      this.ordersService.createOrder(order).subscribe({
        next: res => {
          this.placing = false;
          this.orderResult = res;
          this.cartService.clear();
        },
        error: err => {
          console.error('Order creation failed', err);
          this.placing = false;
          alert('Failed to create order');
        }
      });
    });
  }
}
