import { Handler } from '@netlify/functions';

// Materials database with suppliers
const materialsDatabase = [
  {
    id: '1',
    name: 'Rice (Basmati)',
    category: 'Grains',
    description: 'Premium quality basmati rice',
    basePrice: 80,
    unit: 'kg',
    image: '/placeholder.svg',
    suppliers: [
      {
        id: 'SUP001',
        name: 'Mumbai Grains Wholesale',
        location: { latitude: 28.6448, longitude: 77.2167 },
        price: 78,
        quality: 4.8,
        distance: '2.5km',
        availability: 'In Stock',
        rating: 4.8,
        stockQuantity: 500,
        minimumQuantity: 10,
        verified: true,
        deliveryTime: '2-4 hours'
      },
      {
        id: 'SUP002',
        name: 'Delhi Fresh Supply',
        location: { latitude: 28.6519, longitude: 77.2315 },
        price: 82,
        quality: 4.5,
        distance: '5.2km',
        availability: 'In Stock',
        rating: 4.5,
        stockQuantity: 300,
        minimumQuantity: 5,
        verified: true,
        deliveryTime: '3-5 hours'
      },
      {
        id: 'SUP003',
        name: 'Rajasthan Rice Mills',
        location: { latitude: 28.6129, longitude: 77.2295 },
        price: 75,
        quality: 4.6,
        distance: '8.1km',
        availability: 'Limited',
        rating: 4.6,
        stockQuantity: 150,
        minimumQuantity: 20,
        verified: true,
        deliveryTime: '4-6 hours'
      }
    ]
  },
  {
    id: '2',
    name: 'Potatoes',
    category: 'Vegetables',
    description: 'Fresh potatoes for cooking',
    basePrice: 30,
    unit: 'kg',
    image: '/placeholder.svg',
    suppliers: [
      {
        id: 'SUP004',
        name: 'Delhi Fresh Vegetables',
        location: { latitude: 28.6692, longitude: 77.2265 },
        price: 25,
        quality: 4.2,
        distance: '1.8km',
        availability: 'In Stock',
        rating: 4.2,
        stockQuantity: 200,
        minimumQuantity: 5,
        verified: true,
        deliveryTime: '1-2 hours'
      },
      {
        id: 'SUP005',
        name: 'Punjab Potato Farm',
        location: { latitude: 28.7041, longitude: 77.1025 },
        price: 28,
        quality: 4.5,
        distance: '12km',
        availability: 'In Stock',
        rating: 4.5,
        stockQuantity: 400,
        minimumQuantity: 10,
        verified: true,
        deliveryTime: '3-4 hours'
      }
    ]
  },
  {
    id: '3',
    name: 'Onions',
    category: 'Vegetables',
    description: 'Fresh red onions',
    basePrice: 40,
    unit: 'kg',
    image: '/placeholder.svg',
    suppliers: [
      {
        id: 'SUP006',
        name: 'Maharashtra Onion Co.',
        location: { latitude: 28.6448, longitude: 77.2167 },
        price: 35,
        quality: 4.3,
        distance: '3.2km',
        availability: 'In Stock',
        rating: 4.3,
        stockQuantity: 300,
        minimumQuantity: 5,
        verified: true,
        deliveryTime: '2-3 hours'
      },
      {
        id: 'SUP007',
        name: 'Nashik Direct Supply',
        location: { latitude: 28.5355, longitude: 77.3910 },
        price: 38,
        quality: 4.6,
        distance: '15km',
        availability: 'In Stock',
        rating: 4.6,
        stockQuantity: 250,
        minimumQuantity: 8,
        verified: true,
        deliveryTime: '4-5 hours'
      }
    ]
  },
  {
    id: '4',
    name: 'Sunflower Oil',
    category: 'Oils',
    description: 'Refined sunflower cooking oil',
    basePrice: 150,
    unit: 'liter',
    image: '/placeholder.svg',
    suppliers: [
      {
        id: 'SUP008',
        name: 'Bangalore Oil Mills',
        location: { latitude: 28.6139, longitude: 77.2090 },
        price: 135,
        quality: 4.9,
        distance: '4.1km',
        availability: 'In Stock',
        rating: 4.9,
        stockQuantity: 100,
        minimumQuantity: 2,
        verified: true,
        deliveryTime: '2-4 hours'
      }
    ]
  },
  {
    id: '5',
    name: 'Turmeric Powder',
    category: 'Spices',
    description: 'Pure turmeric powder',
    basePrice: 180,
    unit: 'kg',
    image: '/placeholder.svg',
    suppliers: [
      {
        id: 'SUP009',
        name: 'Pune Spice Market',
        location: { latitude: 28.6519, longitude: 77.2315 },
        price: 170,
        quality: 4.7,
        distance: '3.5km',
        availability: 'In Stock',
        rating: 4.7,
        stockQuantity: 80,
        minimumQuantity: 1,
        verified: true,
        deliveryTime: '2-3 hours'
      }
    ]
  }
];

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const searchQuery = event.queryStringParameters?.search?.toLowerCase() || '';
    const category = event.queryStringParameters?.category;
    const latitude = event.queryStringParameters?.latitude;
    const longitude = event.queryStringParameters?.longitude;

    let filteredMaterials = [...materialsDatabase];

    // Filter by search query
    if (searchQuery) {
      filteredMaterials = filteredMaterials.filter(material =>
        material.name.toLowerCase().includes(searchQuery) ||
        material.description.toLowerCase().includes(searchQuery) ||
        material.category.toLowerCase().includes(searchQuery)
      );
    }

    // Filter by category
    if (category && category !== 'all') {
      filteredMaterials = filteredMaterials.filter(material =>
        material.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Calculate distances if user location is provided
    if (latitude && longitude) {
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);

      filteredMaterials = filteredMaterials.map(material => ({
        ...material,
        suppliers: material.suppliers.map(supplier => ({
          ...supplier,
          distance: `${calculateDistance(
            userLat,
            userLng,
            supplier.location.latitude,
            supplier.location.longitude
          )}km`
        })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
      }));
    }

    // Sort materials by relevance (can be improved with better scoring)
    if (searchQuery) {
      filteredMaterials.sort((a, b) => {
        const aRelevance = a.name.toLowerCase().indexOf(searchQuery);
        const bRelevance = b.name.toLowerCase().indexOf(searchQuery);
        return aRelevance - bRelevance;
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: filteredMaterials,
        count: filteredMaterials.length,
        query: searchQuery,
        category: category || 'all'
      })
    };

  } catch (error) {
    console.error('Error in materials API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};

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
