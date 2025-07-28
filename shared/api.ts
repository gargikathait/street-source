/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Vendor-related API types
 */
export interface Vendor {
  id: string;
  name: string;
  category: string;
  qualityScore: number;
  pricing: number;
  availability: number;
  status: 'active' | 'pending' | 'inactive';
  lastUpdated: string;
  contactEmail: string;
  location: string;
  certifications: string[];
  monthlyOrders: number;
  averageDeliveryTime: string;
}

export interface VendorsResponse {
  success: boolean;
  data: Vendor[];
  total: number;
}

export interface VendorResponse {
  success: boolean;
  data: Vendor;
}

export interface AnalyticsData {
  totalVendors: number;
  activeOrders: number;
  qualityScore: number;
  costSavings: number;
  trends: {
    qualityTrend: string;
    pricingTrend: string;
    availabilityTrend: string;
  };
  alerts: Array<{
    id: string;
    type: string;
    vendor: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: string;
  }>;
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

export interface CreateVendorRequest {
  name: string;
  category: string;
  contactEmail: string;
  location: string;
  description?: string;
  certifications?: string[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
