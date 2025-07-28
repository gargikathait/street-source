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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  User,
  Trash2
} from "lucide-react";

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

  const handleCreateOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to cart before creating an order",
        variant: "destructive"
      });
      return;
    }

    if (!deliveryAddress.trim()) {
      toast({
        title: "Delivery address required",
        description: "Please enter a delivery address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await createOrder({
        deliveryAddress,
        paymentMethod,
        notes: orderNotes
      });

      setOrderNotes("");
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
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
      <Tabs defaultValue="cart" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cart" className="flex items-center">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart ({cart.length})
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center">
            <Package className="w-4 h-4 mr-2" />
            My Orders ({orders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Shopping Cart
              </CardTitle>
              <CardDescription>
                Review your items and place an order
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Your cart is empty</p>
                  <p>Browse raw materials and add items to your cart</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={`${item.materialId}-${item.supplierId}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.materialName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Supplier: {item.supplierName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          ₹{item.price}/{item.unit}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.materialId, item.supplierId, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.materialId, item.supplierId, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.materialId, item.supplierId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Cart Summary */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charges:</span>
                      <span>₹{deliveryCharges.toFixed(2)}</span>
                    </div>
                    {subtotal > 500 && (
                      <div className="text-sm text-green-600">
                        🎉 Free delivery on orders above ₹500!
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order Form */}
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <Label htmlFor="address">Delivery Address</Label>
                      <Textarea
                        id="address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Enter your delivery address"
                        className="mt-1"
                      />
                    </div>

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

                    <div>
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Any special instructions for your order"
                        className="mt-1"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={clearCart}
                        className="flex-1"
                      >
                        Clear Cart
                      </Button>
                      <Button
                        onClick={handleCreateOrder}
                        disabled={loading}
                        className="flex-1 bg-vendor hover:bg-vendor/90"
                      >
                        {loading ? "Placing Order..." : "Place Order"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                My Orders
              </CardTitle>
              <CardDescription>
                Track and manage your orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-b-2 border-vendor mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No orders yet</p>
                  <p>Place your first order to see it here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            Order #{order.id}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Placed on {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Tracking: {order.trackingId}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                            ₹{order.grandTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Items:</p>
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                            <span>{item.materialName} ({item.quantity} {item.unit})</span>
                            <span>₹{item.totalPrice.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span>{order.deliveryAddress}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4" />
                        <span>
                          Expected delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Track Order
                        </Button>
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          >
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { OrderManagement };
