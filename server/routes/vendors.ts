import { RequestHandler } from "express";

// Mock vendor data - Raw materials suppliers for street vendors
const mockVendors = [
  {
    id: "1",
    name: "Mumbai Grains Wholesale",
    category: "Grains & Cereals",
    qualityScore: 94,
    pricing: 85,
    availability: 98,
    status: 'active',
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    contactEmail: "contact@mumbaigrains.com",
    location: "Mumbai, Maharashtra",
    certifications: ["FSSAI Certified", "Organic"],
    monthlyOrders: 47,
    averageDeliveryTime: "Same day"
  },
  {
    id: "2",
    name: "Delhi Fresh Vegetables",
    category: "Fresh Vegetables",
    qualityScore: 87,
    pricing: 92,
    availability: 76,
    status: 'active',
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    contactEmail: "sales@delhifresh.com",
    location: "Delhi, NCR",
    certifications: ["FSSAI Certified", "Fresh Guarantee"],
    monthlyOrders: 32,
    averageDeliveryTime: "Next day"
  },
  {
    id: "3",
    name: "Pune Spice Market",
    category: "Spices & Seasonings",
    qualityScore: 91,
    pricing: 78,
    availability: 89,
    status: 'pending',
    lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    contactEmail: "info@punespices.com",
    location: "Pune, Maharashtra",
    certifications: ["FSSAI Certified"],
    monthlyOrders: 18,
    averageDeliveryTime: "2-3 days"
  },
  {
    id: "4",
    name: "Bangalore Oil Mills",
    category: "Cooking Oils",
    qualityScore: 96,
    pricing: 68,
    availability: 94,
    status: 'active',
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    contactEmail: "orders@bangaloreoils.com",
    location: "Bangalore, Karnataka",
    certifications: ["FSSAI Certified", "Cold Pressed"],
    monthlyOrders: 61,
    averageDeliveryTime: "1-2 days"
  }
];

// Mock analytics data for street vendors
const mockAnalytics = {
  totalVendors: 247,
  activeOrders: 89,
  qualityScore: 91.2,
  costSavings: 47200,
  trends: {
    qualityTrend: "+2.3%",
    pricingTrend: "-5.1%",
    availabilityTrend: "+1.8%"
  },
  alerts: [
    {
      id: "1",
      type: "price",
      vendor: "Mumbai Grains Wholesale",
      message: "Rice prices dropped by ₹2/kg - Great deal available!",
      severity: "low",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    },
    {
      id: "2",
      type: "availability",
      vendor: "Delhi Fresh Vegetables",
      message: "Fresh tomatoes low in stock - order soon",
      severity: "medium",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  ]
};

export const handleGetVendors: RequestHandler = (req, res) => {
  // Simulate real-time updates by slightly modifying scores
  const vendors = mockVendors.map(vendor => ({
    ...vendor,
    qualityScore: Math.max(70, Math.min(100, vendor.qualityScore + (Math.random() - 0.5) * 2)),
    pricing: Math.max(60, Math.min(100, vendor.pricing + (Math.random() - 0.5) * 3)),
    availability: Math.max(70, Math.min(100, vendor.availability + (Math.random() - 0.5) * 2)),
    lastUpdated: new Date().toISOString()
  }));

  res.json({
    success: true,
    data: vendors,
    total: vendors.length
  });
};

export const handleGetVendor: RequestHandler = (req, res) => {
  const { id } = req.params;
  const vendor = mockVendors.find(v => v.id === id);
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: "Vendor not found"
    });
  }

  res.json({
    success: true,
    data: vendor
  });
};

export const handleGetAnalytics: RequestHandler = (req, res) => {
  // Simulate real-time analytics updates
  const analytics = {
    ...mockAnalytics,
    totalVendors: mockAnalytics.totalVendors + Math.floor(Math.random() * 5),
    activeOrders: mockAnalytics.activeOrders + Math.floor(Math.random() * 20) - 10,
    qualityScore: Math.max(85, Math.min(95, mockAnalytics.qualityScore + (Math.random() - 0.5) * 2)),
    costSavings: mockAnalytics.costSavings + Math.floor(Math.random() * 1000) - 500
  };

  res.json({
    success: true,
    data: analytics
  });
};

export const handleCreateVendor: RequestHandler = (req, res) => {
  const vendorData = req.body;
  
  // Simulate vendor creation
  const newVendor = {
    id: (mockVendors.length + 1).toString(),
    ...vendorData,
    qualityScore: 0,
    pricing: 0,
    availability: 0,
    status: 'pending',
    lastUpdated: new Date().toISOString(),
    monthlyOrders: 0
  };

  res.status(201).json({
    success: true,
    data: newVendor,
    message: "Vendor application submitted successfully"
  });
};

export const handleUpdateVendor: RequestHandler = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const vendorIndex = mockVendors.findIndex(v => v.id === id);
  
  if (vendorIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Vendor not found"
    });
  }

  const updatedVendor = {
    ...mockVendors[vendorIndex],
    ...updates,
    lastUpdated: new Date().toISOString()
  };

  mockVendors[vendorIndex] = updatedVendor;

  res.json({
    success: true,
    data: updatedVendor,
    message: "Vendor updated successfully"
  });
};
