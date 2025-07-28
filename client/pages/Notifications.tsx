import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import Navigation from "@/components/Navigation";
import NavigationBreadcrumb from "@/components/NavigationBreadcrumb";
import {
  Bell,
  Check,
  Archive,
  Trash2,
  Filter,
  BellRing,
  Package,
  DollarSign,
  Truck,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'price' | 'delivery' | 'system' | 'promotion';
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'price' | 'delivery'>('all');
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications/vendor_001');
      const data = await response.json();
      
      if (data.success) {
        // Add more mock notifications for demonstration
        const moreNotifications = [
          {
            id: 'not_004',
            title: 'Order Delivered Successfully',
            message: 'Your order #ORD123 for Rice (10kg) has been delivered to Karol Bagh',
            type: 'delivery',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            isRead: false,
            priority: 'medium'
          },
          {
            id: 'not_005',
            title: 'Payment Received',
            message: 'Payment of ₹850 received for order #ORD122',
            type: 'order',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            isRead: true,
            priority: 'high'
          },
          {
            id: 'not_006',
            title: 'New Supplier Available',
            message: 'Fresh Vegetables Co. is now delivering in your area with 15% discount',
            type: 'promotion',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            isRead: false,
            priority: 'low'
          },
          {
            id: 'not_007',
            title: 'Weekly Report Ready',
            message: 'Your weekly business analytics report is now available',
            type: 'system',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            isRead: true,
            priority: 'low'
          },
          {
            id: 'not_008',
            title: 'Low Stock Alert',
            message: 'Basmati Rice is running low in your preferred suppliers. Consider placing order soon.',
            type: 'price',
            timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
            isRead: false,
            priority: 'high'
          }
        ];
        
        setNotifications([...data.data, ...moreNotifications]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    
    toast({
      title: "Marked as read",
      description: "Notification marked as read"
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read"
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    
    toast({
      title: "Notification deleted",
      description: "Notification has been deleted"
    });
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return Package;
      case 'price': return DollarSign;
      case 'delivery': return Truck;
      case 'system': return Info;
      case 'promotion': return BellRing;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'high') return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
    if (priority === 'medium') return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    
    switch (type) {
      case 'order': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'price': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'delivery': return 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'system': return 'border-l-gray-500 bg-gray-50 dark:bg-gray-800';
      case 'promotion': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-800';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation
        title={t('notifications')}
        unreadNotifications={unreadCount}
        rightContent={
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t('markAllRead')}</span>
                <span className="sm:hidden">{t('markAll')}</span>
              </Button>
            )}
            <Badge variant="secondary" className="bg-vendor text-vendor-foreground">
              {unreadCount} {t('unread')}
            </Badge>
          </div>
        }
      />

      <NavigationBreadcrumb />

      {/* Page Description */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
          {t('notificationDescription')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {[
              { key: 'all', label: 'All', icon: Bell },
              { key: 'unread', label: 'Unread', icon: BellRing },
              { key: 'order', label: 'Orders', icon: Package },
              { key: 'price', label: 'Price Alerts', icon: DollarSign },
              { key: 'delivery', label: 'Delivery', icon: Truck }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key as any)}
                className={filter === key ? "bg-vendor hover:bg-vendor/90" : ""}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
                {key === 'unread' && unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-b-2 border-vendor mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {filter === 'unread' 
                  ? 'All caught up! You have no unread notifications.'
                  : 'You\'ll see notifications about orders, prices, and deliveries here.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type, notification.priority);
              
              return (
                <Card 
                  key={notification.id} 
                  className={`border-l-4 transition-all hover:shadow-md ${colorClass} ${
                    !notification.isRead ? 'bg-opacity-100' : 'bg-opacity-50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-full ${
                          notification.priority === 'high' ? 'bg-red-100 text-red-600' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`font-semibold ${
                              !notification.isRead ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-vendor rounded-full"></div>
                            )}
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                notification.priority === 'high' ? 'border-red-300 text-red-700' :
                                notification.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                                'border-gray-300 text-gray-700'
                              }`}
                            >
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className={`text-sm ${
                            !notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'
                          } mb-2`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(notification.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-4">
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
