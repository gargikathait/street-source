import { Handler } from '@netlify/functions';

// In-memory inventory database
let inventoryDatabase: any = {
  'vendor_001': [
    {
      id: 'INV001',
      materialId: '1',
      materialName: 'Rice (Basmati)',
      category: 'Grains',
      currentStock: 25,
      unit: 'kg',
      minStockLevel: 10,
      maxStockLevel: 100,
      averageConsumption: 15, // per week
      costPrice: 75,
      sellingPrice: 90,
      supplierId: 'SUP001',
      supplierName: 'Mumbai Grains Wholesale',
      lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Storage Room A',
      batchNumber: 'BATCH001',
      status: 'active',
      alerts: ['low_stock'],
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'INV002',
      materialId: '2',
      materialName: 'Potatoes',
      category: 'Vegetables',
      currentStock: 8,
      unit: 'kg',
      minStockLevel: 5,
      maxStockLevel: 50,
      averageConsumption: 12,
      costPrice: 22,
      sellingPrice: 35,
      supplierId: 'SUP004',
      supplierName: 'Delhi Fresh Vegetables',
      lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Cold Storage',
      batchNumber: 'BATCH002',
      status: 'active',
      alerts: ['expiring_soon'],
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'INV003',
      materialId: '4',
      materialName: 'Sunflower Oil',
      category: 'Oils',
      currentStock: 12,
      unit: 'liter',
      minStockLevel: 8,
      maxStockLevel: 40,
      averageConsumption: 6,
      costPrice: 135,
      sellingPrice: 165,
      supplierId: 'SUP008',
      supplierName: 'Bangalore Oil Mills',
      lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Storage Room B',
      batchNumber: 'BATCH003',
      status: 'active',
      alerts: [],
      lastUpdated: new Date().toISOString()
    }
  ]
};

// Stock movement history
let stockMovements: any[] = [
  {
    id: 'MOV001',
    vendorId: 'vendor_001',
    inventoryId: 'INV001',
    materialName: 'Rice (Basmati)',
    type: 'in', // in, out, adjustment
    quantity: 50,
    unit: 'kg',
    reason: 'Purchase from supplier',
    reference: 'ORD001',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    costPrice: 75,
    notes: 'Bulk purchase'
  },
  {
    id: 'MOV002',
    vendorId: 'vendor_001',
    inventoryId: 'INV001',
    materialName: 'Rice (Basmati)',
    type: 'out',
    quantity: 25,
    unit: 'kg',
    reason: 'Used in production',
    reference: 'PROD001',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Daily consumption'
  }
];

function calculateStockStatus(item: any) {
  const stockPercentage = (item.currentStock / item.maxStockLevel) * 100;
  
  if (item.currentStock <= item.minStockLevel) {
    return 'low';
  } else if (stockPercentage >= 80) {
    return 'high';
  } else {
    return 'normal';
  }
}

function calculateReorderPoint(item: any) {
  // Simple reorder calculation: min stock + (average consumption * lead time)
  const leadTime = 2; // days
  const dailyConsumption = item.averageConsumption / 7; // convert weekly to daily
  return Math.ceil(item.minStockLevel + (dailyConsumption * leadTime));
}

