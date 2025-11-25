import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../core/services/menu.service';
import { CartService } from '../../core/services/cart.service';
import { OrdersService } from '../../core/services/orders.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-pos.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css',
})
export class PosComponent {
menuService = inject(MenuService);
  cartService = inject(CartService);
  ordersService = inject(OrdersService);

  customers = [
    { name: 'Walk-in Customer', email: 'default@email.com' },
    { name: 'John Doe', email: 'john.doe@email.com' },
    { name: 'Mary Smith', email: 'mary.smith@email.com' },
    { name: 'Bharat Prajapat', email: 'bharat.prajapat@email.com' },
  ];
  selectedCustomer = this.customers[0];  // default

  items$ = this.menuService.getItems();
  cart$ = this.cartService.cart$;

  toastMessage: string | null = null;

  orderResult: any = null;

  ngOnInit(): void {
    this.menuService.loadItems();
  }

  showToast(msg: string) {
    this.toastMessage = msg;
    setTimeout(() => (this.toastMessage = null), 3000);
  }

  addToCart(item: any) {
    this.cartService.add(item);
  }

  remove(i: number) {
    this.cartService.remove(i);
  }

  updateQty(i: number, qty: number) {
    this.cartService.updateQty(i, qty);
  }

  get totals() {
    return this.cartService.totals();
  }

  pay() {
    this.cart$.pipe(take(1)).subscribe(cart => {
      if (!cart || cart.length === 0) {
        this.showToast('Cart is empty');
        return;
      }
      console.log('selectedCustomer', this.selectedCustomer);
      const order: any = {
        source: 'pos',
        status: 'Pending',
        customerName: this.selectedCustomer?.name,
        email: this.selectedCustomer?.email,
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          qty: item.qty,
          sku: item.sku,
          image: item.image,
        })),
        total: this.totals.totalPrice,
        createdBy: 'POS Terminal 1',
      };

      console.log('Creating order', order);
      this.ordersService.createOrder(order).subscribe({
        next: res  => {
          this.cartService.clear();
          this.orderResult = res;
        },
        error: (err) => {
          console.error('Order creation failed', err);
          this.showToast('Failed to create order');
        },
      });
    });
  }
}
