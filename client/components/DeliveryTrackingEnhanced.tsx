import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/use-language";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  Navigation,
  Phone,
  MessageCircle,
  Star,
  Route,
  Calendar
} from "lucide-react";

interface DeliveryUpdate {
  timestamp: string;
  status: string;
  location: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicleNumber: string;
  photo?: string;
}

interface TrackingData {
  orderId: string;
  trackingId: string;
  currentStatus: string;
  estimatedDelivery: string;
  deliveryPartner: DeliveryPartner;
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  destinationLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  updates: DeliveryUpdate[];
  isLiveTracking: boolean;
}

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export function TrackingModal({ isOpen, onClose, orderId }: TrackingModalProps) {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen && orderId) {
      fetchTrackingData();
    }
  }, [isOpen, orderId]);

  const fetchTrackingData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tracking/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setTrackingData(data.data);
      } else {
        // Mock tracking data for demo
        generateMockTrackingData();
      }
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      generateMockTrackingData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockTrackingData = () => {
    const mockData: TrackingData = {
      orderId,
      trackingId: `TRK${orderId.substring(3)}`,
      currentStatus: 'shipped',
      estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
      deliveryPartner: {
        id: 'DP001',
        name: 'Vikram Singh',
        phone: '+91 98765 43210',
        rating: 4.8,
        vehicleNumber: 'DL 8C AB 1234'
      },
      currentLocation: {
        latitude: 28.6448,
        longitude: 77.2167,
        address: 'Connaught Place, New Delhi'
      },
      destinationLocation: {
        latitude: 28.6519,
        longitude: 77.2315,
        address: 'Shop 22, Karol Bagh, New Delhi 110005'
      },
      updates: [
        {
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'Order Confirmed',
          location: 'Mumbai Grains Wholesale',
          description: 'Your order has been confirmed and is being prepared',
          icon: CheckCircle
        },
        {
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'Order Packed',
          location: 'Mumbai Grains Warehouse',
          description: 'Your order has been packed and ready for dispatch',
          icon: Package
        },
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'Out for Delivery',
          location: 'Delhi Distribution Center',
          description: 'Your order is out for delivery with delivery partner Vikram Singh',
          icon: Truck
        },
        {
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'Nearby Your Location',
          location: 'Connaught Place, New Delhi',
          description: 'Delivery partner is nearby your location. Expected delivery in 30 minutes',
          icon: Navigation
        }
      ],
      isLiveTracking: true
    };
    
    setTrackingData(mockData);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'packed': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'out for delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateETA = () => {
    if (!trackingData) return '';
    const now = new Date();
    const eta = new Date(trackingData.estimatedDelivery);
    const diffInMinutes = Math.floor((eta.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-vendor mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading tracking information...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Truck className="w-5 h-5 mr-2 text-vendor" />
            Live Delivery Tracking
          </DialogTitle>
          <DialogDescription>
            Order #{orderId} • Tracking ID: {trackingData?.trackingId}
          </DialogDescription>
        </DialogHeader>

        {trackingData && (
          <div className="space-y-6">
            {/* Current Status */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Current Status</h3>
                    <Badge className={getStatusColor(trackingData.currentStatus)}>
                      {trackingData.currentStatus}
                    </Badge>
                  </div>
                  {trackingData.isLiveTracking && (
                    <div className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm">Live Tracking</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">ETA</p>
                      <p className="font-medium">{calculateETA()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Current Location</p>
                      <p className="font-medium text-sm">{trackingData.currentLocation.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Partner */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Delivery Partner</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-vendor rounded-full flex items-center justify-center text-vendor-foreground font-bold">
                      {trackingData.deliveryPartner.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium">{trackingData.deliveryPartner.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{trackingData.deliveryPartner.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Vehicle: {trackingData.deliveryPartner.vehicleNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Route */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Delivery Route</h3>
                  <Button size="sm" variant="outline">
                    <Route className="w-4 h-4 mr-1" />
                    View on Map
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Current Location</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {trackingData.currentLocation.address}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 border-l-2 border-dashed border-gray-300 h-4"></div>
                  <div className="flex items-center space-x-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Delivery Address</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {trackingData.destinationLocation.address}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Timeline */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Delivery Timeline</h3>
                <div className="space-y-4">
                  {trackingData.updates.map((update, index) => {
                    const Icon = update.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-vendor rounded-full flex items-center justify-center">
                            <Icon className="w-4 h-4 text-vendor-foreground" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {update.status}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {new Date(update.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {update.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {update.location}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Expected Delivery */}
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      Expected Delivery
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {new Date(trackingData.estimatedDelivery).toLocaleString()} 
                      ({calculateETA()} remaining)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TrackingModal;