function generateAlerts(item: any) {
  const alerts = [];
  const now = new Date();
  const expiryDate = new Date(item.expiryDate);
  const daysToExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Low stock alert
  if (item.currentStock <= item.minStockLevel) {
    alerts.push('low_stock');
  }

  // Expiring soon alert (within 7 days for perishables)
  if (['Vegetables', 'Dairy', 'Meat'].includes(item.category) && daysToExpiry <= 7) {
    alerts.push('expiring_soon');
  }

  // Overstock alert
  const stockPercentage = (item.currentStock / item.maxStockLevel) * 100;
  if (stockPercentage >= 90) {
    alerts.push('overstock');
  }

  // Zero stock alert
  if (item.currentStock === 0) {
    alerts.push('out_of_stock');
  }

  return alerts;
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
    const vendorId = pathSegments[2]; // /api/inventory/vendor_001
    const inventoryId = pathSegments[3]; // /api/inventory/vendor_001/INV001
    const action = pathSegments[4]; // /api/inventory/vendor_001/INV001/movement

    switch (event.httpMethod) {
      case 'GET':
        if (action === 'movements') {
          // Get stock movements for specific item
          const movements = stockMovements.filter(m => 
            m.vendorId === vendorId && 
            (inventoryId ? m.inventoryId === inventoryId : true)
          ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: movements
            })
          };
        }

        if (action === 'alerts') {
          // Get inventory alerts
          const vendorInventory = inventoryDatabase[vendorId] || [];
          const alertItems = vendorInventory.filter((item: any) => item.alerts.length > 0);

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: alertItems,
              count: alertItems.length
            })
          };
        }

        if (inventoryId) {
          // Get specific inventory item
          const vendorInventory = inventoryDatabase[vendorId] || [];
          const item = vendorInventory.find((inv: any) => inv.id === inventoryId);
          
          if (!item) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Inventory item not found' })
            };
          }

          // Calculate additional metrics
          const enrichedItem = {
            ...item,
            stockStatus: calculateStockStatus(item),
            reorderPoint: calculateReorderPoint(item),
            daysToExpiry: Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
            stockValue: item.currentStock * item.costPrice,
            profitMargin: ((item.sellingPrice - item.costPrice) / item.costPrice * 100).toFixed(2)
          };

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: enrichedItem
            })
          };
        }

        if (vendorId) {
          // Get all inventory for vendor
          const vendorInventory = inventoryDatabase[vendorId] || [];
          const category = event.queryStringParameters?.category;
          const status = event.queryStringParameters?.status;
          const alert = event.queryStringParameters?.alert;

          let filteredInventory = [...vendorInventory];

          // Apply filters
          if (category) {
            filteredInventory = filteredInventory.filter(item => item.category === category);
          }

          if (status) {
            filteredInventory = filteredInventory.filter(item => 
              calculateStockStatus(item) === status
            );
          }

          if (alert) {
            filteredInventory = filteredInventory.filter(item => 
              item.alerts.includes(alert)
            );
          }

          // Enrich with calculated fields
          const enrichedInventory = filteredInventory.map(item => ({
            ...item,
            stockStatus: calculateStockStatus(item),
            reorderPoint: calculateReorderPoint(item),
            daysToExpiry: Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
            stockValue: item.currentStock * item.costPrice,
            alerts: generateAlerts(item)
          }));

          // Calculate summary statistics
          const totalItems = enrichedInventory.length;
          const totalValue = enrichedInventory.reduce((sum, item) => sum + item.stockValue, 0);
          const lowStockItems = enrichedInventory.filter(item => item.stockStatus === 'low').length;
          const expiringItems = enrichedInventory.filter(item => 
            item.alerts.includes('expiring_soon')
          ).length;

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: enrichedInventory,
              summary: {
                totalItems,
                totalValue,
                lowStockItems,
                expiringItems,
                categories: [...new Set(enrichedInventory.map(item => item.category))]
              }
            })
          };
        }

        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Vendor ID is required' })
        };

      case 'POST':
        if (action === 'movement') {
          // Record stock movement
          const movementData = JSON.parse(event.body || '{}');
          
          const movement = {
            id: `MOV${Date.now()}`,
            vendorId: vendorId,
            inventoryId: inventoryId,
            materialName: movementData.materialName,
            type: movementData.type, // 'in', 'out', 'adjustment'
            quantity: movementData.quantity,
            unit: movementData.unit,
            reason: movementData.reason,
            reference: movementData.reference,
            date: new Date().toISOString(),
            costPrice: movementData.costPrice,
            notes: movementData.notes || ''
          };

          stockMovements.push(movement);

          // Update inventory levels
          const vendorInventory = inventoryDatabase[vendorId] || [];
          const itemIndex = vendorInventory.findIndex((item: any) => item.id === inventoryId);
          
          if (itemIndex !== -1) {
            const item = vendorInventory[itemIndex];
            
            if (movement.type === 'in') {
              item.currentStock += movement.quantity;
            } else if (movement.type === 'out') {
              item.currentStock = Math.max(0, item.currentStock - movement.quantity);
            } else if (movement.type === 'adjustment') {
              item.currentStock = movement.quantity;
            }

            item.alerts = generateAlerts(item);
            item.lastUpdated = new Date().toISOString();
          }

          return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
              success: true,
              data: movement,
              message: 'Stock movement recorded successfully'
            })
          };
        }

        // Add new inventory item
        const newItem = JSON.parse(event.body || '{}');
        
        if (!inventoryDatabase[vendorId]) {
          inventoryDatabase[vendorId] = [];
        }

        const inventoryItem = {
          id: `INV${Date.now()}`,
          materialId: newItem.materialId,
          materialName: newItem.materialName,
          category: newItem.category,
          currentStock: newItem.currentStock || 0,
          unit: newItem.unit,
          minStockLevel: newItem.minStockLevel || 0,
          maxStockLevel: newItem.maxStockLevel || 100,
          averageConsumption: newItem.averageConsumption || 0,
          costPrice: newItem.costPrice || 0,
          sellingPrice: newItem.sellingPrice || 0,
          supplierId: newItem.supplierId,
          supplierName: newItem.supplierName,
          lastRestocked: new Date().toISOString(),
          expiryDate: newItem.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          location: newItem.location || 'Main Storage',
          batchNumber: newItem.batchNumber || `BATCH${Date.now()}`,
          status: 'active',
          alerts: [],
          lastUpdated: new Date().toISOString()
        };

        inventoryItem.alerts = generateAlerts(inventoryItem);
        inventoryDatabase[vendorId].push(inventoryItem);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            data: inventoryItem,
            message: 'Inventory item added successfully'
          })
        };

      case 'PUT':
        // Update inventory item
        const updates = JSON.parse(event.body || '{}');
        const vendorInventory = inventoryDatabase[vendorId] || [];
        const itemIndex = vendorInventory.findIndex((item: any) => item.id === inventoryId);
        
        if (itemIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Inventory item not found' })
          };
        }

        // Update item
        vendorInventory[itemIndex] = {
          ...vendorInventory[itemIndex],
          ...updates,
          alerts: generateAlerts({ ...vendorInventory[itemIndex], ...updates }),
          lastUpdated: new Date().toISOString()
        };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: vendorInventory[itemIndex],
            message: 'Inventory item updated successfully'
          })
        };

      case 'DELETE':
        // Delete inventory item
        const vendorInv = inventoryDatabase[vendorId] || [];
        const deleteIndex = vendorInv.findIndex((item: any) => item.id === inventoryId);
        
        if (deleteIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Inventory item not found' })
          };
        }

        const deletedItem = vendorInv.splice(deleteIndex, 1)[0];

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: deletedItem,
            message: 'Inventory item deleted successfully'
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
    console.error('Error in inventory API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};
