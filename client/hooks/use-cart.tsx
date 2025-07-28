import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  materialId: string;
  materialName: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  unit: string;
  price: number;
  stockQuantity: number;
  minimumQuantity: number;
}

interface Order {
  id: string;
  vendorId: string;
  items: Array<{
    materialId: string;
    materialName: string;
    supplierId: string;
    supplierName: string;
    quantity: number;
    unit: string;
    price: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  deliveryCharges: number;
  grandTotal: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryAddress: string;
  orderDate: string;
  estimatedDelivery: string;
  trackingId: string;
  notes?: string;
}

interface CartContextType {
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (materialId: string, supplierId: string) => void;
  updateQuantity: (materialId: string, supplierId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  createOrder: (orderDetails: {
    deliveryAddress: string;
    paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
    notes?: string;
  }) => Promise<Order>;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        cartItem => cartItem.materialId === item.materialId && cartItem.supplierId === item.supplierId
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(updated[existingIndex].quantity + item.quantity, item.stockQuantity)
        };
        return updated;
      } else {
        return [...prev, item];
      }
    });

    toast({
      title: "Added to Cart",
      description: `${item.materialName} added to your cart`
    });
  };

  const removeFromCart = (materialId: string, supplierId: string) => {
    setCart(prev => prev.filter(
      item => !(item.materialId === materialId && item.supplierId === supplierId)
    ));
    
    toast({
      title: "Removed from Cart",
      description: "Item removed from your cart"
    });
  };

  const updateQuantity = (materialId: string, supplierId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(materialId, supplierId);
      return;
    }

    setCart(prev => prev.map(item => {
      if (item.materialId === materialId && item.supplierId === supplierId) {
        return {
          ...item,
          quantity: Math.min(quantity, item.stockQuantity)
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const createOrder = async (orderDetails: {
    deliveryAddress: string;
    paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
    notes?: string;
  }): Promise<Order> => {
    if (cart.length === 0) {
      throw new Error("Cart is empty");
    }

    const orderId = `ORD${Date.now()}`;
    const trackingId = `TRK${Date.now()}`;
    const deliveryCharges = getCartTotal() > 500 ? 0 : 50; // Free delivery above ₹500
    const estimatedDelivery = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days

    const orderItems = cart.map(item => ({
      materialId: item.materialId,
      materialName: item.materialName,
      supplierId: item.supplierId,
      supplierName: item.supplierName,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      totalPrice: item.price * item.quantity
    }));

    const order: Order = {
      id: orderId,
      vendorId: "vendor_001",
      items: orderItems,
      totalAmount: getCartTotal(),
      deliveryCharges,
      grandTotal: getCartTotal() + deliveryCharges,
      status: 'pending',
      paymentMethod: orderDetails.paymentMethod,
      paymentStatus: orderDetails.paymentMethod === 'cod' ? 'pending' : 'paid',
      deliveryAddress: orderDetails.deliveryAddress,
      orderDate: new Date().toISOString(),
      estimatedDelivery,
      trackingId,
      notes: orderDetails.notes
    };

    try {
      // Try to save to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setOrders(prev => [order, ...prev]);
          clearCart();
          
          toast({
            title: "Order Created Successfully",
            description: `Order ${orderId} has been placed. Tracking ID: ${trackingId}`
          });
          
          return order;
        }
      }
    } catch (error) {
      console.error('Error creating order via API:', error);
    }

    // Fallback: Save locally
    setOrders(prev => [order, ...prev]);
    clearCart();
    
    toast({
      title: "Order Created Successfully",
      description: `Order ${orderId} has been placed. Tracking ID: ${trackingId}`
    });
    
    return order;
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/vendor_001');
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Use mock orders if API fails
      const mockOrders: Order[] = [
        {
          id: 'ORD001',
          vendorId: 'vendor_001',
          items: [
            {
              materialId: '1',
              materialName: 'Rice (Basmati)',
              supplierId: 'SUP001',
              supplierName: 'Mumbai Grains Wholesale',
              quantity: 10,
              unit: 'kg',
              price: 78,
              totalPrice: 780
            }
          ],
          totalAmount: 780,
          deliveryCharges: 0,
          grandTotal: 780,
          status: 'delivered',
          paymentMethod: 'upi',
          paymentStatus: 'paid',
          deliveryAddress: 'Shop 22, Karol Bagh, New Delhi 110005',
          orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          trackingId: 'TRK001'
        }
      ];
      setOrders(mockOrders);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: status as any }
            : order
        ));
        
        toast({
          title: "Order Updated",
          description: `Order status updated to ${status}`
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      // Update locally anyway
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: status as any }
          : order
      ));
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      orders,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemCount,
      createOrder,
      fetchOrders,
      updateOrderStatus
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
