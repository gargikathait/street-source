import { Handler } from '@netlify/functions';

// In-memory notifications database
let notificationsDatabase: any[] = [
  {
    id: 'not_001',
    vendorId: 'vendor_001',
    title: 'Order Confirmed',
    message: 'Your order for Basmati Rice has been confirmed by Mumbai Grains',
    type: 'order',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'high',
    orderId: 'ORD002',
    actionUrl: '/orders/ORD002'
  },
  {
    id: 'not_002',
    title: 'Price Alert',
    message: 'Onion prices increased by 15% in your area',
    type: 'price',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'medium',
    materialId: '3'
  },
  {
    id: 'not_003',
    title: 'Group Order Available',
    message: 'New group order for bulk rice started in Karol Bagh area',
    type: 'promotion',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'low',
    groupOrderId: 'GRP001'
  },
  {
    id: 'not_004',
    title: 'Order Delivered Successfully',
    message: 'Your order #ORD001 for Rice (10kg) has been delivered to Karol Bagh',
    type: 'delivery',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'medium',
    orderId: 'ORD001'
  },
  {
    id: 'not_005',
    title: 'Payment Received',
    message: 'Payment of ₹850 received for order #ORD001',
    type: 'order',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'high',
    orderId: 'ORD001'
  },
  {
    id: 'not_006',
    title: 'New Supplier Available',
    message: 'Fresh Vegetables Co. is now delivering in your area with 15% discount',
    type: 'promotion',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'low',
    supplierId: 'SUP010'
  },
  {
    id: 'not_007',
    title: 'Weekly Report Ready',
    message: 'Your weekly business analytics report is now available',
    type: 'system',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'low',
    actionUrl: '/analytics'
  },
  {
    id: 'not_008',
    title: 'Low Stock Alert',
    message: 'Basmati Rice is running low in your preferred suppliers. Consider placing order soon.',
    type: 'price',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'high',
    materialId: '1'
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
    const vendorId = pathSegments[2]; // /api/notifications/vendor_001
    const notificationId = pathSegments[3]; // /api/notifications/vendor_001/not_001

    switch (event.httpMethod) {
      case 'GET':
        if (notificationId) {
          // Get specific notification
          const notification = notificationsDatabase.find(n => n.id === notificationId);
          if (!notification) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Notification not found' })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: notification })
          };
        }

        if (vendorId) {
          // Get notifications for specific vendor
          let vendorNotifications = notificationsDatabase.filter(n => 
            n.vendorId === vendorId || !n.vendorId // Include global notifications
          );

          // Apply filters
          const type = event.queryStringParameters?.type;
          const isRead = event.queryStringParameters?.isRead;
          const priority = event.queryStringParameters?.priority;
          const limit = event.queryStringParameters?.limit;

          if (type) {
            vendorNotifications = vendorNotifications.filter(n => n.type === type);
          }

          if (isRead !== undefined) {
            const readStatus = isRead === 'true';
            vendorNotifications = vendorNotifications.filter(n => n.isRead === readStatus);
          }

          if (priority) {
            vendorNotifications = vendorNotifications.filter(n => n.priority === priority);
          }

          // Sort by timestamp (newest first)
          vendorNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          // Apply limit
          if (limit) {
            vendorNotifications = vendorNotifications.slice(0, parseInt(limit));
          }

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: vendorNotifications,
              unreadCount: vendorNotifications.filter(n => !n.isRead).length
            })
          };
        }

        // Get all notifications (admin view)
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: notificationsDatabase.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          })
        };

      case 'POST':
        // Create new notification
        const notificationData = JSON.parse(event.body || '{}');
        
        const newNotification = {
          id: `not_${Date.now()}`,
          vendorId: notificationData.vendorId,
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type || 'system',
          timestamp: new Date().toISOString(),
          isRead: false,
          priority: notificationData.priority || 'medium',
          ...notificationData
        };

        notificationsDatabase.unshift(newNotification);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, data: newNotification })
        };

      case 'PUT':
        // Update notification (typically mark as read)
        const updateData = JSON.parse(event.body || '{}');
        const updateIndex = notificationsDatabase.findIndex(n => n.id === notificationId);
        
        if (updateIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Notification not found' })
          };
        }

        notificationsDatabase[updateIndex] = {
          ...notificationsDatabase[updateIndex],
          ...updateData
        };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: notificationsDatabase[updateIndex] })
        };

      case 'DELETE':
        // Delete notification
        const deleteIndex = notificationsDatabase.findIndex(n => n.id === notificationId);
        
        if (deleteIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Notification not found' })
          };
        }

        const deletedNotification = notificationsDatabase.splice(deleteIndex, 1)[0];

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: deletedNotification })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error in notifications API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};

// Helper function to create notification for order events
export function createOrderNotification(vendorId: string, orderId: string, type: string, status: string) {
  const notifications = {
    'order_confirmed': {
      title: 'Order Confirmed',
      message: `Your order #${orderId} has been confirmed and is being prepared`,
      type: 'order',
      priority: 'high'
    },
    'order_shipped': {
      title: 'Order Shipped',
      message: `Your order #${orderId} has been shipped and is on the way`,
      type: 'delivery',
      priority: 'medium'
    },
    'order_delivered': {
      title: 'Order Delivered',
      message: `Your order #${orderId} has been delivered successfully`,
      type: 'delivery',
      priority: 'medium'
    }
  };

  const notificationTemplate = notifications[type as keyof typeof notifications];
  if (notificationTemplate) {
    const notification = {
      id: `not_${Date.now()}`,
      vendorId,
      ...notificationTemplate,
      timestamp: new Date().toISOString(),
      isRead: false,
      orderId
    };
    
    notificationsDatabase.unshift(notification);
    return notification;
  }
  
  return null;
}
