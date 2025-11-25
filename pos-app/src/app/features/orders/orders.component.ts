import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService, Order } from '../../core/services/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  updatingId: string | null = null;
  showItemsModal = false;
  modalItems: any[] = [];

  statuses: Order['status'][] = ['Pending', 'InProgress', 'Ready', 'Completed'];

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.loading = true;

    // Subscribe to live order stream
    this.ordersService.getOrders().subscribe(list => {
      this.orders = list;
      this.loading = false;
    });

    // Load initial data
    this.ordersService.loadOrders();
  }

  openItemsModal(order: any) {
    this.modalItems = order.items;
    this.showItemsModal = true;
  }

  closeItemsModal() {
    this.showItemsModal = false;
  }

  /**
   * Update the status of a specific order
   * @param order The order to update
   * @param status The new status of the order
   * @example updateStatus(order, 'Completed')
   */
  updateStatus(order: Order, status: string) {
    this.updatingId = order.id;

    this.ordersService.updateStatus(order.id, status as Order['status']).subscribe({
      next: () => (this.updatingId = null),
      error: () => {
        alert('Failed to update status');
        this.updatingId = null;
      }
    });
  }

  /** Safe HTMLSelectElement value extraction */
  extractValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }
}
