export type OrderStatus = 'NEW' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  active: boolean;
  createdAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  code: string;
  phone?: string;
  address?: string;
  active: boolean;
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  productCode: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderCode: string;
  salesmanUid: string;
  salesmanName: string;
  customerId: string;
  customerName: string;
  customerCode: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  totalQuantity: number;
  status: OrderStatus;
  createdAt: string;
  dateStr?: string;
  timeStr?: string;
  notes?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'salesman';
  status: 'active' | 'inactive';
  createdAt?: string;
}
