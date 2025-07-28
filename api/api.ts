import { Request, Response } from 'express';
import { MockDatabase } from ../../shared/database';
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Example response
    res.status(200).json({ message: "GET /api/api route working!" });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}


// Vendor Profile APIs
export const getVendorProfile = (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId || 'vendor_001'; // Default to current user
    const vendor = MockDatabase.getVendor(vendorId);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateVendorProfile = (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId || 'vendor_001';
    const updates = req.body;
    
    const updatedVendor = MockDatabase.updateVendor(vendorId, updates);
    
    if (!updatedVendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: updatedVendor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Location-based Supplier APIs
export const getNearbySuppliers = (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius } = req.query;
    
    let suppliers;
    if (latitude && longitude) {
      suppliers = MockDatabase.getSuppliers({
        latitude: parseFloat(latitude as string),
        longitude: parseFloat(longitude as string),
        radius: radius ? parseFloat(radius as string) : 50
      });
    } else {
      suppliers = MockDatabase.getSuppliers();
    }

    res.json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Raw Materials APIs
export const getRawMaterials = (req: Request, res: Response) => {
  try {
    const { category, search, latitude, longitude } = req.query;
    
    let materials;
    if (search) {
      materials = MockDatabase.searchMaterials(
        search as string, 
        category as string
      );
    } else {
      materials = MockDatabase.getRawMaterials(category as string);
    }

    // Get supplier products for each material
    const materialsWithSuppliers = materials.map(material => {
      const supplierProducts = MockDatabase.getSupplierProducts(undefined, material.id);
      
      // Filter by location if provided
      let filteredProducts = supplierProducts;
      if (latitude && longitude) {
        const suppliers = MockDatabase.getSuppliers({
          latitude: parseFloat(latitude as string),
          longitude: parseFloat(longitude as string)
        });
        const nearbySupplierIds = suppliers.map(s => s.id);
        filteredProducts = supplierProducts.filter(p => 
          nearbySupplierIds.includes(p.supplierId)
        );
      }

      return {
        ...material,
        suppliers: filteredProducts.map(product => {
          const supplier = MockDatabase.getSuppliers().find(s => s.id === product.supplierId);
          return {
            id: product.id,
            supplierId: product.supplierId,
            supplierName: supplier?.businessName || 'Unknown Supplier',
            price: product.price,
            quality: product.quality,
            availability: product.availability,
            stockQuantity: product.stockQuantity,
            minimumQuantity: product.minimumQuantity,
            deliveryTime: supplier?.deliveryTime || '2-4 hours',
            distance: supplier ? `${Math.round(MockDatabase.calculateDistance(
              parseFloat(latitude as string) || 28.6519,
              parseFloat(longitude as string) || 77.1909,
              supplier.location.latitude,
              supplier.location.longitude
            ))}km` : 'Unknown',
            rating: supplier?.rating || 4.0
          };
        })
      };
    });

    res.json({
      success: true,
      data: materialsWithSuppliers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Order Management APIs
export const createOrder = (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData.vendorId || !orderData.supplierId || !orderData.items || !orderData.deliveryAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Calculate total amount
    const totalAmount = orderData.items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.price), 0
    );

    // Add delivery charges (₹30 base + ₹5 per km)
    const deliveryCharges = 30 + (orderData.distance || 5) * 5;

    const newOrder = MockDatabase.createOrder({
      ...orderData,
      totalAmount: totalAmount + deliveryCharges,
      deliveryCharges,
      status: 'pending',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
      estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
    });

    res.json({
      success: true,
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getOrders = (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId || req.query.vendorId as string;
    const orders = MockDatabase.getOrders(vendorId);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateOrderStatus = (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const updatedOrder = MockDatabase.updateOrderStatus(orderId, status);
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Delivery Tracking APIs
export const getTrackingInfo = (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const trackingHistory = MockDatabase.getTrackingHistory(orderId);
    
    if (trackingHistory.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tracking information not found'
      });
    }

    const currentStatus = trackingHistory[trackingHistory.length - 1];
    
    res.json({
      success: true,
      data: {
        currentStatus,
        history: trackingHistory,
        estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Payment APIs
export const processPayment = (req: Request, res: Response) => {
  try {
    const { orderId, paymentMethod, amount, paymentDetails } = req.body;
    
    // Simulate payment processing
    const isSuccessful = Math.random() > 0.1; // 90% success rate
    
    if (isSuccessful) {
      // Update order payment status
      const order = MockDatabase.getOrders().find(o => o.id === orderId);
      if (order) {
        order.paymentStatus = 'paid';
        MockDatabase.updateOrderStatus(orderId, 'confirmed');
      }
      
      res.json({
        success: true,
        data: {
          transactionId: `TXN${Date.now()}`,
          status: 'success',
          amount,
          paymentMethod,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment failed. Please try again.'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Analytics APIs
export const getVendorAnalytics = (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId || 'vendor_001';
    const analytics = MockDatabase.getVendorAnalytics(vendorId);
    
    if (!analytics) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Notification APIs
export const getNotifications = (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId || 'vendor_001';
    
    // Mock notifications
    const notifications = [
      {
        id: 'not_001',
        title: 'New Order Confirmed',
        message: 'Your order for Basmati Rice has been confirmed by Mumbai Grains',
        type: 'order',
        timestamp: new Date().toISOString(),
        isRead: false
      },
      {
        id: 'not_002',
        title: 'Price Alert',
        message: 'Onion prices increased by 15% in your area',
        type: 'price',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false
      },
      {
        id: 'not_003',
        title: 'Delivery Update',
        message: 'Your order is out for delivery and will arrive in 30 minutes',
        type: 'delivery',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: true
      }
    ];

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Location APIs
export const getUserLocation = (req: Request, res: Response) => {
  try {
    // In a real app, this would use the user's actual location
    // For now, return Delhi coordinates
    const mockLocation = {
      latitude: 28.6519,
      longitude: 77.1909,
      address: "Karol Bagh, New Delhi, Delhi 110005",
      city: "New Delhi",
      state: "Delhi",
      country: "India"
    };

    res.json({
      success: true,
      data: mockLocation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
