import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Clock,
  CheckCircle,
  Package,
  Truck,
  Phone,
  User,
  Navigation,
  Calendar,
  AlertCircle
} from "lucide-react";

interface DeliveryTracking {
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

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export function TrackingModal({ isOpen, onClose, orderId }: TrackingModalProps) {
  const [trackingData, setTrackingData] = useState<{
    currentStatus: DeliveryTracking;
    history: DeliveryTracking[];
    estimatedDelivery: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && orderId) {
      fetchTrackingData();
    }
  }, [isOpen, orderId]);

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tracking/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setTrackingData(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch tracking information",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tracking information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusDetails = (status: DeliveryTracking['status']) => {
    switch (status) {
      case 'order_placed':
        return {
          label: 'Order Placed',
          description: 'Your order has been received and is being processed',
          icon: Package,
          color: 'text-blue-600'
        };
      case 'confirmed':
        return {
          label: 'Order Confirmed',
          description: 'Supplier has confirmed your order and is preparing items',
          icon: CheckCircle,
          color: 'text-green-600'
        };
      case 'picked_up':
        return {
          label: 'Picked Up',
          description: 'Order has been picked up from supplier',
          icon: Package,
          color: 'text-orange-600'
        };
      case 'in_transit':
        return {
          label: 'In Transit',
          description: 'Your order is on the way to delivery location',
          icon: Truck,
          color: 'text-purple-600'
        };
      case 'out_for_delivery':
        return {
          label: 'Out for Delivery',
          description: 'Delivery partner is on the way to your location',
          icon: Navigation,
          color: 'text-yellow-600'
        };
      case 'delivered':
        return {
          label: 'Delivered',
          description: 'Order has been successfully delivered',
          icon: CheckCircle,
          color: 'text-green-600'
        };
      default:
        return {
          label: 'Unknown',
          description: 'Status unknown',
          icon: AlertCircle,
          color: 'text-gray-600'
        };
    }
  };

  const getStatusProgress = (status: DeliveryTracking['status']) => {
    const statuses = ['order_placed', 'confirmed', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
    return ((statuses.indexOf(status) + 1) / statuses.length) * 100;
  };

  if (!trackingData && !loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Tracking</DialogTitle>
            <DialogDescription>Track your order delivery status</DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No tracking information available</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Tracking</DialogTitle>
          <DialogDescription>
            Track your order delivery status
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-vendor mx-auto mb-4"></div>
            <p className="text-gray-500">Loading tracking information...</p>
          </div>
        ) : trackingData && (
          <div className="space-y-6">
            {/* Current Status */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  {(() => {
                    const statusDetails = getStatusDetails(trackingData.currentStatus.status);
                    const StatusIcon = statusDetails.icon;
                    return (
                      <>
                        <div className={`p-3 rounded-full bg-gray-100 ${statusDetails.color}`}>
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {statusDetails.label}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {statusDetails.description}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(getStatusProgress(trackingData.currentStatus.status))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-vendor h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getStatusProgress(trackingData.currentStatus.status)}%` }}
                    />
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>Estimated delivery: {new Date(trackingData.estimatedDelivery).toLocaleString()}</span>
                </div>

                {/* Delivery Partner Info */}
                {trackingData.currentStatus.deliveryPartner && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Delivery Partner</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{trackingData.currentStatus.deliveryPartner.name}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    </div>
                    {trackingData.currentStatus.deliveryPartner.vehicleNumber && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Truck className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Vehicle: {trackingData.currentStatus.deliveryPartner.vehicleNumber}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tracking History */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking History</CardTitle>
                <CardDescription>
                  Detailed timeline of your order progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.history.map((tracking, index) => {
                    const statusDetails = getStatusDetails(tracking.status);
                    const StatusIcon = statusDetails.icon;
                    const isLatest = index === trackingData.history.length - 1;
                    
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 p-2 rounded-full ${
                          isLatest ? 'bg-vendor text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <StatusIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${
                              isLatest ? 'text-vendor' : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {statusDetails.label}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {new Date(tracking.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {statusDetails.description}
                          </p>
                          {tracking.location.address && (
                            <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                              <MapPin className="w-3 h-3" />
                              <span>{tracking.location.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={fetchTrackingData}
              >
                Refresh Status
              </Button>
              {trackingData.currentStatus.status === 'delivered' && (
                <Button className="flex-1 bg-vendor hover:bg-vendor/90">
                  Rate Delivery
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function DeliveryTracking() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Delivery Tracking</h2>
        <p className="text-gray-600 dark:text-gray-300">Track all your active deliveries</p>
      </div>

      {/* This component is primarily used as a modal */}
      <Card>
        <CardContent className="text-center py-12">
          <Truck className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Track Your Orders</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Click "Track Order" on any active order to see real-time delivery updates
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export { TrackingModal };
