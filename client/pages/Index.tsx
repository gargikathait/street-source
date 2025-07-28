import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { VendorsResponse, AnalyticsResponse, Vendor } from "@shared/api";
import { useLanguage } from "@/hooks/use-language";
import { useCart } from "@/hooks/use-cart";
import { useGroupOrders } from "@/hooks/use-group-orders";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Button } from "@/components/ui/button";
import AuthForm from "@/components/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderManagement } from "@/components/OrderManagement";
import { TrackingModal } from "@/components/DeliveryTracking";
import { PaymentProcessor } from "@/components/PaymentProcessor";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Users,
  TrendingUp,
  Shield,
  BarChart3,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  LogOut,
  Menu,
  X,
  Star,
  Truck,
  Globe,
  Zap,
  FileText,
  Package2,
  Search,
  MapPin,
  Phone,
  ShoppingCart,
  User,
  UserCircle,
  Bell,
  CreditCard,
  HelpCircle,
  BookOpen,
  Store,
  Award,
  Calendar,
  Edit,
  Save,
  Upload,
  Download,
  Notification,
  History,
  BarChart,
  PieChart
} from "lucide-react";

// Using Vendor type from shared API

interface MetricData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

export default function Index() {
  const { t } = useLanguage();
  const { cart, addToCart, getCartItemCount } = useCart();
  const { getRecommendedGroupOrders, joinGroupOrder } = useGroupOrders();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOrderManagement, setShowOrderManagement] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [editingProfile, setEditingProfile] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vendorData, setVendorData] = useState<Vendor[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch vendor data from API
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vendors');
      const data: VendorsResponse = await response.json();
      if (data.success) {
        setVendorData(data.data);
      }
    } catch (err) {
      setError('Failed to fetch vendor data');
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data: AnalyticsResponse = await response.json();
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  // Initial data fetch when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchVendors();
      fetchAnalytics();

      // Set up real-time updates every 30 seconds
      const interval = setInterval(() => {
        fetchVendors();
        fetchAnalytics();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Fetch user location
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserLocation();
    }
  }, [isAuthenticated]);

  const fetchUserLocation = async () => {
    try {
      const response = await fetch('/api/location');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setUserLocation(data.data);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      // Set a default location to prevent dependent calls from failing
      setUserLocation({
        latitude: 28.6139,
        longitude: 77.2090,
        address: "New Delhi, India"
      });
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/vendor_001');
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const updateVendorProfile = async (updates: any) => {
    try {
      const response = await fetch('/api/vendor/profile/vendor_001', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const result = await response.json();
      if (result.success) {
        // Update local state with new data using setState
        setVendorProfile(prev => ({ ...prev, ...updates }));
        setEditingProfile(false);
        toast({
          title: t('profileUpdated'),
          description: t('profileUpdatedSuccess')
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Even if API call fails, update locally for demo purposes
      setVendorProfile(prev => ({ ...prev, ...updates }));
      setEditingProfile(false);
      toast({
        title: t('profileUpdated'),
        description: t('profileUpdatedSuccess')
      });
    }
  };

  // Use fetched data or fallback to empty array
  const displayVendors = vendorData.length > 0 ? vendorData : [];

  // Fetch real-time materials from API
  const [realTimeRawMaterials, setRealTimeRawMaterials] = useState<any[]>([]);

  const fetchRawMaterials = async (query?: string, category?: string) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (category && category !== 'all') params.append('category', category);
      if (userLocation) {
        params.append('latitude', userLocation.latitude.toString());
        params.append('longitude', userLocation.longitude.toString());
      }

      const response = await fetch(`/api/materials?${params}`);

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setRealTimeRawMaterials(data.data);
        return data.data;
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      // Return empty array on error to prevent crashes
      return [];
    }
    return [];
  };

  useEffect(() => {
    if (userLocation && isAuthenticated) {
      fetchRawMaterials();
    }
  }, [userLocation, isAuthenticated]);

  // Fallback raw materials database
  const rawMaterials = [
    {
      id: "1",
      name: "Rice (Basmati)",
      category: "Grains",
      description: "Premium quality basmati rice",
      basePrice: 80,
      unit: "kg",
      suppliers: [
        { id: "1", name: "Mumbai Grains Wholesale", price: 78, quality: 4.8, distance: "2.5km", availability: "In Stock", rating: 4.8 },
        { id: "2", name: "Delhi Fresh Supply", price: 82, quality: 4.5, distance: "5.2km", availability: "In Stock", rating: 4.5 },
        { id: "3", name: "Rajasthan Rice Mills", price: 75, quality: 4.6, distance: "8.1km", availability: "Limited", rating: 4.6 }
      ]
    },
    {
      id: "2",
      name: "Potatoes",
      category: "Vegetables",
      description: "Fresh potatoes for cooking",
      basePrice: 30,
      unit: "kg",
      suppliers: [
        { id: "4", name: "Delhi Fresh Vegetables", price: 25, quality: 4.2, distance: "1.8km", availability: "In Stock", rating: 4.2 },
        { id: "5", name: "Punjab Potato Farm", price: 28, quality: 4.5, distance: "12km", availability: "In Stock", rating: 4.5 },
        { id: "6", name: "Local Sabzi Mandi", price: 32, quality: 4.0, distance: "0.5km", availability: "In Stock", rating: 4.0 }
      ]
    },
    {
      id: "3",
      name: "Onions",
      category: "Vegetables",
      description: "Fresh red onions",
      basePrice: 40,
      unit: "kg",
      suppliers: [
        { id: "7", name: "Maharashtra Onion Co.", price: 35, quality: 4.3, distance: "3.2km", availability: "In Stock", rating: 4.3 },
        { id: "8", name: "Nashik Direct Supply", price: 38, quality: 4.6, distance: "15km", availability: "In Stock", rating: 4.6 },
        { id: "9", name: "Local Vendors", price: 42, quality: 3.8, distance: "0.3km", availability: "Limited", rating: 3.8 }
      ]
    },
    {
      id: "4",
      name: "Sunflower Oil",
      category: "Oils",
      description: "Refined sunflower cooking oil",
      basePrice: 150,
      unit: "liter",
      suppliers: [
        { id: "10", name: "Bangalore Oil Mills", price: 135, quality: 4.9, distance: "4.1km", availability: "In Stock", rating: 4.9 },
        { id: "11", name: "Fortune Distributors", price: 148, quality: 4.7, distance: "2.8km", availability: "In Stock", rating: 4.7 },
        { id: "12", name: "Local Oil Depot", price: 152, quality: 4.1, distance: "1.2km", availability: "In Stock", rating: 4.1 }
      ]
    },
    {
      id: "5",
      name: "Turmeric Powder",
      category: "Spices",
      description: "Pure turmeric powder",
      basePrice: 180,
      unit: "kg",
      suppliers: [
        { id: "13", name: "Pune Spice Market", price: 170, quality: 4.7, distance: "3.5km", availability: "In Stock", rating: 4.7 },
        { id: "14", name: "Andhra Spice Co.", price: 165, quality: 4.8, distance: "18km", availability: "In Stock", rating: 4.8 },
        { id: "15", name: "Traditional Spices", price: 185, quality: 4.4, distance: "6.2km", availability: "Limited", rating: 4.4 }
      ]
    },
    {
      id: "6",
      name: "Wheat Flour",
      category: "Grains",
      description: "Fresh wheat flour",
      basePrice: 45,
      unit: "kg",
      suppliers: [
        { id: "16", name: "Mumbai Grains Wholesale", price: 42, quality: 4.5, distance: "2.5km", availability: "In Stock", rating: 4.5 },
        { id: "17", name: "Punjab Wheat Mills", price: 40, quality: 4.6, distance: "14km", availability: "In Stock", rating: 4.6 },
        { id: "18", name: "Local Flour Mill", price: 47, quality: 4.2, distance: "0.8km", availability: "In Stock", rating: 4.2 }
      ]
    },
    {
      id: "7",
      name: "Tomatoes",
      category: "Vegetables",
      description: "Fresh red tomatoes",
      basePrice: 50,
      unit: "kg",
      suppliers: [
        { id: "19", name: "Delhi Fresh Vegetables", price: 45, quality: 4.3, distance: "1.8km", availability: "In Stock", rating: 4.3 },
        { id: "20", name: "Karnataka Tomato Farm", price: 48, quality: 4.7, distance: "22km", availability: "In Stock", rating: 4.7 },
        { id: "21", name: "Greenhouse Supply", price: 55, quality: 4.8, distance: "12km", availability: "Limited", rating: 4.8 }
      ]
    },
    {
      id: "8",
      name: "Garam Masala",
      category: "Spices",
      description: "Blend of aromatic spices",
      basePrice: 450,
      unit: "kg",
      suppliers: [
        { id: "22", name: "Pune Spice Market", price: 420, quality: 4.6, distance: "3.5km", availability: "In Stock", rating: 4.6 },
        { id: "23", name: "Kerala Spice Co.", price: 435, quality: 4.8, distance: "25km", availability: "In Stock", rating: 4.8 },
        { id: "24", name: "Traditional Masala", price: 465, quality: 4.4, distance: "8.5km", availability: "In Stock", rating: 4.4 }
      ]
    }
  ];

  // Enhanced search functionality with real-time API
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const materials = await fetchRawMaterials(query, selectedCategory);
    setSearchResults(materials);
    setShowSearchResults(true);
  };

  // Get best price for a material
  const getBestPrice = (suppliers: any[]) => {
    return Math.min(...suppliers.map(s => s.price));
  };

  // Get best supplier for a material
  const getBestSupplier = (suppliers: any[]) => {
    return suppliers.reduce((best, supplier) => {
      const score = (supplier.quality * 2) + (5 - (supplier.price / 50)) + (supplier.availability === "In Stock" ? 1 : 0);
      const bestScore = (best.quality * 2) + (5 - (best.price / 50)) + (best.availability === "In Stock" ? 1 : 0);
      return score > bestScore ? supplier : best;
    });
  };

  const metrics: MetricData[] = analyticsData ? [
    { label: t('availableSuppliers'), value: analyticsData.totalVendors.toLocaleString(), change: "+12%", trend: 'up' },
    { label: t('thisMonthOrders'), value: analyticsData.activeOrders.toLocaleString(), change: "+8%", trend: 'up' },
    { label: t('avgQualityRating'), value: `${analyticsData.qualityScore.toFixed(1)}%`, change: analyticsData.trends.qualityTrend, trend: 'up' },
    { label: t('moneySaved'), value: `₹${(analyticsData.costSavings / 1000).toFixed(1)}k`, change: "+15%", trend: 'up' }
  ] : [
    { label: t('availableSuppliers'), value: "247", change: "+12%", trend: 'up' },
    { label: t('thisMonthOrders'), value: "89", change: "+8%", trend: 'up' },
    { label: t('avgQualityRating'), value: "4.2/5", change: "+0.2", trend: 'up' },
    { label: t('moneySaved'), value: "₹47.2k", change: "+15%", trend: 'up' }
  ];

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    // Reset all application state
    setIsAuthenticated(false);
    setActiveTab("dashboard");
    setShowProfile(false);
    setShowSettings(false);
    setShowOrderManagement(false);
    setShowPaymentModal(false);
    setEditingProfile(false);
    setMobileMenuOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);

    // Clear any cached data
    setVendorData([]);
    setAnalyticsData(null);
    setNotifications([]);
    setRealTimeRawMaterials([]);

    // Show success message
    toast({
      title: t('signedOut'),
      description: t('signedOutSuccess')
    });

    // Optionally reload the page for a complete reset
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Vendor profile state
  const [vendorProfile, setVendorProfile] = useState({
    id: "vendor_001",
    name: "Radhika Shukla",
    businessName: "Shukla Street Foods",
    email: "radhika.shukla@example.com",
    phone: "+91 98765 43210",
    address: "Shop 22, Karol Bagh, New Delhi 110005",
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
    subscriptionPlan: "Premium"
  });

  // Authentication handler
  const handleAuthenticate = (userData: any) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setVendorProfile(prev => ({
      ...prev,
      name: userData.ownerName || userData.businessName || prev.name,
      businessName: userData.businessName || prev.businessName,
      email: userData.email || prev.email,
      phone: userData.phone || prev.phone,
      businessType: userData.businessType || prev.businessType,
      address: userData.address || prev.address
    }));
  };

  // Show authentication form if not authenticated
  if (!isAuthenticated) {
    return <AuthForm onAuthenticate={handleAuthenticate} />;
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-vendor mr-2 sm:mr-3" />
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">StreetSource</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-2 xl:space-x-4">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                onClick={() => setActiveTab("dashboard")}
                className="text-xs xl:text-sm px-2 xl:px-3"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {t('dashboard')}
              </Button>
              <Link to="/menu">
                <Button variant="ghost" className="text-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  {t('menu')}
                </Button>
              </Link>
              <Link to="/suppliers">
                <Button variant="ghost" className="text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  {t('suppliers')}
                </Button>
              </Link>
              <Link to="/inventory">
                <Button variant="ghost" className="text-sm">
                  <Package2 className="w-4 h-4 mr-2" />
                  {t('inventory')}
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="ghost" className="text-sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {t('analytics')}
                </Button>
              </Link>
            </nav>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOrderManagement(true)}
                className="p-1 sm:p-2 relative"
                title={t('cart')}
              >
                <ShoppingCart className="w-4 h-4" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemCount() > 9 ? '9+' : getCartItemCount()}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowSettings(true);
                  setShowProfile(false);
                }}
                className="p-1 sm:p-2"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowProfile(true);
                  setShowSettings(false);
                }}
                className="p-1 sm:p-2"
              >
                <UserCircle className="w-4 h-4" />
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-1 sm:p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="px-3 sm:px-4 py-3 space-y-2">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
                className="w-full justify-start"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {t('dashboard')}
              </Button>
              <Link to="/menu">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <FileText className="w-4 h-4 mr-2" />
                  {t('menu')}
                </Button>
              </Link>
              <Link to="/suppliers">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <Users className="w-4 h-4 mr-2" />
                  {t('suppliers')}
                </Button>
              </Link>
              <Link to="/inventory">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <Package2 className="w-4 h-4 mr-2" />
                  {t('inventory')}
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {t('analytics')}
                </Button>
              </Link>
              <Link to="/notifications">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <Bell className="w-4 h-4 mr-2" />
                  {t('notifications')}
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white text-xs">
                      {notifications.filter(n => !n.isRead).length}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Profile Sidebar */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/20" onClick={() => setShowProfile(false)} />
          <div className="relative ml-auto w-full max-w-sm sm:max-w-md bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Vendor Profile</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowProfile(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {/* Profile Header */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-full bg-vendor text-vendor-foreground flex items-center justify-center text-2xl font-bold mb-3">
                      {vendorProfile.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <Award className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{vendorProfile.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{vendorProfile.businessName}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">{vendorProfile.verificationStatus}</Badge>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{vendorProfile.totalOrders}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Orders</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{vendorProfile.avgRating}/5</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{vendorProfile.monthlyRevenue}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Monthly Revenue</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{vendorProfile.subscriptionPlan}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Plan</div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Business Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Store className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Business Type</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{vendorProfile.businessType}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Address</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{vendorProfile.address}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Phone</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{vendorProfile.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Operating Hours</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{vendorProfile.operatingHours}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {vendorProfile.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline">{specialty}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Account Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Member Since:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{vendorProfile.joinedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">License:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{vendorProfile.businessLicense}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setEditingProfile(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowOrderManagement(true)}
                >
                  <Package className="w-4 h-4 mr-2" />
                  My Orders
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowProfile(false);
                    setShowSettings(true);
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Sidebar */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/20" onClick={() => setShowSettings(false)} />
          <div className="relative ml-auto w-full max-w-sm sm:max-w-md bg-white dark:bg-gray-800 shadow-xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="space-y-6 p-6">
                  {/* Account Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Account Settings</h3>
                    <div className="space-y-3">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="w-4 h-4 mr-3" />
                        Profile Information
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Bell className="w-4 h-4 mr-3" />
                        Notifications
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-3" />
                        Privacy & Security
                      </Button>
                    </div>
                  </div>

                  {/* Business Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Business Settings</h3>
                    <div className="space-y-3">
                      <Button variant="ghost" className="w-full justify-start">
                        <Store className="w-4 h-4 mr-3" />
                        Business Details
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <CreditCard className="w-4 h-4 mr-3" />
                        Payment Methods
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-3" />
                        Tax & Legal
                      </Button>
                    </div>
                  </div>

                  {/* App Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">App Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Language</span>
                        </div>
                        <LanguageSelector />
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Theme</span>
                        </div>
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>

                  {/* Help & Support */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Help & Support</h3>
                    <div className="space-y-3">
                      <Button variant="ghost" className="w-full justify-start">
                        <HelpCircle className="w-4 h-4 mr-3" />
                        Help Center
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <BookOpen className="w-4 h-4 mr-3" />
                        User Guide
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Phone className="w-4 h-4 mr-3" />
                        Contact Support
                      </Button>
                    </div>
                  </div>

                  {/* App Information */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center space-y-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">StreetSource v2.1.0</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">© 2024 StreetSource Technologies</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Management Modal */}
      <Dialog open={showOrderManagement} onOpenChange={setShowOrderManagement}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Management</DialogTitle>
            <DialogDescription>Manage your orders and deliveries</DialogDescription>
          </DialogHeader>
          <OrderManagement />
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <PaymentProcessor
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderId={selectedOrderForPayment}
        amount={paymentAmount}
        onSuccess={(transactionId) => {
          console.log('Payment successful:', transactionId);
          setShowPaymentModal(false);
          fetchOrders(); // Refresh orders
        }}
      />

      {/* Profile Edit Modal */}
      <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your vendor profile information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={vendorProfile.name} />
              </div>
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" defaultValue={vendorProfile.businessName} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={vendorProfile.email} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue={vendorProfile.phone} />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" defaultValue={vendorProfile.address} />
            </div>
            <div>
              <Label htmlFor="specialties">Specialties (comma separated)</Label>
              <Input id="specialties" defaultValue={vendorProfile.specialties.join(', ')} />
            </div>
            <div>
              <Label htmlFor="hours">Operating Hours</Label>
              <Input id="hours" defaultValue={vendorProfile.operatingHours} />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setEditingProfile(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Get form values and update profile
                  const form = document.getElementById('name')?.closest('form') || document;
                  const updates = {
                    name: (form.querySelector('#name') as HTMLInputElement)?.value,
                    businessName: (form.querySelector('#businessName') as HTMLInputElement)?.value,
                    email: (form.querySelector('#email') as HTMLInputElement)?.value,
                    phone: (form.querySelector('#phone') as HTMLInputElement)?.value,
                    address: (form.querySelector('#address') as HTMLTextAreaElement)?.value,
                    specialties: (form.querySelector('#specialties') as HTMLInputElement)?.value.split(',').map(s => s.trim()),
                    operatingHours: (form.querySelector('#hours') as HTMLInputElement)?.value
                  };
                  updateVendorProfile(updates);
                }}
                className="flex-1 bg-vendor hover:bg-vendor/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>



      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Welcome Section with Location */}
            <div className="bg-gradient-to-r from-vendor to-quality text-white rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">{t('welcomeBack')}, {vendorProfile.name}!</h2>
                  <p className="text-vendor-foreground/90 mb-2 text-sm sm:text-base">
                    {t('welcomeMessage')}
                  </p>
                  {userLocation && (
                    <div className="flex items-center space-x-1 text-vendor-foreground/80">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{userLocation.city}, {userLocation.state}</span>
                    </div>
                  )}
                </div>
                <div className="text-left sm:text-right bg-white/10 rounded-lg p-3 sm:bg-transparent sm:p-0">
                  <div className="text-xs sm:text-sm text-vendor-foreground/80">{t('todaysRevenue')}</div>
                  <div className="text-lg sm:text-xl font-bold">₹4,250</div>
                  <div className="text-xs sm:text-sm text-vendor-foreground/80">+12% {t('fromYesterday')}</div>
                </div>
              </div>
            </div>

            {/* Recommended Group Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-vendor" />
                  {t('recommendedGroupOrders')}
                </CardTitle>
                <CardDescription>
                  {t('joinGroupOrdersDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {getRecommendedGroupOrders().slice(0, 2).map((groupOrder) => (
                  <div key={groupOrder.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{groupOrder.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{groupOrder.description}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {groupOrder.groupDiscount}% OFF
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 mb-2">
                      <span>{groupOrder.participants.length}/{groupOrder.maxParticipants} vendors</span>
                      <span>₹{groupOrder.currentAmount}/₹{groupOrder.targetAmount}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-vendor h-2 rounded-full"
                        style={{ width: `${Math.min((groupOrder.currentAmount / groupOrder.targetAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-vendor hover:bg-vendor/90"
                      onClick={() => {
                        // For demo, auto-join with sample items
                        const sampleItems = groupOrder.materials.slice(0, 1).map(material => ({
                          materialId: material.materialId,
                          materialName: material.materialName,
                          quantity: 5,
                          unit: material.unit,
                          price: material.pricePerUnit
                        }));
                        joinGroupOrder(groupOrder.id, sampleItems);
                      }}
                    >
                      {t('joinGroupOrder')}
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  {t('viewAllGroupOrders')}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowOrderManagement(true)}>
                <CardContent className="p-3 sm:p-4 text-center">
                  <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-vendor" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{t('myOrders')}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t('viewTrackOrders')}</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4 text-center">
                  <BarChart className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-vendor" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{t('analytics')}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t('businessInsights')}</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowProfile(true)}>
                <CardContent className="p-3 sm:p-4 text-center">
                  <User className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-vendor" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{t('myProfile')}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{t('manageAccount')}</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4 text-center">
                  <Bell className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-vendor" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{t('notifications')}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{notifications.filter(n => !n.isRead).length} {t('unread')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Raw Materials Search Bar */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-vendor" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{t('searchRawMaterials')}</h3>
                  </div>

                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 h-10 sm:h-12 text-sm sm:text-lg"
                      />
                    </div>

                    <Select value={selectedCategory} onValueChange={(value) => {
                      setSelectedCategory(value);
                      if (searchQuery) handleSearch(searchQuery);
                    }}>
                      <SelectTrigger className="w-full h-10 sm:h-12">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Grains">Grains & Cereals</SelectItem>
                        <SelectItem value="Vegetables">Vegetables</SelectItem>
                        <SelectItem value="Spices">Spices</SelectItem>
                        <SelectItem value="Oils">Oils</SelectItem>
                        <SelectItem value="Dairy">Dairy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Search Suggestions */}
                  {!showSearchResults && searchQuery.length === 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Popular searches:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Rice", "Potatoes", "Onions", "Oil", "Flour", "Spices"].map((item) => (
                          <Button
                            key={item}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSearch(item)}
                            className="text-xs"
                          >
                            {item}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            {showSearchResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Search Results ({searchResults.length})</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {searchResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No raw materials found for "{searchQuery}"</p>
                      <p className="text-sm mt-2">Try different keywords or check spelling</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {searchResults.map((material) => {
                        const bestPrice = getBestPrice(material.suppliers);
                        const bestSupplier = getBestSupplier(material.suppliers);

                        return (
                          <Card key={material.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2 flex-wrap">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{material.name}</h4>
                                    <Badge variant="secondary">{material.category}</Badge>
                                    <Badge className="bg-green-100 text-green-800">
                                      Best: ₹{bestPrice}/{material.unit}
                                    </Badge>
                                    <Badge className="bg-blue-100 text-blue-800">
                                      <Shield className="w-3 h-3 mr-1" />
                                      {t('verifiedSupplier')}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300 mb-3">{material.description}</p>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                      <DollarSign className="w-4 h-4 mx-auto mb-1 text-green-600" />
                                      <div className="text-sm font-medium">₹{bestPrice}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">Best Price</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                      <Users className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                                      <div className="text-sm font-medium">{material.suppliers.length}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">Suppliers</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                      <Star className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
                                      <div className="text-sm font-medium">{bestSupplier.quality}/5</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">Best Quality</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                      <MapPin className="w-4 h-4 mx-auto mb-1 text-orange-500" />
                                      <div className="text-sm font-medium">{bestSupplier.distance}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {parseFloat(bestSupplier.distance) < 5 ? t('veryNear') : t('nearby')}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col space-y-2 lg:ml-6">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                    className="bg-vendor hover:bg-vendor/90"
                                    onClick={() => {
                                      // Add best supplier option to cart
                                      const bestSupplier = getBestSupplier(material.suppliers);
                                      addToCart({
                                        materialId: material.id,
                                        materialName: material.name,
                                        supplierId: bestSupplier.id || 'default',
                                        supplierName: bestSupplier.name,
                                        quantity: 1,
                                        unit: material.unit,
                                        price: bestSupplier.price,
                                        stockQuantity: 100,
                                        minimumQuantity: 1
                                      });
                                    }}
                                  >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add to Cart
                                  </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle>{material.name} - Supplier Comparison</DialogTitle>
                                        <DialogDescription>
                                          Compare prices and quality from different suppliers
                                        </DialogDescription>
                                      </DialogHeader>

                                      <div className="space-y-4">
                                        {material.suppliers
                                          .sort((a: any, b: any) => a.price - b.price)
                                          .map((supplier: any, index: number) => (
                                            <div key={supplier.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                              <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center space-x-3">
                                                  {index === 0 && (
                                                    <Badge className="bg-green-100 text-green-800">Best Price</Badge>
                                                  )}
                                                  <h5 className="font-medium text-gray-900 dark:text-gray-100">{supplier.name}</h5>
                                                  <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-sm">{supplier.quality}</span>
                                                  </div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">₹{supplier.price}/{material.unit}</div>
                                                  <div className="text-sm text-gray-500 dark:text-gray-400">{supplier.distance} away</div>
                                                </div>
                                              </div>

                                              <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                  <span className="text-gray-600 dark:text-gray-300">Quality:</span>
                                                  <div className="font-medium">{supplier.quality}/5 ⭐</div>
                                                </div>
                                                <div>
                                                  <span className="text-gray-600 dark:text-gray-300">Availability:</span>
                                                  <div className={`font-medium ${supplier.availability === 'In Stock' ? 'text-green-600' : 'text-orange-600'}`}>
                                                    {supplier.availability}
                                                  </div>
                                                </div>
                                                <div>
                                                  <span className="text-gray-600 dark:text-gray-300">Distance:</span>
                                                  <div className="font-medium">{supplier.distance}</div>
                                                </div>
                                              </div>

                                              <div className="mt-3 flex space-x-2">
                                                <Button size="sm" className="bg-vendor hover:bg-vendor/90">
                                                  <Phone className="w-4 h-4 mr-1" />
                                                  Contact
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                  <ShoppingCart className="w-4 h-4 mr-1" />
                                                  Add to Order
                                                </Button>
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    </DialogContent>
                                  </Dialog>

                                  <Button
                                    variant="outline"
                                    onClick={() => setShowOrderManagement(true)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Orders
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {metrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">{metric.label}</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
                      </div>
                      <div className={`flex items-center text-xs sm:text-sm flex-shrink-0 ml-2 ${
                        metric.trend === 'up' ? 'text-green-600 dark:text-green-400' :
                        metric.trend === 'down' ? 'text-red-600 dark:text-red-400' :
                        'text-gray-600 dark:text-gray-300'
                      }`}>
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">{metric.change}</span>
                        <span className="sm:hidden">{metric.change.replace('%', '')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-quality" />
                    {t('quickActions')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/menu">
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      {t('manageMenu')}
                    </Button>
                  </Link>
                  <Link to="/suppliers">
                    <Button className="w-full justify-start" variant="outline">
                      <Package className="w-4 h-4 mr-2" />
                      {t('compareSuppliers')}
                    </Button>
                  </Link>
                  <Link to="/inventory">
                    <Button className="w-full justify-start" variant="outline">
                      <Package2 className="w-4 h-4 mr-2" />
                      {t('checkInventory')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                    {t('recentAlerts')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <span className="text-sm">₹15/kg rice - {t('newSupplier')}</span>
                    <Badge variant="default" className="bg-green-600">{t('bestDeal')}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <span className="text-sm">Onion {t('pricesIncreased')} 20%</span>
                    <Badge variant="outline" className="text-yellow-600">{t('priceAlert')}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <span className="text-sm">Tomato {t('harvestSeason')}</span>
                    <Badge variant="default" className="bg-blue-600">{t('seasonal')}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-pricing" />
                    {t('recentActivity')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>{t('orderedWheatFlour')}</span>
                      <span className="text-gray-500 dark:text-gray-400">2m ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('comparedSuppliers')}</span>
                      <span className="text-gray-500 dark:text-gray-400">15m ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('savedMoney')}</span>
                      <span className="text-gray-500 dark:text-gray-400">1h ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "vendors" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('rawMaterialsSuppliers')}</h2>
              <Link to="/onboarding">
                <Button className="bg-vendor hover:bg-vendor/90">
                  <Users className="w-4 h-4 mr-2" />
                  {t('addSupplier')}
                </Button>
              </Link>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-b-2 border-vendor mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">{t('loadingVendors')}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
                <Button onClick={fetchVendors} variant="outline" className="mt-2">
                  {t('retry')}
                </Button>
              </div>
            )}

            <div className="grid gap-6">
              {displayVendors.map((vendor) => (
                <Card key={vendor.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{vendor.name}</h3>
                          <Badge 
                            variant={vendor.status === 'active' ? 'default' : 'secondary'}
                            className={vendor.status === 'active' ? 'bg-green-600' : ''}
                          >
                            {vendor.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{vendor.category}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('quality')}</span>
                              <span className="text-sm font-bold text-quality">{vendor.qualityScore}%</span>
                            </div>
                            <Progress value={vendor.qualityScore} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('pricing')}</span>
                              <span className="text-sm font-bold text-pricing">{vendor.pricing}%</span>
                            </div>
                            <Progress value={vendor.pricing} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('availability')}</span>
                              <span className="text-sm font-bold text-availability">{vendor.availability}%</span>
                            </div>
                            <Progress value={vendor.availability} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row items-stretch lg:items-center space-y-2 lg:space-y-0 lg:space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          {t('view')}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          {t('manage')}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('lastUpdated')}: {new Date(vendor.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics & Insights</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Key metrics from the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Quality Score</span>
                      <span className="text-2xl font-bold text-quality">91.2%</span>
                    </div>
                    <Progress value={91.2} className="h-3" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cost Efficiency</span>
                      <span className="text-2xl font-bold text-pricing">87.5%</span>
                    </div>
                    <Progress value={87.5} className="h-3" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Supply Reliability</span>
                      <span className="text-2xl font-bold text-availability">94.8%</span>
                    </div>
                    <Progress value={94.8} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vendor Distribution</CardTitle>
                  <CardDescription>By category and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-vendor"></div>
                        <span className="text-sm">Electronics</span>
                      </div>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-supply"></div>
                        <span className="text-sm">Raw Materials</span>
                      </div>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-quality"></div>
                        <span className="text-sm">Logistics</span>
                      </div>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-pricing"></div>
                        <span className="text-sm">Services</span>
                      </div>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>AI-powered recommendations for your vendor portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">Optimization Opportunity</span>
                    </div>
                    <p className="text-sm text-green-800">
                      Consider increasing orders from TechSupply Co. - 15% cost reduction potential
                    </p>
                  </div>
                  
                  <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Risk Alert</span>
                    </div>
                    <p className="text-sm text-yellow-800">
                      Single source dependency detected for Component X - diversify suppliers
                    </p>
                  </div>
                  
                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Performance Highlight</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Global Materials exceeded quality targets for 3 consecutive months
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
