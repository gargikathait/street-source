import { Handler } from '@netlify/functions';

// In-memory database simulation (in production, use a real database)
const vendorsDatabase = [
  {
    id: 'vendor_001',
    name: 'Radhika Shukla',
    businessName: 'Shukla Street Foods',
    email: 'radhika.shukla@example.com',
    phone: '+91 98765 43210',
    address: 'Shop 22, Karol Bagh, New Delhi 110005',
    location: { latitude: 28.6519, longitude: 77.2315 },
    businessType: 'Street Food Vendor',
    category: 'Food & Beverages',
    status: 'active',
    qualityScore: 92,
    pricing: 85,
    availability: 96,
    lastUpdated: new Date().toISOString(),
    registrationDate: '2023-01-15',
    businessLicense: 'DL-SF-2023-002',
    specialties: ['Chaat', 'Pani Puri', 'Dosa', 'South Indian'],
    operatingHours: '10:00 AM - 10:00 PM',
    totalOrders: 847,
    avgRating: 4.6,
    monthlyRevenue: 85000,
    joinedDate: 'January 2023',
    verificationStatus: 'Verified',
    subscriptionPlan: 'Premium'
  },
  {
    id: 'vendor_002',
    name: 'Amit Kumar',
    businessName: 'Kumar Chaat Corner',
    email: 'amit.kumar@example.com',
    phone: '+91 98765 43211',
    address: 'Shop 15, CP Market, New Delhi 110001',
    location: { latitude: 28.6328, longitude: 77.2197 },
    businessType: 'Street Food Vendor',
    category: 'Food & Beverages',
    status: 'active',
    qualityScore: 88,
    pricing: 90,
    availability: 94,
    lastUpdated: new Date().toISOString(),
    registrationDate: '2023-02-20',
    businessLicense: 'DL-SF-2023-015',
    specialties: ['Chaat', 'Samosa', 'Bhel Puri'],
    operatingHours: '9:00 AM - 11:00 PM',
    totalOrders: 632,
    avgRating: 4.4,
    monthlyRevenue: 72000,
    joinedDate: 'February 2023',
    verificationStatus: 'Verified',
    subscriptionPlan: 'Standard'
  },
  {
    id: 'vendor_003',
    name: 'Priya Sharma',
    businessName: 'Sharma Snacks',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43212',
    address: 'Shop 8, Lajpat Nagar, New Delhi 110024',
    location: { latitude: 28.5672, longitude: 77.2436 },
    businessType: 'Snack Vendor',
    category: 'Food & Beverages',
    status: 'active',
    qualityScore: 90,
    pricing: 82,
    availability: 98,
    lastUpdated: new Date().toISOString(),
    registrationDate: '2023-03-10',
    businessLicense: 'DL-SF-2023-028',
    specialties: ['Pakora', 'Sandwich', 'Juice'],
    operatingHours: '8:00 AM - 9:00 PM',
    totalOrders: 456,
    avgRating: 4.7,
    monthlyRevenue: 68000,
    joinedDate: 'March 2023',
    verificationStatus: 'Verified',
    subscriptionPlan: 'Standard'
  }
];

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        // Get all vendors or specific vendor
        const vendorId = event.queryStringParameters?.id;
        if (vendorId) {
          const vendor = vendorsDatabase.find(v => v.id === vendorId);
          if (!vendor) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Vendor not found' })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: vendor })
          };
        }

        // Apply filters
        let filteredVendors = [...vendorsDatabase];
        const category = event.queryStringParameters?.category;
        const status = event.queryStringParameters?.status;
        const location = event.queryStringParameters?.location;

        if (category) {
          filteredVendors = filteredVendors.filter(v => v.category === category);
        }
        if (status) {
          filteredVendors = filteredVendors.filter(v => v.status === status);
        }

        // Location-based filtering (simulate distance calculation)
        if (location) {
          const [lat, lng] = location.split(',').map(Number);
          filteredVendors = filteredVendors.map(vendor => ({
            ...vendor,
            distance: calculateDistance(lat, lng, vendor.location.latitude, vendor.location.longitude)
          })).sort((a, b) => a.distance - b.distance);
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: filteredVendors })
        };

      case 'POST':
        // Create new vendor
        const newVendor = JSON.parse(event.body || '{}');
        newVendor.id = `vendor_${Date.now()}`;
        newVendor.registrationDate = new Date().toISOString();
        newVendor.lastUpdated = new Date().toISOString();
        newVendor.status = 'active';
        
        vendorsDatabase.push(newVendor);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, data: newVendor })
        };

      case 'PUT':
        // Update vendor
        const updateId = event.path.split('/').pop();
        const updates = JSON.parse(event.body || '{}');
        const vendorIndex = vendorsDatabase.findIndex(v => v.id === updateId);
        
        if (vendorIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Vendor not found' })
          };
        }

        vendorsDatabase[vendorIndex] = {
          ...vendorsDatabase[vendorIndex],
          ...updates,
          lastUpdated: new Date().toISOString()
        };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: vendorsDatabase[vendorIndex] })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error in vendors API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};

// Utility function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in kilometers
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}
