import { Handler } from '@netlify/functions';

// Mock tracking data
const trackingDatabase: any = {
  'ORD001': {
    orderId: 'ORD001',
    trackingId: 'TRK001',
    currentStatus: 'delivered',
    estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryPartner: {
      id: 'DP001',
      name: 'Ravi Kumar',
      phone: '+91 98765 43210',
      rating: 4.8,
      vehicleNumber: 'DL 8C AB 1234',
      photo: '/placeholder.svg'
    },
    currentLocation: {
      latitude: 28.6519,
      longitude: 77.2315,
      address: 'Shop 22, Karol Bagh, New Delhi 110005'
    },
    destinationLocation: {
      latitude: 28.6519,
      longitude: 77.2315,
      address: 'Shop 22, Karol Bagh, New Delhi 110005'
    },
    updates: [
      {
        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        status: 'Order Confirmed',
        location: 'Mumbai Grains Wholesale',
        description: 'Your order has been confirmed and is being prepared',
        icon: 'CheckCircle'
      },
      {
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        status: 'Order Packed',
        location: 'Mumbai Grains Warehouse',
        description: 'Your order has been packed and ready for dispatch',
        icon: 'Package'
      },
      {
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        status: 'Out for Delivery',
        location: 'Delhi Distribution Center',
        description: 'Your order is out for delivery with delivery partner Ravi Kumar',
        icon: 'Truck'
      },
      {
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Delivered',
        location: 'Karol Bagh, New Delhi',
        description: 'Order delivered successfully to your location',
        icon: 'CheckCircle'
      }
    ],
    isLiveTracking: false
  },
  'ORD002': {
    orderId: 'ORD002',
    trackingId: 'TRK002',
    currentStatus: 'shipped',
    estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    deliveryPartner: {
      id: 'DP002',
      name: 'Vikram Singh',
      phone: '+91 98765 43211',
      rating: 4.6,
      vehicleNumber: 'DL 9B CD 5678',
      photo: '/placeholder.svg'
    },
    currentLocation: {
      latitude: 28.6448,
      longitude: 77.2167,
      address: 'Connaught Place, New Delhi'
    },
    destinationLocation: {
      latitude: 28.6519,
      longitude: 77.2315,
      address: 'Shop 22, Karol Bagh, New Delhi 110005'
    },
    updates: [
      {
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'Order Confirmed',
        location: 'Delhi Fresh Vegetables',
        description: 'Your order has been confirmed and is being prepared',
        icon: 'CheckCircle'
      },
      {
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'Order Packed',
        location: 'Delhi Fresh Vegetables Warehouse',
        description: 'Your order has been packed and ready for dispatch',
        icon: 'Package'
      },
      {
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'Out for Delivery',
        location: 'Delhi Distribution Center',
        description: 'Your order is out for delivery with delivery partner Vikram Singh',
        icon: 'Truck'
      },
      {
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'Nearby Your Location',
        location: 'Connaught Place, New Delhi',
        description: 'Delivery partner is nearby your location. Expected delivery in 30 minutes',
        icon: 'Navigation'
      }
    ],
    isLiveTracking: true
  }
};

