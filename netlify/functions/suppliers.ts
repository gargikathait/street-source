import { Handler } from '@netlify/functions';

// In-memory suppliers database
let suppliersDatabase: any[] = [
  {
    id: 'SUP001',
    name: 'Mumbai Grains Wholesale',
    businessName: 'Mumbai Grains Wholesale Pvt Ltd',
    category: 'Grains',
    email: 'info@mumbaigrains.com',
    phone: '+91 98765 12345',
    address: 'Plot 123, Grain Market, Mumbai 400001',
    location: {
      latitude: 28.6448,
      longitude: 77.2167,
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    rating: 4.8,
    totalReviews: 1250,
    verified: true,
    establishedYear: 2015,
    businessLicense: 'MH-WHS-2015-001',
    gstNumber: 'GST27ABCDE1234F1Z5',
    materials: [
      {
        materialId: '1',
        name: 'Rice (Basmati)',
        category: 'Grains',
        price: 78,
        unit: 'kg',
        minOrderQuantity: 10,
        maxOrderQuantity: 1000,
        stockQuantity: 5000,
        availability: 'In Stock',
        quality: 4.8,
        description: 'Premium quality aged basmati rice',
        specifications: {
          variety: 'Basmati 1121',
          origin: 'Punjab',
          packaging: '25kg sacks',
          shelfLife: '12 months'
        }
      },
      {
        materialId: '6',
        name: 'Wheat Flour',
        category: 'Grains',
        price: 42,
        unit: 'kg',
        minOrderQuantity: 5,
        maxOrderQuantity: 500,
        stockQuantity: 3000,
        availability: 'In Stock',
        quality: 4.5,
        description: 'Fresh wheat flour',
        specifications: {
          type: 'Whole Wheat',
          protein: '12%',
          packaging: '10kg bags',
          shelfLife: '6 months'
        }
      }
    ],
    deliveryOptions: {
      sameDay: true,
      nextDay: true,
      standard: true,
      minimumOrderValue: 500,
      freeDeliveryAbove: 2000,
      deliveryCharges: 50,
      deliveryRadius: 25
    },
    paymentMethods: ['cod', 'upi', 'netbanking', 'card'],
    workingHours: {
      monday: '9:00 AM - 7:00 PM',
      tuesday: '9:00 AM - 7:00 PM',
      wednesday: '9:00 AM - 7:00 PM',
      thursday: '9:00 AM - 7:00 PM',
      friday: '9:00 AM - 7:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: 'Closed'
    },
    certifications: ['ISO 9001', 'FSSAI', 'Organic Certified'],
    performance: {
      onTimeDelivery: 96.5,
      qualityScore: 4.8,
      responseTime: 2, // hours
      orderFulfillment: 98.2,
      customerSatisfaction: 4.7
    },
    contact: {
      primaryContact: 'Raj Sharma',
      designation: 'Sales Manager',
      phone: '+91 98765 12345',
      email: 'raj@mumbaigrains.com'
    },
    lastUpdated: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'SUP004',
    name: 'Delhi Fresh Vegetables',
    businessName: 'Delhi Fresh Vegetables Mart',
    category: 'Vegetables',
    email: 'orders@delhifresh.com',
    phone: '+91 98765 54321',
    address: 'Shop 45, Azadpur Mandi, Delhi 110033',
    location: {
      latitude: 28.6692,
      longitude: 77.2265,
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110033'
    },
    rating: 4.2,
    totalReviews: 850,
    verified: true,
    establishedYear: 2018,
    businessLicense: 'DL-VEG-2018-045',
    gstNumber: 'GST07FGHIJ5678K2L6',
    materials: [
      {
        materialId: '2',
        name: 'Potatoes',
        category: 'Vegetables',
        price: 25,
        unit: 'kg',
        minOrderQuantity: 5,
        maxOrderQuantity: 200,
        stockQuantity: 1500,
        availability: 'In Stock',
        quality: 4.2,
        description: 'Fresh farm potatoes',
        specifications: {
          variety: 'Red Potatoes',
          origin: 'Punjab',
          packaging: '20kg bags',
          shelfLife: '15 days'
        }
      },
      {
        materialId: '7',
        name: 'Tomatoes',
        category: 'Vegetables',
        price: 45,
        unit: 'kg',
        minOrderQuantity: 3,
        maxOrderQuantity: 100,
        stockQuantity: 800,
        availability: 'In Stock',
        quality: 4.3,
        description: 'Fresh red tomatoes',
        specifications: {
          variety: 'Hybrid Tomatoes',
          origin: 'Karnataka',
          packaging: '10kg crates',
          shelfLife: '7 days'
        }
      }
    ],
    deliveryOptions: {
      sameDay: true,
      nextDay: true,
      standard: true,
      minimumOrderValue: 200,
      freeDeliveryAbove: 1000,
      deliveryCharges: 30,
      deliveryRadius: 15
    },
    paymentMethods: ['cod', 'upi'],
    workingHours: {
      monday: '6:00 AM - 6:00 PM',
      tuesday: '6:00 AM - 6:00 PM',
      wednesday: '6:00 AM - 6:00 PM',
      thursday: '6:00 AM - 6:00 PM',
      friday: '6:00 AM - 6:00 PM',
      saturday: '6:00 AM - 4:00 PM',
      sunday: '6:00 AM - 12:00 PM'
    },
    certifications: ['FSSAI'],
    performance: {
      onTimeDelivery: 89.2,
      qualityScore: 4.2,
      responseTime: 1,
      orderFulfillment: 95.8,
      customerSatisfaction: 4.1
    },
    contact: {
      primaryContact: 'Suresh Kumar',
      designation: 'Owner',
      phone: '+91 98765 54321',
      email: 'suresh@delhifresh.com'
    },
    lastUpdated: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'SUP008',
    name: 'Bangalore Oil Mills',
    businessName: 'Bangalore Oil Mills Ltd',
    category: 'Oils',
    email: 'sales@bangaloreoils.com',
    phone: '+91 98765 98765',
    address: 'Industrial Area, Bangalore 560001',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    rating: 4.9,
    totalReviews: 2100,
    verified: true,
    establishedYear: 2010,
    businessLicense: 'KA-OIL-2010-008',
    gstNumber: 'GST29KLMNO9012P3Q7',
    materials: [
      {
        materialId: '4',
        name: 'Sunflower Oil',
        category: 'Oils',
        price: 135,
        unit: 'liter',
        minOrderQuantity: 2,
        maxOrderQuantity: 500,
        stockQuantity: 2000,
        availability: 'In Stock',
        quality: 4.9,
        description: 'Refined sunflower cooking oil',
        specifications: {
          type: 'Refined',
          brand: 'Pure Gold',
          packaging: '1L bottles',
          shelfLife: '18 months'
        }
      }
    ],
    deliveryOptions: {
      sameDay: false,
      nextDay: true,
      standard: true,
      minimumOrderValue: 1000,
      freeDeliveryAbove: 5000,
      deliveryCharges: 100,
      deliveryRadius: 50
    },
    paymentMethods: ['cod', 'upi', 'netbanking', 'card'],
    workingHours: {
      monday: '8:00 AM - 8:00 PM',
      tuesday: '8:00 AM - 8:00 PM',
      wednesday: '8:00 AM - 8:00 PM',
      thursday: '8:00 AM - 8:00 PM',
      friday: '8:00 AM - 8:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: 'Closed'
    },
    certifications: ['ISO 22000', 'FSSAI', 'HACCP'],
    performance: {
      onTimeDelivery: 98.5,
      qualityScore: 4.9,
      responseTime: 3,
      orderFulfillment: 99.1,
      customerSatisfaction: 4.8
    },
    contact: {
      primaryContact: 'Anand Rao',
      designation: 'Regional Manager',
      phone: '+91 98765 98765',
      email: 'anand@bangaloreoils.com'
    },
    lastUpdated: new Date().toISOString(),
    status: 'active'
  }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
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
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const pathSegments = event.path.split('/').filter(Boolean);
    const supplierId = pathSegments[2]; // /api/suppliers/SUP001
    const action = pathSegments[3]; // /api/suppliers/SUP001/materials

    switch (event.httpMethod) {
      case 'GET':
        if (action === 'materials') {
          // Get materials from specific supplier
          const supplier = suppliersDatabase.find(s => s.id === supplierId);
          if (!supplier) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Supplier not found' })
            };
          }

          const materialId = event.queryStringParameters?.materialId;
          if (materialId) {
            const material = supplier.materials.find((m: any) => m.materialId === materialId);
            if (!material) {
              return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ success: false, error: 'Material not found' })
              };
            }
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                success: true,
                data: { ...material, supplier: { id: supplier.id, name: supplier.name } }
              })
            };
          }

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: supplier.materials.map((material: any) => ({
                ...material,
                supplier: { id: supplier.id, name: supplier.name }
              }))
            })
          };
        }

        if (supplierId) {
          // Get specific supplier
          const supplier = suppliersDatabase.find(s => s.id === supplierId);
          if (!supplier) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Supplier not found' })
            };
          }

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: supplier })
          };
        }

        // Get all suppliers with filters
        const category = event.queryStringParameters?.category;
        const verified = event.queryStringParameters?.verified;
        const rating = event.queryStringParameters?.rating;
        const location = event.queryStringParameters?.location;
        const materialId = event.queryStringParameters?.materialId;
        const search = event.queryStringParameters?.search;

        let filteredSuppliers = [...suppliersDatabase];

        // Filter by category
        if (category) {
          filteredSuppliers = filteredSuppliers.filter(s => s.category === category);
        }

        // Filter by verification status
        if (verified !== undefined) {
          const isVerified = verified === 'true';
          filteredSuppliers = filteredSuppliers.filter(s => s.verified === isVerified);
        }

        // Filter by minimum rating
        if (rating) {
          const minRating = parseFloat(rating);
          filteredSuppliers = filteredSuppliers.filter(s => s.rating >= minRating);
        }

        // Filter by material availability
        if (materialId) {
          filteredSuppliers = filteredSuppliers.filter(s => 
            s.materials.some((m: any) => m.materialId === materialId)
          );
        }

        // Search by name or business name
        if (search) {
          const searchLower = search.toLowerCase();
          filteredSuppliers = filteredSuppliers.filter(s => 
            s.name.toLowerCase().includes(searchLower) ||
            s.businessName.toLowerCase().includes(searchLower)
          );
        }

        // Calculate distance if location provided
        if (location) {
          const [lat, lng] = location.split(',').map(Number);
          filteredSuppliers = filteredSuppliers.map(supplier => ({
            ...supplier,
            distance: calculateDistance(lat, lng, supplier.location.latitude, supplier.location.longitude)
          })).sort((a, b) => a.distance - b.distance);
        }

        // Sort by rating if no location provided
        if (!location) {
          filteredSuppliers.sort((a, b) => b.rating - a.rating);
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: filteredSuppliers,
            count: filteredSuppliers.length
          })
        };

      case 'POST':
        // Add new supplier
        const newSupplier = JSON.parse(event.body || '{}');
        
        const supplier = {
          id: `SUP${Date.now()}`,
          name: newSupplier.name,
          businessName: newSupplier.businessName,
          category: newSupplier.category,
          email: newSupplier.email,
          phone: newSupplier.phone,
          address: newSupplier.address,
          location: newSupplier.location,
          rating: 0,
          totalReviews: 0,
          verified: false,
          establishedYear: newSupplier.establishedYear,
          businessLicense: newSupplier.businessLicense,
          gstNumber: newSupplier.gstNumber,
          materials: newSupplier.materials || [],
          deliveryOptions: newSupplier.deliveryOptions || {
            sameDay: false,
            nextDay: true,
            standard: true,
            minimumOrderValue: 500,
            freeDeliveryAbove: 2000,
            deliveryCharges: 50,
            deliveryRadius: 25
          },
          paymentMethods: newSupplier.paymentMethods || ['cod'],
          workingHours: newSupplier.workingHours || {},
          certifications: newSupplier.certifications || [],
          performance: {
            onTimeDelivery: 0,
            qualityScore: 0,
            responseTime: 0,
            orderFulfillment: 0,
            customerSatisfaction: 0
          },
          contact: newSupplier.contact,
          lastUpdated: new Date().toISOString(),
          status: 'active'
        };

        suppliersDatabase.push(supplier);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            data: supplier,
            message: 'Supplier added successfully'
          })
        };

      case 'PUT':
        // Update supplier
        const updates = JSON.parse(event.body || '{}');
        const supplierIndex = suppliersDatabase.findIndex(s => s.id === supplierId);
        
        if (supplierIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Supplier not found' })
          };
        }

        suppliersDatabase[supplierIndex] = {
          ...suppliersDatabase[supplierIndex],
          ...updates,
          lastUpdated: new Date().toISOString()
        };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: suppliersDatabase[supplierIndex],
            message: 'Supplier updated successfully'
          })
        };

      case 'DELETE':
        // Delete/deactivate supplier
        const deleteIndex = suppliersDatabase.findIndex(s => s.id === supplierId);
        
        if (deleteIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Supplier not found' })
          };
        }

        // Soft delete - mark as inactive
        suppliersDatabase[deleteIndex].status = 'inactive';
        suppliersDatabase[deleteIndex].deactivatedAt = new Date().toISOString();

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Supplier deactivated successfully'
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
    console.error('Error in suppliers API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};
