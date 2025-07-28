import { Handler } from '@netlify/functions';

// Mock location data for different vendors
const locationDatabase: any = {
  'vendor_001': {
    latitude: 28.6519,
    longitude: 77.2315,
    address: 'Shop 22, Karol Bagh, New Delhi 110005',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110005',
    country: 'India',
    timezone: 'Asia/Kolkata',
    lastUpdated: new Date().toISOString()
  },
  'vendor_002': {
    latitude: 28.6328,
    longitude: 77.2197,
    address: 'Shop 15, CP Market, New Delhi 110001',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    country: 'India',
    timezone: 'Asia/Kolkata',
    lastUpdated: new Date().toISOString()
  },
  'vendor_003': {
    latitude: 28.5672,
    longitude: 77.2436,
    address: 'Shop 8, Lajpat Nagar, New Delhi 110024',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110024',
    country: 'India',
    timezone: 'Asia/Kolkata',
    lastUpdated: new Date().toISOString()
  }
};

// Function to get location by IP (mock implementation)
function getLocationByIP(ip: string) {
  // In a real implementation, you would use a geolocation service
  // For now, return default Delhi location
  return {
    latitude: 28.6448,
    longitude: 77.2167,
    address: 'New Delhi, India',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    country: 'India',
    timezone: 'Asia/Kolkata',
    source: 'ip_geolocation',
    accuracy: 'city',
    lastUpdated: new Date().toISOString()
  };
}

// Function to find nearby suppliers based on location
function findNearbySuppliers(latitude: number, longitude: number, radius: number = 25) {
  const suppliers = [
    {
      id: 'SUP001',
      name: 'Mumbai Grains Wholesale',
      location: { latitude: 28.6448, longitude: 77.2167 },
      category: 'Grains',
      verified: true,
      rating: 4.8
    },
    {
      id: 'SUP004',
      name: 'Delhi Fresh Vegetables',
      location: { latitude: 28.6692, longitude: 77.2265 },
      category: 'Vegetables',
      verified: true,
      rating: 4.2
    },
    {
      id: 'SUP006',
      name: 'Maharashtra Onion Co.',
      location: { latitude: 28.6448, longitude: 77.2167 },
      category: 'Vegetables',
      verified: true,
      rating: 4.3
    },
    {
      id: 'SUP008',
      name: 'Bangalore Oil Mills',
      location: { latitude: 28.6139, longitude: 77.2090 },
      category: 'Oils',
      verified: true,
      rating: 4.9
    },
    {
      id: 'SUP009',
      name: 'Pune Spice Market',
      location: { latitude: 28.6519, longitude: 77.2315 },
      category: 'Spices',
      verified: true,
      rating: 4.7
    }
  ];

  return suppliers.map(supplier => ({
    ...supplier,
    distance: calculateDistance(
      latitude,
      longitude,
      supplier.location.latitude,
      supplier.location.longitude
    )
  })).filter(supplier => supplier.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return Math.round(d * 10) / 10;
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
    const action = pathSegments[2]; // /api/location/current, /api/location/nearby

    switch (event.httpMethod) {
      case 'GET':
        if (action === 'current' || !action) {
          // Get current user location
          const vendorId = event.queryStringParameters?.vendorId || 'vendor_001';
          const useIP = event.queryStringParameters?.useIP === 'true';

          if (useIP) {
            // Get location by IP
            const clientIP = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || '127.0.0.1';
            const ipLocation = getLocationByIP(clientIP);
            
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                success: true,
                data: ipLocation
              })
            };
          }

          // Get saved location for vendor
          const location = locationDatabase[vendorId];
          if (!location) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Location not found' })
            };
          }

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: location
            })
          };
        }

        if (action === 'nearby') {
          // Find nearby suppliers
          const latitude = parseFloat(event.queryStringParameters?.latitude || '28.6519');
          const longitude = parseFloat(event.queryStringParameters?.longitude || '77.2315');
          const radius = parseInt(event.queryStringParameters?.radius || '25');
          const category = event.queryStringParameters?.category;

          let nearbySuppliers = findNearbySuppliers(latitude, longitude, radius);

          // Filter by category if specified
          if (category) {
            nearbySuppliers = nearbySuppliers.filter(supplier => 
              supplier.category.toLowerCase() === category.toLowerCase()
            );
          }

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: nearbySuppliers,
              center: { latitude, longitude },
              radius,
              count: nearbySuppliers.length
            })
          };
        }

        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Invalid endpoint' })
        };

      case 'POST':
        // Save/update location
        const locationData = JSON.parse(event.body || '{}');
        const vendorId = locationData.vendorId || 'vendor_001';

        const newLocation = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          address: locationData.address,
          city: locationData.city,
          state: locationData.state,
          pincode: locationData.pincode,
          country: locationData.country || 'India',
          timezone: locationData.timezone || 'Asia/Kolkata',
          lastUpdated: new Date().toISOString()
        };

        locationDatabase[vendorId] = newLocation;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: newLocation,
            message: 'Location updated successfully'
          })
        };

      case 'PUT':
        // Update specific location fields
        const updates = JSON.parse(event.body || '{}');
        const updateVendorId = updates.vendorId || 'vendor_001';

        if (!locationDatabase[updateVendorId]) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Location not found' })
          };
        }

        locationDatabase[updateVendorId] = {
          ...locationDatabase[updateVendorId],
          ...updates,
          lastUpdated: new Date().toISOString()
        };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: locationDatabase[updateVendorId],
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
    console.error('Error in location API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};
