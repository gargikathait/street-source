import { Handler } from '@netlify/functions';

// In-memory orders database
let ordersDatabase: any[] = [
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
    actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    trackingId: 'TRK001'
  },
  {
    id: 'ORD002',
    vendorId: 'vendor_001',
    items: [
      {
        materialId: '2',
        materialName: 'Potatoes',
        supplierId: 'SUP004',
        supplierName: 'Delhi Fresh Vegetables',
        quantity: 15,
        unit: 'kg',
        price: 25,
        totalPrice: 375
      },
      {
        materialId: '3',
        materialName: 'Onions',
        supplierId: 'SUP006',
        supplierName: 'Maharashtra Onion Co.',
        quantity: 8,
        unit: 'kg',
        price: 35,
        totalPrice: 280
      }
    ],
    totalAmount: 655,
    deliveryCharges: 0,
    grandTotal: 655,
    status: 'shipped',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    deliveryAddress: 'Shop 22, Karol Bagh, New Delhi 110005',
    orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    trackingId: 'TRK002'
  }
];

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const pathSegments = event.path.split('/').filter(Boolean);
    
    switch (event.httpMethod) {
      case 'GET':
        // Get orders for a specific vendor or all orders
        const vendorId = pathSegments[2]; // /api/orders/vendor_001
        const orderId = pathSegments[1]; // /api/orders/ORD001

        if (orderId && orderId !== 'vendor_001') {
          // Get specific order
          const order = ordersDatabase.find(o => o.id === orderId);
          if (!order) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Order not found' })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: order })
          };
        }

        if (vendorId) {
          // Get orders for specific vendor
          const vendorOrders = ordersDatabase.filter(o => o.vendorId === vendorId);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
              success: true, 
              data: vendorOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
            })
          };
        }

        // Get all orders (admin view)
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            data: ordersDatabase.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
          })
        };

      case 'POST':
        // Create new order
        const orderData = JSON.parse(event.body || '{}');
        
        const newOrder = {
          id: `ORD${Date.now()}`,
          vendorId: orderData.vendorId || 'vendor_001',
          items: orderData.items || [],
          totalAmount: orderData.totalAmount || 0,
          deliveryCharges: orderData.deliveryCharges || 0,
          grandTotal: orderData.grandTotal || orderData.totalAmount || 0,
          status: 'pending',
          paymentMethod: orderData.paymentMethod || 'cod',
          paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
          deliveryAddress: orderData.deliveryAddress,
          orderDate: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          trackingId: `TRK${Date.now()}`,
          notes: orderData.notes
        };

        ordersDatabase.push(newOrder);

        // Simulate order processing after creation
        setTimeout(() => {
          updateOrderStatus(newOrder.id, 'confirmed');
        }, 5000);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, data: newOrder })
        };

      case 'PUT':
        // Update order or order status
        const updateOrderId = pathSegments[1];
        const updates = JSON.parse(event.body || '{}');
        
        const orderIndex = ordersDatabase.findIndex(o => o.id === updateOrderId);
        if (orderIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Order not found' })
          };
        }

        // Special handling for status updates
        if (pathSegments[2] === 'status') {
          ordersDatabase[orderIndex].status = updates.status;
          if (updates.status === 'delivered') {
            ordersDatabase[orderIndex].actualDelivery = new Date().toISOString();
            ordersDatabase[orderIndex].paymentStatus = 'paid';
          }
        } else {
          // General update
          ordersDatabase[orderIndex] = { ...ordersDatabase[orderIndex], ...updates };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: ordersDatabase[orderIndex] })
        };

      case 'DELETE':
        // Cancel order
        const cancelOrderId = pathSegments[1];
        const cancelIndex = ordersDatabase.findIndex(o => o.id === cancelOrderId);
        
        if (cancelIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Order not found' })
          };
        }

        if (['delivered', 'shipped'].includes(ordersDatabase[cancelIndex].status)) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, error: 'Cannot cancel order in current status' })
          };
        }

        ordersDatabase[cancelIndex].status = 'cancelled';
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: ordersDatabase[cancelIndex] })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error in orders API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};

// Helper function to update order status (simulate background processing)
function updateOrderStatus(orderId: string, newStatus: string) {
  const orderIndex = ordersDatabase.findIndex(o => o.id === orderId);
  if (orderIndex !== -1) {
    ordersDatabase[orderIndex].status = newStatus;
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  }
}
