import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  ArrowLeft, 
  Plus,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Clock,
  BarChart3,
  Search,
  Filter,
  Download,
  RefreshCw,
  Truck,
  DollarSign,
  Package2,
  AlertCircle
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  minStockLevel: number;
  maxStockLevel: number;
  costPerUnit: number;
  supplier: string;
  location: string;
  lastRestocked: string;
  expiryDate?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
  dailyUsage: number;
  daysRemaining: number;
  totalValue: number;
}

interface StockAlert {
  id: string;
  itemName: string;
  type: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'high_usage';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  actionRequired: string;
}

export default function Inventory() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample inventory data
  const sampleInventory: InventoryItem[] = [
    {
      id: "1",
      name: "Potatoes",
      category: "Vegetables",
      currentStock: 45,
      unit: "kg",
      minStockLevel: 20,
      maxStockLevel: 100,
      costPerUnit: 30,
      supplier: "Delhi Fresh Vegetables",
      location: "Storage Room A",
      lastRestocked: "2024-01-15",
      status: 'in_stock',
      dailyUsage: 8,
      daysRemaining: 5,
      totalValue: 1350
    },
    {
      id: "2",
      name: "Onions",
      category: "Vegetables",
      currentStock: 12,
      unit: "kg",
      minStockLevel: 15,
      maxStockLevel: 50,
      costPerUnit: 40,
      supplier: "Mumbai Grains Wholesale",
      location: "Storage Room A",
      lastRestocked: "2024-01-10",
      status: 'low_stock',
      dailyUsage: 5,
      daysRemaining: 2,
      totalValue: 480
    },
    {
      id: "3",
      name: "Cooking Oil",
      category: "Oils",
      currentStock: 0,
      unit: "liters",
      minStockLevel: 5,
      maxStockLevel: 20,
      costPerUnit: 150,
      supplier: "Bangalore Oil Mills",
      location: "Storage Room B",
      lastRestocked: "2024-01-05",
      status: 'out_of_stock',
      dailyUsage: 2,
      daysRemaining: 0,
      totalValue: 0
    },
    {
      id: "4",
      name: "Tomatoes",
      category: "Vegetables",
      currentStock: 25,
      unit: "kg",
      minStockLevel: 10,
      maxStockLevel: 40,
      costPerUnit: 50,
      supplier: "Delhi Fresh Vegetables",
      location: "Cold Storage",
      lastRestocked: "2024-01-14",
      expiryDate: "2024-01-20",
      status: 'in_stock',
      dailyUsage: 6,
      daysRemaining: 4,
      totalValue: 1250
    },
    {
      id: "5",
      name: "Chickpea Flour",
      category: "Grains",
      currentStock: 18,
      unit: "kg",
      minStockLevel: 10,
      maxStockLevel: 50,
      costPerUnit: 80,
      supplier: "Mumbai Grains Wholesale",
      location: "Dry Storage",
      lastRestocked: "2024-01-12",
      status: 'in_stock',
      dailyUsage: 3,
      daysRemaining: 6,
      totalValue: 1440
    },
    {
      id: "6",
      name: "Milk",
      category: "Dairy",
      currentStock: 8,
      unit: "liters",
      minStockLevel: 10,
      maxStockLevel: 30,
      costPerUnit: 50,
      supplier: "Local Dairy",
      location: "Refrigerator",
      lastRestocked: "2024-01-16",
      expiryDate: "2024-01-18",
      status: 'low_stock',
      dailyUsage: 4,
      daysRemaining: 2,
      totalValue: 400
    }
  ];

  // Sample alerts
  const sampleAlerts: StockAlert[] = [
    {
      id: "1",
      itemName: "Cooking Oil",
      type: 'out_of_stock',
      severity: 'critical',
      message: "Cooking oil is completely out of stock",
      timestamp: "2 hours ago",
      actionRequired: "Order immediately - affects multiple menu items"
    },
    {
      id: "2",
      itemName: "Onions",
      type: 'low_stock',
      severity: 'high',
      message: "Only 12kg remaining, below minimum threshold",
      timestamp: "4 hours ago",
      actionRequired: "Restock within 2 days"
    },
    {
      id: "3",
      itemName: "Milk",
      type: 'expiring_soon',
      severity: 'medium',
      message: "Expires in 2 days",
      timestamp: "6 hours ago",
      actionRequired: "Use for tomorrow's chai orders"
    },
    {
      id: "4",
      itemName: "Potatoes",
      type: 'high_usage',
      severity: 'low',
      message: "Usage increased 30% this week",
      timestamp: "1 day ago",
      actionRequired: "Consider increasing stock levels"
    }
  ];

  useEffect(() => {
    setInventoryItems(sampleInventory);
    setAlerts(sampleAlerts);
  }, []);

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventoryItems.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length;
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <Package className="w-8 h-8 text-vendor mr-3" />
              <h1 className="text-xl font-bold text-gray-900">StreetSource</h1>
            </Link>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <LanguageSelector />
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('backToDashboard')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h2>
          <p className="text-gray-600">Track your raw materials and get smart restocking alerts</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalInventoryValue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Items in Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{inventoryItems.length}</p>
                </div>
                <Package2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
                  <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                  <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inventory">Stock Levels</TabsTrigger>
            <TabsTrigger value="alerts">Alerts ({alerts.length})</TabsTrigger>
            <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
            <TabsTrigger value="suppliers">Reorder</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Vegetables">Vegetables</SelectItem>
                      <SelectItem value="Grains">Grains</SelectItem>
                      <SelectItem value="Oils">Oils</SelectItem>
                      <SelectItem value="Dairy">Dairy</SelectItem>
                      <SelectItem value="Spices">Spices</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="low_stock">Low Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Items */}
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <Badge variant="secondary">{item.category}</Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-600">Current Stock</span>
                            <div className="font-medium text-lg">
                              {item.currentStock} {item.unit}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Daily Usage</span>
                            <div className="font-medium">
                              {item.dailyUsage} {item.unit}/day
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Days Remaining</span>
                            <div className="font-medium">
                              {item.daysRemaining} days
                            </div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Total Value</span>
                            <div className="font-medium">
                              ₹{item.totalValue.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Stock Level</span>
                            <span>{Math.round((item.currentStock / item.maxStockLevel) * 100)}% of max</span>
                          </div>
                          <Progress 
                            value={(item.currentStock / item.maxStockLevel) * 100} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Min: {item.minStockLevel}{item.unit}</span>
                            <span>Max: {item.maxStockLevel}{item.unit}</span>
                          </div>
                        </div>

                        <div className="mt-3 text-sm text-gray-600">
                          <span>Supplier: {item.supplier}</span>
                          <span className="mx-2">•</span>
                          <span>Location: {item.location}</span>
                          <span className="mx-2">•</span>
                          <span>Last restocked: {new Date(item.lastRestocked).toLocaleDateString()}</span>
                          {item.expiryDate && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="text-orange-600">Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 lg:ml-6">
                        <Button 
                          size="sm" 
                          className="bg-vendor hover:bg-vendor/90"
                          disabled={item.status === 'in_stock'}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Reorder
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                  Stock Alerts & Notifications
                </CardTitle>
                <CardDescription>
                  Real-time alerts for inventory management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 border rounded-lg ${getSeverityColor(alert.severity)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{alert.itemName}</h4>
                        <p className="text-sm">{alert.message}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          {alert.type.replace('_', ' ')}
                        </Badge>
                        <div className="text-xs text-gray-500">{alert.timestamp}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm font-medium">Action: {alert.actionRequired}</span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Item
                        </Button>
                        <Button size="sm" className="bg-vendor hover:bg-vendor/90">
                          Take Action
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Trends</CardTitle>
                  <CardDescription>Daily consumption patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventoryItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <div className="text-sm text-gray-500">{item.dailyUsage} {item.unit}/day</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.dailyUsage > 5 ? (
                            <TrendingUp className="w-4 h-4 text-red-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-green-500" />
                          )}
                          <span className="text-sm font-medium">
                            {item.dailyUsage > 5 ? 'High' : 'Normal'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reorder Predictions</CardTitle>
                  <CardDescription>When to restock based on usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventoryItems
                      .filter(item => item.daysRemaining <= 7)
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <div className="text-sm text-gray-500">
                              Reorder in {Math.max(0, item.daysRemaining - 2)} days
                            </div>
                          </div>
                          <Badge variant={item.daysRemaining <= 2 ? 'destructive' : 'secondary'}>
                            {item.daysRemaining} days left
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Inventory value and cost trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">₹{totalInventoryValue.toLocaleString()}</div>
                    <div className="text-sm text-blue-800">Total Inventory Value</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{inventoryItems.reduce((sum, item) => sum + (item.dailyUsage * item.costPerUnit), 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-green-800">Daily Consumption Value</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(totalInventoryValue / inventoryItems.reduce((sum, item) => sum + (item.dailyUsage * item.costPerUnit), 0))}
                    </div>
                    <div className="text-sm text-orange-800">Days of Stock Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-vendor" />
                  Quick Reorder
                </CardTitle>
                <CardDescription>
                  Reorder items that are low or out of stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryItems
                    .filter(item => item.status === 'low_stock' || item.status === 'out_of_stock')
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Current: {item.currentStock}{item.unit} • 
                            Suggested order: {item.maxStockLevel - item.currentStock}{item.unit} • 
                            Supplier: {item.supplier}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="font-medium">₹{((item.maxStockLevel - item.currentStock) * item.costPerUnit).toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Estimated cost</div>
                          </div>
                          <Button size="sm" className="bg-vendor hover:bg-vendor/90">
                            <Plus className="w-4 h-4 mr-1" />
                            Order Now
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Bulk Order Summary</h4>
                    <Button className="bg-vendor hover:bg-vendor/90">
                      <Truck className="w-4 h-4 mr-2" />
                      Place All Orders
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Items to order:</span>
                      <div className="font-medium">{inventoryItems.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total cost:</span>
                      <div className="font-medium">₹{inventoryItems
                        .filter(item => item.status === 'low_stock' || item.status === 'out_of_stock')
                        .reduce((sum, item) => sum + ((item.maxStockLevel - item.currentStock) * item.costPerUnit), 0)
                        .toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery time:</span>
                      <div className="font-medium">1-2 days</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
