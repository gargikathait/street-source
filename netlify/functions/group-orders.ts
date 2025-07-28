import { Handler } from '@netlify/functions';

// In-memory group orders database
let groupOrdersDatabase: any[] = [
  {
    id: 'GRP001',
    title: 'Bulk Rice Order - Karol Bagh Area',
    description: 'Group order for premium basmati rice. Get 15% discount on bulk orders!',
    creatorId: 'vendor_002',
    creatorName: 'Amit Kumar',
    targetAmount: 5000,
    currentAmount: 3200,
    participants: [
      {
        vendorId: 'vendor_002',
        vendorName: 'Amit Kumar',
        businessName: 'Kumar Chaat Corner',
        items: [
          {
            materialId: '1',
            materialName: 'Rice (Basmati)',
            quantity: 25,
            unit: 'kg',
            price: 78
          }
        ],
        totalAmount: 1950,
        joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        vendorId: 'vendor_003',
        vendorName: 'Priya Sharma',
        businessName: 'Sharma Snacks',
        items: [
          {
            materialId: '1',
            materialName: 'Rice (Basmati)',
            quantity: 16,
            unit: 'kg',
            price: 78
          }
        ],
        totalAmount: 1248,
        joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    status: 'open',
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryLocation: 'Karol Bagh Market',
    supplierId: 'SUP001',
    supplierName: 'Mumbai Grains Wholesale',
    materials: [
      {
        materialId: '1',
        materialName: 'Rice (Basmati)',
        unit: 'kg',
        minQuantity: 50,
        pricePerUnit: 78,
        totalQuantityNeeded: 100,
        currentQuantity: 41
      }
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    minParticipants: 3,
    maxParticipants: 8,
    groupDiscount: 15
  },
  {
    id: 'GRP002',
    title: 'Fresh Vegetables - Weekly Order',
    description: 'Weekly group order for fresh vegetables. Same day delivery!',
    creatorId: 'vendor_004',
    creatorName: 'Rajesh Gupta',
    targetAmount: 2000,
    currentAmount: 800,
    participants: [
      {
        vendorId: 'vendor_004',
        vendorName: 'Rajesh Gupta',
        businessName: 'Gupta Food Stall',
        items: [
          {
            materialId: '2',
            materialName: 'Potatoes',
            quantity: 10,
            unit: 'kg',
            price: 25
          },
          {
            materialId: '3',
            materialName: 'Onions',
            quantity: 8,
            unit: 'kg',
            price: 35
          }
        ],
        totalAmount: 530,
        joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    status: 'open',
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryLocation: 'Central Delhi',
    supplierId: 'SUP004',
    supplierName: 'Delhi Fresh Vegetables',
    materials: [
      {
        materialId: '2',
        materialName: 'Potatoes',
        unit: 'kg',
        minQuantity: 20,
        pricePerUnit: 25,
        totalQuantityNeeded: 50,
        currentQuantity: 18
      },
      {
        materialId: '3',
        materialName: 'Onions',
        unit: 'kg',
        minQuantity: 15,
        pricePerUnit: 35,
        totalQuantityNeeded: 40,
        currentQuantity: 12
      }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    minParticipants: 4,
    maxParticipants: 10,
    groupDiscount: 12
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
    const groupOrderId = pathSegments[2]; // /api/group-orders/GRP001
    const action = pathSegments[3]; // join, leave, etc.

    switch (event.httpMethod) {
      case 'GET':
        if (groupOrderId) {
          // Get specific group order
          const groupOrder = groupOrdersDatabase.find(g => g.id === groupOrderId);
          if (!groupOrder) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Group order not found' })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: groupOrder })
          };
        }

        // Get all group orders with filters
        const status = event.queryStringParameters?.status;
        const vendorId = event.queryStringParameters?.vendorId;
        const location = event.queryStringParameters?.location;

        let filteredOrders = [...groupOrdersDatabase];

        if (status) {
          filteredOrders = filteredOrders.filter(order => order.status === status);
        }

        if (vendorId) {
          filteredOrders = filteredOrders.filter(order => 
            order.creatorId === vendorId || 
            order.participants.some((p: any) => p.vendorId === vendorId)
          );
        }

        // Sort by creation date (newest first)
        filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: filteredOrders })
        };

      case 'POST':
        if (action === 'join') {
          // Join group order
          const participantData = JSON.parse(event.body || '{}');
          const orderIndex = groupOrdersDatabase.findIndex(g => g.id === groupOrderId);
          
          if (orderIndex === -1) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Group order not found' })
            };
          }

          const order = groupOrdersDatabase[orderIndex];
          
          // Check if already joined
          if (order.participants.some((p: any) => p.vendorId === participantData.vendorId)) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ success: false, error: 'Already joined this group order' })
            };
          }

          // Check if group is full
          if (order.participants.length >= order.maxParticipants) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ success: false, error: 'Group order is full' })
            };
          }

          // Add participant
          order.participants.push({
            ...participantData,
            joinedAt: new Date().toISOString()
          });

          order.currentAmount += participantData.totalAmount;

          // Check if order should be auto-confirmed
          if (order.participants.length >= order.minParticipants && 
              order.currentAmount >= order.targetAmount) {
            order.status = 'confirmed';
          }

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: order })
          };
        }

        if (action === 'leave') {
          // Leave group order
          const { vendorId } = JSON.parse(event.body || '{}');
          const orderIndex = groupOrdersDatabase.findIndex(g => g.id === groupOrderId);
          
          if (orderIndex === -1) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Group order not found' })
            };
          }

          const order = groupOrdersDatabase[orderIndex];
          const participantIndex = order.participants.findIndex((p: any) => p.vendorId === vendorId);
          
          if (participantIndex === -1) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ success: false, error: 'Not a participant in this group order' })
            };
          }

          // Remove participant
          const removedParticipant = order.participants.splice(participantIndex, 1)[0];
          order.currentAmount -= removedParticipant.totalAmount;

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: order })
          };
        }

        // Create new group order
        const newGroupOrder = JSON.parse(event.body || '{}');
        
        const groupOrder = {
          id: `GRP${Date.now()}`,
          title: newGroupOrder.title,
          description: newGroupOrder.description,
          creatorId: newGroupOrder.creatorId,
          creatorName: newGroupOrder.creatorName,
          targetAmount: newGroupOrder.targetAmount || 0,
          currentAmount: 0,
          participants: [],
          status: 'open',
          expiresAt: newGroupOrder.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          deliveryLocation: newGroupOrder.deliveryLocation,
          supplierId: newGroupOrder.supplierId,
          supplierName: newGroupOrder.supplierName,
          materials: newGroupOrder.materials || [],
          createdAt: new Date().toISOString(),
          minParticipants: newGroupOrder.minParticipants || 3,
          maxParticipants: newGroupOrder.maxParticipants || 10,
          groupDiscount: newGroupOrder.groupDiscount || 10
        };

        groupOrdersDatabase.push(groupOrder);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, data: groupOrder })
        };

      case 'PUT':
        // Update group order
        const updates = JSON.parse(event.body || '{}');
        const updateIndex = groupOrdersDatabase.findIndex(g => g.id === groupOrderId);
        
        if (updateIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Group order not found' })
          };
        }

        groupOrdersDatabase[updateIndex] = { 
          ...groupOrdersDatabase[updateIndex], 
          ...updates 
        };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: groupOrdersDatabase[updateIndex] })
        };

      case 'DELETE':
        // Cancel/delete group order
        const deleteIndex = groupOrdersDatabase.findIndex(g => g.id === groupOrderId);
        
        if (deleteIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Group order not found' })
          };
        }

        // Only creator can delete, or auto-delete if expired
        const orderToDelete = groupOrdersDatabase[deleteIndex];
        const isExpired = new Date(orderToDelete.expiresAt) < new Date();
        
        if (!isExpired && orderToDelete.status !== 'cancelled') {
          orderToDelete.status = 'cancelled';
        } else {
          groupOrdersDatabase.splice(deleteIndex, 1);
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Group order cancelled' })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error in group-orders API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};
