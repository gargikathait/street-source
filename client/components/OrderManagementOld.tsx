import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useLanguage } from "@/hooks/use-language";
import {
  ShoppingCart,
  Package,
  Truck,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Eye,
  Plus,
  Minus,
  Calendar,
  User
} from "lucide-react";

interface OrderItem {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
}

interface Order {
  id: string;
  vendorId: string;
  supplierId: string;
  supplierName?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryAddress: string;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  trackingId: string;
  deliveryCharges: number;
  notes?: string;
}

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

function OrderManagement() {
  const {
    cart,
    orders,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    createOrder,
    fetchOrders,
    updateOrderStatus
  } = useCart();
  const { t } = useLanguage();
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("Shop 22, Karol Bagh, New Delhi 110005");
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card' | 'netbanking'>('cod');
  const [orderNotes, setOrderNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    await fetchOrders();
    setLoading(false);
  };

  const calculateCartTotal = () => {
    const subtotal = getCartTotal();
    const deliveryCharges = subtotal > 500 ? 0 : 50; // Free delivery above ₹500
    return { subtotal, deliveryCharges, total: subtotal + deliveryCharges };
  };

  const createOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty",
        variant: "destructive"
      });
      return;
    }

    if (!deliveryAddress) {
      toast({
        title: "Error",
        description: "Please enter delivery address",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Group cart items by supplier
      const ordersBySupplier = cart.reduce((acc, item) => {
        if (!acc[item.supplierId]) {
          acc[item.supplierId] = [];
        }
        acc[item.supplierId].push(item);
        return acc;
      }, {} as Record<string, CartItem[]>);

      // Create separate orders for each supplier
      for (const supplierId of Object.keys(ordersBySupplier)) {
        const supplierItems = ordersBySupplier[supplierId];
        const orderItems: OrderItem[] = supplierItems.map(item => ({
          id: `item_${Date.now()}_${Math.random()}`,
          materialId: item.materialId,
          materialName: item.materialName,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
          totalPrice: item.quantity * item.price
        }));

        const orderData = {
          vendorId: 'vendor_001',
          supplierId,
          items: orderItems,
          deliveryAddress,
          paymentMethod,
          notes: orderNotes
        };

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error);
        }
      }

      setCart([]);
      setShowCreateOrder(false);
      setDeliveryAddress("");
      setOrderNotes("");
      fetchOrders();

      toast({
        title: "Success",
        description: "Orders created successfully"
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const { subtotal, deliveryCharges, total } = calculateCartTotal();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage your orders and track deliveries</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showCreateOrder} onOpenChange={setShowCreateOrder}>
            <DialogTrigger asChild>
              <Button className="bg-vendor hover:bg-vendor/90">
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>
                  Review your cart and place order
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Cart Items */}
                <div>
                  <h3 className="font-semibold mb-4">Cart Items ({cart.length})</h3>
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Your cart is empty</p>
                      <p className="text-sm">Add items from the raw materials search</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.materialName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{item.supplierName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">₹{item.price}/{item.unit}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(item.materialId, item.supplierId, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(item.materialId, item.supplierId, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeFromCart(item.materialId, item.supplierId)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <>
                    {/* Order Summary */}
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-4">Order Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Charges:</span>
                          <span>₹{deliveryCharges}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>₹{total}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <Label htmlFor="address">Delivery Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter complete delivery address..."
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    {/* Payment Method */}
                    <div>
                      <Label htmlFor="payment">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cod">Cash on Delivery</SelectItem>
                          <SelectItem value="upi">UPI Payment</SelectItem>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="netbanking">Net Banking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Order Notes */}
                    <div>
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special instructions..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <Button 
                      onClick={createOrder} 
                      disabled={loading}
                      className="w-full bg-vendor hover:bg-vendor/90"
                    >
                      {loading ? 'Creating Order...' : `Place Order - ₹${total}`}
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-vendor mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Start by creating your first order</p>
              <Button onClick={() => setShowCreateOrder(true)} className="bg-vendor hover:bg-vendor/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Order #{order.id.slice(-8)}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <Badge className={order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">Total Amount</span>
                        <div className="font-bold text-lg">₹{order.totalAmount}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">Items</span>
                        <div className="font-medium">{order.items.length} items</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">Order Date</span>
                        <div className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">Delivery</span>
                        <div className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-1 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-4 h-4" />
                        <span>{order.paymentMethod.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 lg:ml-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowTrackingModal(true);
                      }}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Track Order
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Export addToCart function for use by other components */}
      {/* This would typically be done through props or context */}
      <script dangerouslySetInnerHTML={{
        __html: `window.addToOrderCart = ${addToCart.toString()}`
      }} />
    </div>
  );
}

export { OrderManagement };
