// Database models and mock data storage
export interface Vendor {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
  businessType: string;
  registrationDate: string;
  businessLicense: string;
  avatar: string;
  specialties: string[];
  operatingHours: string;
  totalOrders: number;
  avgRating: number;
  monthlyRevenue: string;
  joinedDate: string;
  verificationStatus: 'Verified' | 'Pending' | 'Unverified';
  subscriptionPlan: 'Basic' | 'Premium' | 'Pro';
  isActive: boolean;
  documents: {
    aadhar?: string;
    pan?: string;
    gst?: string;
    foodLicense?: string;
  };
  bankDetails: {
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    upiId?: string;
  };
}

export interface Supplier {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
  category: string;
  products: string[];
  rating: number;
  deliveryTime: string;
  minimumOrder: number;
  isActive: boolean;
  workingHours: string;
  deliveryRadius: number; // in km
}

export interface RawMaterial {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  image: string;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  shelfLife: string;
  storageConditions: string;
  origin: string;
  seasonality: string[];
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  materialId: string;
  price: number;
  quality: number;
  availability: 'In Stock' | 'Limited' | 'Out of Stock';
  stockQuantity: number;
  discount?: number;
  minimumQuantity: number;
  lastUpdated: string;
}

export interface Order {
  id: string;
  vendorId: string;
  supplierId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryAddress: string;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  trackingId: string;
  deliveryCharges: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
}

export interface DeliveryTracking {
  orderId: string;
  trackingId: string;
  status: 'order_placed' | 'confirmed' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp: string;
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicleNumber?: string;
  };
  estimatedArrival?: string;
}

// Mock database storage
export class MockDatabase {
  private static vendors: Vendor[] = [
    {
      id: "vendor_001",
      name: "Radhika Shukla",
      businessName: "Shukla Street Foods",
      email: "radhika.shukla@example.com",
      phone: "+91 98765 43210",
      address: "Shop 22, Karol Bagh, New Delhi 110005",
      location: {
        latitude: 28.6519,
        longitude: 77.1909,
        area: "Karol Bagh",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110005"
      },
      businessType: "Street Food Vendor",
      registrationDate: "2023-01-15",
      businessLicense: "DL-SF-2023-002",
      avatar: "/placeholder.svg",
      specialties: ["Chaat", "Pani Puri", "Dosa", "South Indian"],
      operatingHours: "10:00 AM - 10:00 PM",
      totalOrders: 847,
      avgRating: 4.6,
      monthlyRevenue: "₹85,000",
      joinedDate: "January 2023",
      verificationStatus: "Verified",
      subscriptionPlan: "Premium",
      isActive: true,
      documents: {
        aadhar: "XXXX-XXXX-1234",
        pan: "ABCDE1234F",
        gst: "07ABCDE1234F1Z5",
        foodLicense: "DL-FOOD-2023-001"
      },
      bankDetails: {
        accountNumber: "XXXX-XXXX-1234",
        ifscCode: "HDFC0001234",
        bankName: "HDFC Bank",
        upiId: "radhika@paytm"
      }
    }
  ];

  private static suppliers: Supplier[] = [
    {
      id: "sup_001",
      name: "Mumbai Grains Wholesale",
      businessName: "Mumbai Grains Pvt Ltd",
      email: "contact@mumbaigrains.com",
      phone: "+91 98765 11111",
      address: "Wholesale Market, Andheri West, Mumbai 400058",
      location: {
        latitude: 19.1197,
        longitude: 72.8464,
        area: "Andheri West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400058"
      },
      category: "Grains & Cereals",
      products: ["Rice", "Wheat", "Dal", "Flour"],
      rating: 4.8,
      deliveryTime: "2-4 hours",
      minimumOrder: 500,
      isActive: true,
      workingHours: "6:00 AM - 8:00 PM",
      deliveryRadius: 25
    },
    {
      id: "sup_002",
      name: "Delhi Fresh Vegetables",
      businessName: "Delhi Fresh Pvt Ltd",
      email: "orders@delhifresh.com",
      phone: "+91 98765 22222",
      address: "Azadpur Mandi, Delhi 110033",
      location: {
        latitude: 28.7041,
        longitude: 77.1025,
        area: "Azadpur",
        city: "Delhi",
        state: "Delhi",
        pincode: "110033"
      },
      category: "Vegetables",
      products: ["Potatoes", "Onions", "Tomatoes", "Leafy Greens"],
      rating: 4.3,
      deliveryTime: "1-3 hours",
      minimumOrder: 200,
      isActive: true,
      workingHours: "5:00 AM - 9:00 PM",
      deliveryRadius: 30
    }
  ];

