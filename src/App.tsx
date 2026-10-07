import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { SalesmanHome } from './components/Salesman/SalesmanHome';
import { SelectCustomer } from './components/Salesman/SelectCustomer';
import { ProductCatalog } from './components/Salesman/ProductCatalog';
import { CartReview } from './components/Salesman/CartReview';
import { OrderConfirmModal } from './components/Salesman/OrderConfirmModal';
import { OrderSuccess } from './components/Salesman/OrderSuccess';
import { SalesmanOrders } from './components/Salesman/SalesmanOrders';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import {
  subscribeToCustomers,
  subscribeToProducts,
  subscribeToAllOrders,
  subscribeToSalesmanOrders,
  subscribeToSalesmen,
  submitOrder,
} from './services/db';
import { Customer, Product, Order, UserProfile } from './types';
import { Loader2 } from 'lucide-react';

type SalesmanStep =
  | 'home'
  | 'select_customer'
  | 'select_products'
  | 'cart'
  | 'success'
  | 'my_orders';

function MainApp() {
  const { currentUser, userProfile, isAdmin, activeRole, loading: authLoading } = useAuth();

  // Master Data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesmen, setSalesmen] = useState<UserProfile[]>([]);

  // Salesman Order Flow State
  const [currentStep, setCurrentStep] = useState<SalesmanStep>('home');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [submittedOrderCode, setSubmittedOrderCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Subscriptions
  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to active customers
    const unsubCust = subscribeToCustomers((data) => setCustomers(data));

    // Subscribe to active products
    const unsubProd = subscribeToProducts((data) => setProducts(data));

    // Subscribe to orders
    let unsubOrders: () => void;
    if (isAdmin) {
      unsubOrders = subscribeToAllOrders((data) => setOrders(data));
    } else {
      unsubOrders = subscribeToSalesmanOrders(currentUser.uid, (data) => setOrders(data));
    }

    // Subscribe to salesmen if admin
    let unsubSalesmen: () => void = () => {};
    if (isAdmin) {
      unsubSalesmen = subscribeToSalesmen((data) => setSalesmen(data));
    }

    return () => {
      unsubCust();
      unsubProd();
      if (unsubOrders) unsubOrders();
      unsubSalesmen();
    };
  }, [currentUser, isAdmin]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-slate-600 font-semibold text-sm">Loading A.R. Enterprise...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen />;
  }

  // Handle Order Quantity Updates
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setProductQuantities((prev) => {
      const updated = { ...prev };
      if (quantity <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = quantity;
      }
      return updated;
    });
  };

  // Start a fresh new order
  const handleStartNewOrder = () => {
    setSelectedCustomer(null);
    setProductQuantities({});
    setErrorMessage(null);
    setCurrentStep('select_customer');
  };

  // Select customer and advance to products
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentStep('select_products');
  };

  // Proceed to Cart Review
  const handleProceedToCart = () => {
    const selectedCount = Object.values(productQuantities).filter((q) => q > 0).length;
    if (selectedCount === 0) {
      setErrorMessage('Please select at least one product before reviewing cart.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep('cart');
  };

  // Final Order Submission
  const handleConfirmSubmitOrder = async () => {
    if (!selectedCustomer) {
      setErrorMessage('Customer is missing. Please select customer again.');
      setIsConfirmModalOpen(false);
      return;
    }

    const orderItems = products
      .filter((p) => (productQuantities[p.id] || 0) > 0)
      .map((p) => {
        const qty = productQuantities[p.id] || 0;
        return {
          productId: p.id,
          productCode: p.code,
          productName: p.name,
          price: p.price,
          quantity: qty,
          total: qty * p.price,
        };
      });

    if (orderItems.length === 0) {
      setErrorMessage('Please select at least one product.');
      setIsConfirmModalOpen(false);
      return;
    }

    const grandTotal = orderItems.reduce((acc, item) => acc + item.total, 0);
    const totalUnits = orderItems.reduce((acc, item) => acc + item.quantity, 0);

    try {
      setSubmittingOrder(true);
      const generatedCode = await submitOrder({
        salesmanUid: currentUser.uid,
        salesmanName: userProfile?.name || currentUser.displayName || 'Salesman',
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        customerCode: selectedCustomer.code,
        customerPhone: selectedCustomer.phone || '',
        items: orderItems,
        totalAmount: grandTotal,
        totalQuantity: totalUnits,
        status: 'NEW',
        createdAt: new Date().toISOString(),
      });

      setSubmittedOrderCode(generatedCode);
      setIsConfirmModalOpen(false);
      setCurrentStep('success');
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('Unable to submit order right now. Please check your network and try again.');
      setIsConfirmModalOpen(false);
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Calculate current cart totals for modal
  const cartItemsCount = Object.values(productQuantities).filter((q) => q > 0).length;
  const currentTotalAmount = products.reduce((acc, p) => {
    const qty = productQuantities[p.id] || 0;
    return acc + qty * p.price;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="max-w-md mx-auto mt-3 px-4">
            <div className="bg-amber-100 border border-amber-300 text-amber-900 px-4 py-2.5 rounded-xl text-xs flex justify-between items-center shadow-xs">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="font-bold ml-2 text-amber-800 hover:text-amber-950"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* ADMIN MODE */}
        {isAdmin && activeRole === 'admin' ? (
          <AdminDashboard
            orders={orders}
            products={products}
            customers={customers}
            salesmen={salesmen}
          />
        ) : (
          /* SALESMAN WORKFLOW */
          <div>
            {currentStep === 'home' && (
              <SalesmanHome
                orders={orders}
                onStartNewOrder={handleStartNewOrder}
                onViewMyOrders={() => setCurrentStep('my_orders')}
              />
            )}

            {currentStep === 'select_customer' && (
              <SelectCustomer
                customers={customers}
                onSelectCustomer={handleSelectCustomer}
                onBack={() => setCurrentStep('home')}
              />
            )}

            {currentStep === 'select_products' && selectedCustomer && (
              <ProductCatalog
                customer={selectedCustomer}
                products={products}
                quantities={productQuantities}
                onUpdateQuantity={handleUpdateQuantity}
                onProceedToCart={handleProceedToCart}
                onChangeCustomer={() => setCurrentStep('select_customer')}
              />
            )}

            {currentStep === 'cart' && selectedCustomer && (
              <CartReview
                customer={selectedCustomer}
                products={products}
                quantities={productQuantities}
                onUpdateQuantity={handleUpdateQuantity}
                onBackToProducts={() => setCurrentStep('select_products')}
                onOpenConfirmModal={() => setIsConfirmModalOpen(true)}
              />
            )}

            {currentStep === 'success' && selectedCustomer && (
              <OrderSuccess
                orderCode={submittedOrderCode}
                customerName={selectedCustomer.name}
                totalAmount={currentTotalAmount}
                onNewOrder={handleStartNewOrder}
                onViewMyOrders={() => setCurrentStep('my_orders')}
              />
            )}

            {currentStep === 'my_orders' && (
              <SalesmanOrders
                orders={orders}
                onBackToHome={() => setCurrentStep('home')}
                onStartNewOrder={handleStartNewOrder}
              />
            )}

            {/* Order Confirmation Modal */}
            {selectedCustomer && (
              <OrderConfirmModal
                isOpen={isConfirmModalOpen}
                customer={selectedCustomer}
                totalAmount={currentTotalAmount}
                totalItems={cartItemsCount}
                submitting={submittingOrder}
                onConfirm={handleConfirmSubmitOrder}
                onCancel={() => setIsConfirmModalOpen(false)}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
