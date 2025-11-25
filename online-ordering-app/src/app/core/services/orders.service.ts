// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, tap } from 'rxjs';
// import { environment } from '../../../environments/environment';
// import { WebsocketService } from './websocket.service';

// export interface Order {
//   id: string;
//   source: 'online' | 'in-store';
//   status: 'Pending' | 'InProgress' | 'Ready' | 'Completed';
//   items: { id: number; sku: number; name: string; price: number; qty: number; image: string }[];
//   total: number;
//   customerName?: string;
// }

// @Injectable({ providedIn: 'root' })
// export class OrdersService {
//   private orders$ = new BehaviorSubject<Order[]>([]);

//   constructor(private http: HttpClient, private ws: WebsocketService) {}

//   /** Load orders filtered by logged-in user email */
//   loadOrders() {
//     const user = localStorage.getItem('user');
//     if (!user) return;

//     const email = JSON.parse(user).email;

//     this.http.get<Order[]>(`${environment.apiUrl}/orders/email/${email}`)
//       .pipe(tap(orders => this.orders$.next(orders)))
//       .subscribe();
//   }

//   /** Create a new in-store order */
//   createOrder(order: Partial<Order>) {
//     console.log('Creating order from POS:', order);
//     return this.http.post<Order>(`${environment.apiUrl}/orders`, order)
//       .pipe(tap(o => {
//         const list = [o, ...this.orders$.getValue()];
//         this.orders$.next(list);
//       }));
//   }

//   /** Update order status */
//   updateStatus(id: string, status: Order['status']) {
//     return this.http.patch<Order>(`${environment.apiUrl}/orders/${id}/status`, { status })
//       .pipe(tap(o => {
//         const list = this.orders$.getValue().map(x => x.id === o.id ? o : x);
//         this.orders$.next(list);
//       }));
//   }

//   /** Real-time sync with WebSocket */
//   connectRealtime() {
//     this.ws.connect();

//     this.ws.on<Order>('order.created').subscribe(order => {
//       const list = [order, ...this.orders$.getValue()];
//       this.orders$.next(list);
//     });

//     this.ws.on<Order>('order.updated').subscribe(order => {
//       const list = this.orders$.getValue().map(x => x.id === order.id ? order : x);
//       this.orders$.next(list);
//     });
//   }

//   /** Observable for components to subscribe */
//   getOrders() {
//     return this.orders$.asObservable();
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WebsocketService } from './websocket.service';

export interface Order {
  id: string;
  source: 'online' | 'in-store';
  status: 'Pending' | 'InProgress' | 'Ready' | 'Completed';
  items: {
    id: number;
    sku: number;
    name: string;
    price: number;
    qty: number;
    image: string;
  }[];
  total: number;
  customerName?: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private orders$ = new BehaviorSubject<Order[]>([]);
  private realtimeStarted = false;

  constructor(private http: HttpClient, private ws: WebsocketService) {
    // auto start realtime when service loads
    this.initRealtime();
  }

  /** Load all orders via REST */
  loadOrders() {
    const user = localStorage.getItem('user');
    if (!user) return;

    const email = JSON.parse(user).email;

    this.http.get<Order[]>(`${environment.apiUrl}/orders/email/${email}`)
      .pipe(tap(orders => this.orders$.next(orders)))
      .subscribe();
  }

  /** Create a new in-store order */
  createOrder(order: Partial<Order>) {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, order)
      .pipe(tap(o => {
        const list = [o, ...this.orders$.getValue()];
        this.orders$.next(list);
      }));
  }

  /** Update order status */
  updateStatus(id: string, status: Order['status']) {

  return this.http
    .patch<Order>(`${environment.apiUrl}/orders/${id}`, {
      status: status
    })
    .pipe(
      tap(o => {
        const updated = this.orders$.getValue().map(x => x.id === o.id ? o : x);
        this.orders$.next(updated);
      })
    );
}

  /** Setup real-time WebSocket listeners */
  private initRealtime() {
    if (this.realtimeStarted) return;
    this.realtimeStarted = true;

    this.ws.connect();

    // When order created somewhere (POS, mobile, admin…)
    this.ws.on<Order>('order_created').subscribe(order => {
      console.log('[WS] New Order Received', order);
      const list = [order, ...this.orders$.getValue()];
      this.orders$.next(list);
    });

    // When order updated anywhere
    this.ws.on<Order>('order_status_changed').subscribe(order => {
      console.log('[WS] Order Updated', order);
      const list = this.orders$.getValue().map(x => x.id === order.id ? order : x);
      this.orders$.next(list);
    });
  }

  /** Observable for components */
  getOrders() {
    return this.orders$.asObservable();
  }
}
