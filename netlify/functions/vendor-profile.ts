import { Handler } from '@netlify/functions';

// In-memory vendor profiles database
let vendorProfilesDatabase: any = {
  'vendor_001': {
    id: 'vendor_001',
    name: 'Radhika Shukla',
    businessName: 'Shukla Street Foods',
    email: 'radhika.shukla@example.com',
    phone: '+91 98765 43210',
    address: 'Shop 22, Karol Bagh, New Delhi 110005',
    businessType: 'Street Food Vendor',
    registrationDate: '2023-01-15',
    businessLicense: 'DL-SF-2023-002',
    avatar: '/placeholder.svg',
    specialties: ['Chaat', 'Pani Puri', 'Dosa', 'South Indian'],
    operatingHours: '10:00 AM - 10:00 PM',
    totalOrders: 847,
    avgRating: 4.6,
    monthlyRevenue: 85000,
    joinedDate: 'January 2023',
    verificationStatus: 'Verified',
    subscriptionPlan: 'Premium',
    location: {
      latitude: 28.6519,
      longitude: 77.2315
    },
    businessDetails: {
      gstNumber: 'GST123456789',
      panNumber: 'ABCDE1234F',
      bankAccount: {
        accountNumber: '****1234',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank'
      }
    },
    preferences: {
      language: 'en',
      currency: 'INR',
      notifications: {
        email: true,
        sms: true,
        push: true,
        orderUpdates: true,
        priceAlerts: true,
        promotions: false
      },
      deliveryPreferences: {
        preferredTime: 'morning',
        specialInstructions: 'Call before delivery'
      }
    },
    stats: {
      totalOrderValue: 654320,
      averageOrderValue: 1250,
      repeatCustomers: 234,
      customerSatisfaction: 4.6,
      onTimeDelivery: 92.5,
      returnRate: 2.1
    },
    documents: [
      {
        type: 'business_license',
        name: 'Business License',
        url: '/documents/business_license.pdf',
        verified: true,
        uploadDate: '2023-01-15'
      },
      {
        type: 'gst_certificate',
        name: 'GST Certificate',
        url: '/documents/gst_certificate.pdf',
        verified: true,
        uploadDate: '2023-01-20'
      }
    ],
    lastUpdated: new Date().toISOString()
  }
};

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
    const vendorId = pathSegments[2]; // /api/vendor/profile/vendor_001
    const section = pathSegments[4]; // /api/vendor/profile/vendor_001/preferences

    switch (event.httpMethod) {
      case 'GET':
        if (!vendorId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, error: 'Vendor ID is required' })
          };
        }

        const profile = vendorProfilesDatabase[vendorId];
        if (!profile) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Vendor profile not found' })
          };
        }

        // Return specific section if requested
        if (section && profile[section]) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: profile[section]
            })
          };
        }

        // Return full profile
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: profile
          })
        };

      case 'PUT':
        // Update vendor profile
        if (!vendorId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, error: 'Vendor ID is required' })
          };
        }

        const updates = JSON.parse(event.body || '{}');
        
        if (!vendorProfilesDatabase[vendorId]) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Vendor profile not found' })
          };
        }

        // Handle section-specific updates
        if (section) {
          if (!vendorProfilesDatabase[vendorId][section]) {
            vendorProfilesDatabase[vendorId][section] = {};
          }
          
          vendorProfilesDatabase[vendorId][section] = {
            ...vendorProfilesDatabase[vendorId][section],
            ...updates
          };
        } else {
          // Update main profile fields
          const allowedUpdates = [
            'name', 'businessName', 'email', 'phone', 'address', 
            'businessType', 'specialties', 'operatingHours', 'avatar'
          ];
          
          const filteredUpdates = Object.keys(updates)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
              obj[key] = updates[key];
              return obj;
            }, {} as any);

          vendorProfilesDatabase[vendorId] = {
            ...vendorProfilesDatabase[vendorId],
            ...filteredUpdates,
            lastUpdated: new Date().toISOString()
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: vendorProfilesDatabase[vendorId],
            message: 'Profile updated successfully'
          })
        };

      case 'POST':
        // Upload document or create new profile
        if (section === 'documents') {
          const documentData = JSON.parse(event.body || '{}');
          
          if (!vendorProfilesDatabase[vendorId]) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Vendor profile not found' })
            };
          }

          const newDocument = {
            type: documentData.type,
            name: documentData.name,
            url: documentData.url || '/documents/placeholder.pdf',
            verified: false,
            uploadDate: new Date().toISOString()
          };

          if (!vendorProfilesDatabase[vendorId].documents) {
            vendorProfilesDatabase[vendorId].documents = [];
          }

          vendorProfilesDatabase[vendorId].documents.push(newDocument);

          return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
              success: true,
              data: newDocument,
              message: 'Document uploaded successfully'
            })
          };
        }

        // Create new vendor profile
        const newProfile = JSON.parse(event.body || '{}');
        const newVendorId = newProfile.id || `vendor_${Date.now()}`;

        vendorProfilesDatabase[newVendorId] = {
          id: newVendorId,
          name: newProfile.name || '',
          businessName: newProfile.businessName || '',
          email: newProfile.email || '',
          phone: newProfile.phone || '',
          address: newProfile.address || '',
          businessType: newProfile.businessType || 'Street Food Vendor',
          registrationDate: new Date().toISOString(),
          businessLicense: newProfile.businessLicense || '',
          avatar: '/placeholder.svg',
          specialties: newProfile.specialties || [],
          operatingHours: newProfile.operatingHours || '9:00 AM - 9:00 PM',
          totalOrders: 0,
          avgRating: 0,
          monthlyRevenue: 0,
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          verificationStatus: 'Pending',
          subscriptionPlan: 'Basic',
          location: newProfile.location || { latitude: 28.6519, longitude: 77.2315 },
          preferences: {
            language: 'en',
            currency: 'INR',
            notifications: {
              email: true,
              sms: true,
              push: true,
              orderUpdates: true,
              priceAlerts: true,
              promotions: true
            }
          },
          stats: {
            totalOrderValue: 0,
            averageOrderValue: 0,
            repeatCustomers: 0,
            customerSatisfaction: 0,
            onTimeDelivery: 0,
            returnRate: 0
          },
          documents: [],
          lastUpdated: new Date().toISOString()
        };

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            data: vendorProfilesDatabase[newVendorId],
            message: 'Profile created successfully'
          })
        };

      case 'DELETE':
        // Delete document or deactivate profile
        if (section === 'documents') {
          const documentType = event.queryStringParameters?.type;
          
          if (!vendorProfilesDatabase[vendorId] || !documentType) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ success: false, error: 'Invalid request' })
            };
          }

          vendorProfilesDatabase[vendorId].documents = 
            vendorProfilesDatabase[vendorId].documents.filter((doc: any) => doc.type !== documentType);

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'Document deleted successfully'
            })
          };
        }

        // Deactivate vendor profile (soft delete)
        if (vendorProfilesDatabase[vendorId]) {
          vendorProfilesDatabase[vendorId].status = 'inactive';
          vendorProfilesDatabase[vendorId].deactivatedDate = new Date().toISOString();
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Profile deactivated successfully'
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
    console.error('Error in vendor profile API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};
