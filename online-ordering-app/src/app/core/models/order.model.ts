export interface Order {
  id?: string;
  customerName: string;
  status: 'Pending' | 'In Progress' | 'Ready' | 'Completed';
  items: { name: string; qty: number; price: number }[];
  total: number;
  createdAt?: Date;
}