// Function to generate real-time tracking updates
function generateTrackingData(orderId: string) {
  // If we have predefined data, use it
  if (trackingDatabase[orderId]) {
    return trackingDatabase[orderId];
  }

  // Generate dynamic tracking data for new orders
  const trackingId = `TRK${orderId.substring(3)}`;
  const statuses = ['confirmed', 'preparing', 'packed', 'shipped', 'out_for_delivery'];
  const currentStatusIndex = Math.floor(Math.random() * statuses.length);
  const currentStatus = statuses[currentStatusIndex];

  const deliveryPartners = [
    { id: 'DP001', name: 'Ravi Kumar', phone: '+91 98765 43210', rating: 4.8, vehicleNumber: 'DL 8C AB 1234' },
    { id: 'DP002', name: 'Vikram Singh', phone: '+91 98765 43211', rating: 4.6, vehicleNumber: 'DL 9B CD 5678' },
    { id: 'DP003', name: 'Amit Sharma', phone: '+91 98765 43212', rating: 4.7, vehicleNumber: 'DL 7A EF 9012' }
  ];

  const randomPartner = deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)];

  // Generate location updates based on delivery progress
  const locations = [
    { lat: 28.6448, lng: 77.2167, address: 'Supplier Warehouse' },
    { lat: 28.6328, lng: 77.2197, address: 'Distribution Center' },
    { lat: 28.6420, lng: 77.2280, address: 'Transit Hub' },
    { lat: 28.6500, lng: 77.2300, address: 'Near Delivery Location' },
    { lat: 28.6519, lng: 77.2315, address: 'Delivery Location' }
  ];

  const currentLocationIndex = Math.min(currentStatusIndex, locations.length - 1);
  const currentLocation = locations[currentLocationIndex];

  return {
    orderId,
    trackingId,
    currentStatus,
    estimatedDelivery: new Date(Date.now() + (5 - currentStatusIndex) * 2 * 60 * 60 * 1000).toISOString(),
    deliveryPartner: randomPartner,
    currentLocation: {
      latitude: currentLocation.lat,
      longitude: currentLocation.lng,
      address: currentLocation.address
    },
    destinationLocation: {
      latitude: 28.6519,
      longitude: 77.2315,
      address: 'Shop 22, Karol Bagh, New Delhi 110005'
    },
    updates: statuses.slice(0, currentStatusIndex + 1).map((status, index) => ({
      timestamp: new Date(Date.now() - (currentStatusIndex - index) * 2 * 60 * 60 * 1000).toISOString(),
      status: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      location: locations[index]?.address || 'Processing Center',
      description: getStatusDescription(status, randomPartner.name),
      icon: getStatusIcon(status)
    })),
    isLiveTracking: currentStatusIndex >= 3 // Live tracking when shipped or out for delivery
  };
}

function getStatusDescription(status: string, partnerName: string): string {
  const descriptions = {
    'confirmed': 'Your order has been confirmed and is being prepared',
    'preparing': 'Your order is being prepared by the supplier',
    'packed': 'Your order has been packed and ready for dispatch',
    'shipped': `Your order is shipped and assigned to delivery partner ${partnerName}`,
    'out_for_delivery': `Your order is out for delivery with ${partnerName}`
  };
  return descriptions[status as keyof typeof descriptions] || 'Order status updated';
}

function getStatusIcon(status: string): string {
  const icons = {
    'confirmed': 'CheckCircle',
    'preparing': 'Clock',
    'packed': 'Package',
    'shipped': 'Truck',
    'out_for_delivery': 'Navigation'
  };
  return icons[status as keyof typeof icons] || 'Clock';
}

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const pathSegments = event.path.split('/').filter(Boolean);
    const orderId = pathSegments[2]; // /api/tracking/ORD001

    switch (event.httpMethod) {
      case 'GET':
        if (!orderId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, error: 'Order ID is required' })
          };
        }

        const trackingData = generateTrackingData(orderId);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: trackingData,
            lastUpdated: new Date().toISOString()
          })
        };

      case 'POST':
        // Update tracking status (used by delivery partners)
        const updateData = JSON.parse(event.body || '{}');
        
        if (trackingDatabase[orderId]) {
          // Add new update to existing tracking data
          trackingDatabase[orderId].updates.push({
            timestamp: new Date().toISOString(),
            status: updateData.status,
            location: updateData.location,
            description: updateData.description,
            icon: getStatusIcon(updateData.status.toLowerCase().replace(' ', '_'))
          });

          trackingDatabase[orderId].currentStatus = updateData.status;
          
          if (updateData.currentLocation) {
            trackingDatabase[orderId].currentLocation = updateData.currentLocation;
          }
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Tracking updated successfully'
          })
        };

      case 'PUT':
        // Update delivery partner location (real-time tracking)
        const locationUpdate = JSON.parse(event.body || '{}');
        
        if (trackingDatabase[orderId]) {
          trackingDatabase[orderId].currentLocation = {
            latitude: locationUpdate.latitude,
            longitude: locationUpdate.longitude,
            address: locationUpdate.address || trackingDatabase[orderId].currentLocation.address
          };
          
          trackingDatabase[orderId].lastLocationUpdate = new Date().toISOString();
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Location updated successfully'
          })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error in tracking API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};
