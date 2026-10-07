import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Customer, Product, Order, OrderStatus, UserProfile } from '../types';

// ================= CUSTOMERS =================

export function subscribeToCustomers(
  callback: (customers: Customer[]) => void,
  onError?: (error: unknown) => void
) {
  const colRef = collection(db, 'customers');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const customers: Customer[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Customer, 'id'>),
      }));
      // Sort alphabetically by name
      customers.sort((a, b) => a.name.localeCompare(b.name));
      callback(customers);
    },
    (err) => {
      console.error('Customers subscription error:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, 'customers');
    }
  );
}

export async function addCustomer(customer: Omit<Customer, 'id'>): Promise<string> {
  const path = 'customers';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...customer,
      createdAt: customer.createdAt || new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateCustomer(id: string, customer: Partial<Customer>): Promise<void> {
  const path = `customers/${id}`;
  try {
    const docRef = doc(db, 'customers', id);
    await updateDoc(docRef, { ...customer });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  const path = `customers/${id}`;
  try {
    await deleteDoc(doc(db, 'customers', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================= PRODUCTS =================

export function subscribeToProducts(
  callback: (products: Product[]) => void,
  onError?: (error: unknown) => void
) {
  const colRef = collection(db, 'products');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const products: Product[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Product, 'id'>),
      }));
      // Sort alphabetically by name
      products.sort((a, b) => a.name.localeCompare(b.name));
      callback(products);
    },
    (err) => {
      console.error('Products subscription error:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, 'products');
    }
  );
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  const path = 'products';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...product,
      createdAt: product.createdAt || new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<void> {
  const path = `products/${id}`;
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, { ...product });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const path = `products/${id}`;
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================= ORDERS =================

export function subscribeToAllOrders(
  callback: (orders: Order[]) => void,
  onError?: (error: unknown) => void
) {
  const colRef = collection(db, 'orders');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Order, 'id'>),
      }));
      callback(orders);
    },
    (err) => {
      console.error('Orders subscription error:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, 'orders');
    }
  );
}

export function subscribeToSalesmanOrders(
  salesmanUid: string,
  callback: (orders: Order[]) => void,
  onError?: (error: unknown) => void
) {
  const colRef = collection(db, 'orders');
  const q = query(colRef, where('salesmanUid', '==', salesmanUid));
  return onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Order, 'id'>),
      }));
      // Sort newest first client-side to prevent composite index requirement
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(orders);
    },
    (err) => {
      console.error('Salesman orders subscription error:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, 'orders');
    }
  );
}

export async function submitOrder(orderData: Omit<Order, 'id' | 'orderCode'>): Promise<string> {
  const path = 'orders';
  try {
    const now = new Date();
    const dateFormatted = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(100 + Math.random() * 900); // 3 digits
    const orderCode = `ORD-${dateFormatted}-${randSuffix}`;

    const dateStr = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const fullOrder = {
      ...orderData,
      orderCode,
      dateStr,
      timeStr,
      createdAt: orderData.createdAt || now.toISOString(),
      status: 'NEW' as OrderStatus,
    };

    const docRef = await addDoc(collection(db, path), fullOrder);
    return orderCode;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ================= USERS / SALESMEN =================

export function subscribeToSalesmen(
  callback: (users: UserProfile[]) => void,
  onError?: (error: unknown) => void
) {
  const colRef = collection(db, 'users');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const users: UserProfile[] = snapshot.docs.map((d) => ({
        uid: d.id,
        ...(d.data() as Omit<UserProfile, 'uid'>),
      }));
      callback(users);
    },
    (err) => {
      console.error('Salesmen subscription error:', err);
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, 'users');
    }
  );
}

export async function saveUserProfile(user: UserProfile): Promise<void> {
  const path = `users/${user.uid}`;
  try {
    await setDoc(doc(db, 'users', user.uid), user, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ================= SEED SAMPLE DATA =================

export async function seedInitialDataIfEmpty(): Promise<boolean> {
  try {
    const productsSnap = await getDocs(collection(db, 'products'));
    if (productsSnap.empty) {
      const defaultProducts = [
        { name: 'Product A', code: 'P001', price: 120, active: true },
        { name: 'Product B', code: 'P002', price: 80, active: true },
        { name: 'Chakki Fresh Atta 10kg', code: 'P003', price: 390, active: true },
        { name: 'Refined Sunflower Oil 1L', code: 'P004', price: 135, active: true },
        { name: 'Basmati Rice 5kg', code: 'P005', price: 420, active: true },
        { name: 'Pure Cow Ghee 500ml', code: 'P006', price: 310, active: true },
        { name: 'CTC Premium Tea 500g', code: 'P007', price: 210, active: true },
        { name: 'Crystal Refined Sugar 1kg', code: 'P008', price: 45, active: true },
      ];
      for (const p of defaultProducts) {
        await addDoc(collection(db, 'products'), {
          ...p,
          createdAt: new Date().toISOString(),
        });
      }
    }

    const customersSnap = await getDocs(collection(db, 'customers'));
    if (customersSnap.empty) {
      const defaultCustomers = [
        { name: 'ABC Store', code: 'C001', phone: '9876543210', address: 'Main Bazaar, Shop #12', active: true },
        { name: 'Gupta Traders', code: 'C002', phone: '9812345678', address: 'Station Road, Near Post Office', active: true },
        { name: 'Krishna General Store', code: 'C003', phone: '9765432109', address: 'Gandhi Chowk', active: true },
        { name: 'New Bharat Kirana', code: 'C004', phone: '9823456781', address: 'Sector 4 Market', active: true },
        { name: 'Mahalaxmi Provision Store', code: 'C005', phone: '9845678901', address: 'Ring Road Corner', active: true },
      ];
      for (const c of defaultCustomers) {
        await addDoc(collection(db, 'customers'), {
          ...c,
          createdAt: new Date().toISOString(),
        });
      }
    }
    return true;
  } catch (error) {
    console.warn('Seed data skipped or failed:', error);
    return false;
  }
}
