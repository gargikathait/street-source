import { Handler } from '@netlify/functions';

// Mock analytics data generator
function generateAnalyticsData(vendorId?: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  
  return {
    vendorId: vendorId || 'vendor_001',
    period: {
      start: startOfMonth.toISOString(),
      end: now.toISOString(),
      type: 'monthly'
    },
    summary: {
      totalVendors: 247 + Math.floor(Math.random() * 50),
      activeOrders: 89 + Math.floor(Math.random() * 20),
      qualityScore: 87.5 + Math.random() * 10,
      costSavings: 47200 + Math.floor(Math.random() * 10000),
      totalRevenue: 156800 + Math.floor(Math.random() * 50000),
      ordersCount: 156 + Math.floor(Math.random() * 50),
      avgOrderValue: 1200 + Math.floor(Math.random() * 500)
    },
    trends: {
      revenueGrowth: 15.2 + Math.random() * 10,
      orderGrowth: 8.3 + Math.random() * 5,
      qualityTrend: '+0.2',
      customerSatisfaction: 4.6 + Math.random() * 0.4
    },
    topSuppliers: [
      {
        id: 'SUP001',
        name: 'Mumbai Grains Wholesale',
        orderCount: 45 + Math.floor(Math.random() * 20),
        revenue: 34500 + Math.floor(Math.random() * 10000),
        rating: 4.8,
        category: 'Grains'
      },
      {
        id: 'SUP004',
        name: 'Delhi Fresh Vegetables',
        orderCount: 38 + Math.floor(Math.random() * 15),
        revenue: 28900 + Math.floor(Math.random() * 8000),
        rating: 4.6,
        category: 'Vegetables'
      },
      {
        id: 'SUP008',
        name: 'Bangalore Oil Mills',
        orderCount: 32 + Math.floor(Math.random() * 12),
        revenue: 24200 + Math.floor(Math.random() * 6000),
        rating: 4.9,
        category: 'Oils'
      }
    ],
    topMaterials: [
      {
        materialId: '1',
        name: 'Rice (Basmati)',
        category: 'Grains',
        orderCount: 78 + Math.floor(Math.random() * 30),
        quantity: 450 + Math.floor(Math.random() * 100),
        unit: 'kg',
        revenue: 35400 + Math.floor(Math.random() * 10000)
      },
      {
        materialId: '2',
        name: 'Potatoes',
        category: 'Vegetables',
        orderCount: 65 + Math.floor(Math.random() * 25),
        quantity: 380 + Math.floor(Math.random() * 80),
        unit: 'kg',
        revenue: 9500 + Math.floor(Math.random() * 3000)
      },
      {
        materialId: '4',
        name: 'Sunflower Oil',
        category: 'Oils',
        orderCount: 42 + Math.floor(Math.random() * 20),
        quantity: 180 + Math.floor(Math.random() * 50),
        unit: 'liter',
        revenue: 24300 + Math.floor(Math.random() * 5000)
      }
    ],
    dailyRevenue: Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(now.getFullYear(), now.getMonth(), i + 1).toISOString().split('T')[0],
      revenue: 1500 + Math.floor(Math.random() * 2000),
      orders: 3 + Math.floor(Math.random() * 8)
    })),
    categoryBreakdown: [
      { category: 'Grains', percentage: 35 + Math.random() * 10, revenue: 54800 + Math.floor(Math.random() * 15000) },
      { category: 'Vegetables', percentage: 28 + Math.random() * 8, revenue: 43900 + Math.floor(Math.random() * 12000) },
      { category: 'Oils', percentage: 18 + Math.random() * 6, revenue: 28200 + Math.floor(Math.random() * 8000) },
      { category: 'Spices', percentage: 12 + Math.random() * 5, revenue: 18800 + Math.floor(Math.random() * 5000) },
      { category: 'Others', percentage: 7 + Math.random() * 3, revenue: 11100 + Math.floor(Math.random() * 3000) }
    ],
    monthlyComparison: {
      currentMonth: 156800 + Math.floor(Math.random() * 20000),
      previousMonth: 142300 + Math.floor(Math.random() * 18000),
      growth: 10.2 + Math.random() * 8,
      ordersCurrentMonth: 156 + Math.floor(Math.random() * 30),
      ordersPreviousMonth: 144 + Math.floor(Math.random() * 25)
    },
    performance: {
      deliverySuccess: 94.5 + Math.random() * 4,
      onTimeDelivery: 87.2 + Math.random() * 10,
      customerRetention: 76.8 + Math.random() * 15,
      avgDeliveryTime: 3.2 + Math.random() * 2
    }
  };
}

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ success: false, error: 'Method not allowed' })
      };
    }

    const vendorId = event.queryStringParameters?.vendorId;
    const period = event.queryStringParameters?.period || 'monthly';
    const startDate = event.queryStringParameters?.startDate;
    const endDate = event.queryStringParameters?.endDate;

    // Generate analytics data
    const analyticsData = generateAnalyticsData(vendorId);

    // Filter by date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      analyticsData.dailyRevenue = analyticsData.dailyRevenue.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate >= start && dayDate <= end;
      });
      
      analyticsData.period = {
        start: startDate,
        end: endDate,
        type: 'custom'
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: analyticsData,
        generated: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error in analytics API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};