  private static rawMaterials: RawMaterial[] = [
    {
      id: "mat_001",
      name: "Basmati Rice",
      category: "Grains",
      description: "Premium quality aged basmati rice",
      unit: "kg",
      image: "/placeholder.svg",
      nutritionalInfo: {
        calories: 350,
        protein: 7,
        carbs: 78,
        fat: 1
      },
      shelfLife: "24 months",
      storageConditions: "Cool and dry place",
      origin: "Punjab, India",
      seasonality: ["All Year"]
    },
    {
      id: "mat_002",
      name: "Fresh Potatoes",
      category: "Vegetables",
      description: "Fresh farm potatoes",
      unit: "kg",
      image: "/placeholder.svg",
      nutritionalInfo: {
        calories: 77,
        protein: 2,
        carbs: 17,
        fat: 0.1
      },
      shelfLife: "15 days",
      storageConditions: "Cool and dark place",
      origin: "Uttar Pradesh, India",
      seasonality: ["October", "November", "December", "January"]
    }
  ];

  private static supplierProducts: SupplierProduct[] = [
    {
      id: "sp_001",
      supplierId: "sup_001",
      materialId: "mat_001",
      price: 78,
      quality: 4.8,
      availability: "In Stock",
      stockQuantity: 500,
      minimumQuantity: 10,
      lastUpdated: new Date().toISOString()
    },
    {
      id: "sp_002",
      supplierId: "sup_002",
      materialId: "mat_002",
      price: 25,
      quality: 4.2,
      availability: "In Stock",
      stockQuantity: 200,
      minimumQuantity: 5,
      lastUpdated: new Date().toISOString()
    }
  ];

  private static orders: Order[] = [];
  private static deliveryTracking: DeliveryTracking[] = [];

  // Vendor methods
  static getVendor(id: string): Vendor | undefined {
    return this.vendors.find(v => v.id === id);
  }

  static updateVendor(id: string, updates: Partial<Vendor>): Vendor | null {
    const index = this.vendors.findIndex(v => v.id === id);
    if (index === -1) return null;
    
    this.vendors[index] = { ...this.vendors[index], ...updates };
    return this.vendors[index];
  }

  // Supplier methods
  static getSuppliers(location?: { latitude: number; longitude: number; radius?: number }): Supplier[] {
    if (!location) return this.suppliers;
    
    // Calculate distance and filter by radius
    const radius = location.radius || 50; // default 50km
    return this.suppliers.filter(supplier => {
      const distance = this.calculateDistance(
        location.latitude, 
        location.longitude,
        supplier.location.latitude,
        supplier.location.longitude
      );
      return distance <= radius;
    });
  }

  static getSupplierProducts(supplierId?: string, materialId?: string): SupplierProduct[] {
    let products = this.supplierProducts;
    if (supplierId) products = products.filter(p => p.supplierId === supplierId);
    if (materialId) products = products.filter(p => p.materialId === materialId);
    return products;
  }

  // Material methods
  static getRawMaterials(category?: string): RawMaterial[] {
    if (!category) return this.rawMaterials;
    return this.rawMaterials.filter(m => m.category === category);
  }

  static searchMaterials(query: string, category?: string): RawMaterial[] {
    let materials = this.rawMaterials;
    if (category && category !== 'all') {
      materials = materials.filter(m => m.category === category);
    }
    
    return materials.filter(material => 
      material.name.toLowerCase().includes(query.toLowerCase()) ||
      material.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Order methods
  static createOrder(order: Omit<Order, 'id' | 'orderDate' | 'trackingId'>): Order {
    const newOrder: Order = {
      ...order,
      id: `order_${Date.now()}`,
      orderDate: new Date().toISOString(),
      trackingId: `TRK${Date.now()}`
    };
    
    this.orders.push(newOrder);
    
    // Create initial tracking entry
    this.createTrackingEntry(newOrder.id, 'order_placed', {
      latitude: 0,
      longitude: 0,
      address: order.deliveryAddress
    });
    
    return newOrder;
  }

  static getOrders(vendorId?: string): Order[] {
    if (!vendorId) return this.orders;
    return this.orders.filter(o => o.vendorId === vendorId);
  }

  static updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;
    
    this.orders[index].status = status;
    
    // Update tracking
    this.createTrackingEntry(orderId, status as any, {
      latitude: 0,
      longitude: 0,
      address: this.orders[index].deliveryAddress
    });
    
    return this.orders[index];
  }

  // Delivery tracking methods
  static createTrackingEntry(orderId: string, status: DeliveryTracking['status'], location: DeliveryTracking['location']) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    const tracking: DeliveryTracking = {
      orderId,
      trackingId: order.trackingId,
      status,
      location,
      timestamp: new Date().toISOString()
    };

    this.deliveryTracking.push(tracking);
  }

  static getTrackingHistory(orderId: string): DeliveryTracking[] {
    return this.deliveryTracking
      .filter(t => t.orderId === orderId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Utility methods
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Analytics methods
  static getVendorAnalytics(vendorId: string) {
    const vendor = this.getVendor(vendorId);
    if (!vendor) return null;

    const vendorOrders = this.getOrders(vendorId);
    const totalSpent = vendorOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = vendorOrders.length > 0 ? totalSpent / vendorOrders.length : 0;

    return {
      totalOrders: vendorOrders.length,
      totalSpent,
      avgOrderValue,
      monthlySavings: totalSpent * 0.15, // 15% savings estimate
      frequentSuppliers: this.suppliers.slice(0, 3),
      recentOrders: vendorOrders.slice(-5)
    };
  }
}
