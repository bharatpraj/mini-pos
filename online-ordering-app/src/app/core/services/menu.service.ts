import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MenuItem } from '../models/menu-item.model';


@Injectable({ providedIn: 'root' })
export class MenuService {
  private firestore = inject(Firestore);
  private itemsCollection = collection(this.firestore, 'items');

  getItems(): Observable<MenuItem[]> {
    return collectionData(this.itemsCollection) as Observable<MenuItem[]>;
  }

  addItem(item: MenuItem) {
    return addDoc(this.itemsCollection, item);
  }
}
