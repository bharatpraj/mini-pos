import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MenuItem {
  id?: string;
  sku: string;
  name: string;
  price: number;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  private items$ = new BehaviorSubject<MenuItem[]>([]);

  constructor(private http: HttpClient) {}

  /** Load items from the API */
  loadItems() {
    this.http
      .get<MenuItem[]>(`${environment.apiUrl}/items`)
      .subscribe(items => {
        this.items$.next(items);
      });
  }

  /** Observable for components to listen to changes */
  getItems() {
    return this.items$.asObservable();
  }
}
