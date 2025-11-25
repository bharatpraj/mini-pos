import { MenuItem } from "./menu-item.model";

export interface CartItem extends MenuItem {
  qty: number;
}