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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Package, 
  ArrowLeft, 
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Truck,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Package2,
  Shield
} from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  category: string;
  location: string;
  distance: number;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  minOrder: number;
  paymentTerms: string;
  certifications: string[];
  products: SupplierProduct[];
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  businessHours: string;
  establishedYear: number;
  monthlyCustomers: number;
  onTimeDelivery: number;
  qualityScore: number;
  priceCompetitiveness: number;
  responseTime: string;
  isVerified: boolean;
  isPreferred: boolean;
}

interface SupplierProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  quality: 'Premium' | 'Standard' | 'Economy';
  availability: 'In Stock' | 'Limited' | 'Out of Stock';
  minQuantity: number;
  bulkDiscount?: {
    quantity: number;
    discount: number;
  };
  freshness?: string;
  origin?: string;
}

interface ComparisonItem {
  productName: string;
  suppliers: {
    supplier: Supplier;
    product: SupplierProduct;
    totalCost: number;
    deliveryCost: number;
  }[];
}

export default function SupplierComparison() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("browse");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [showComparison, setShowComparison] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(10);

  // Sample suppliers data
  const sampleSuppliers: Supplier[] = [
    {
      id: "1",
      name: "Mumbai Grains Wholesale",
      category: "Grains & Cereals",
      location: "Mumbai, Maharashtra",
      distance: 2.5,
      rating: 4.8,
      reviewCount: 156,
      deliveryTime: "Same day",
      minOrder: 500,
      paymentTerms: "Cash on delivery",
      certifications: ["FSSAI Certified", "Organic"],
      contact: {
        phone: "+91 9876543210",
        email: "orders@mumbaigrains.com",
        whatsapp: "+91 9876543210"
      },
      businessHours: "6 AM - 8 PM",
      establishedYear: 2015,
      monthlyCustomers: 450,
      onTimeDelivery: 96,
      qualityScore: 94,
      priceCompetitiveness: 85,
      responseTime: "< 30 min",
      isVerified: true,
      isPreferred: true,
      products: [
        {
          id: "1", name: "Rice (Basmati)", category: "Grains", price: 80, unit: "kg",
          quality: "Premium", availability: "In Stock", minQuantity: 5,
          bulkDiscount: { quantity: 50, discount: 10 }, origin: "Punjab"
        },
        {
          id: "2", name: "Wheat Flour", category: "Grains", price: 45, unit: "kg",
          quality: "Standard", availability: "In Stock", minQuantity: 10,
          bulkDiscount: { quantity: 100, discount: 15 }, origin: "Madhya Pradesh"
        },
        {
          id: "3", name: "Chickpea Flour", category: "Grains", price: 65, unit: "kg",
          quality: "Premium", availability: "In Stock", minQuantity: 5,
          origin: "Rajasthan"
        }
      ]
    },
    {
      id: "2",
      name: "Delhi Fresh Vegetables",
      category: "Fresh Vegetables",
      location: "Delhi, NCR",
      distance: 5.2,
      rating: 4.5,
      reviewCount: 203,
      deliveryTime: "Next day",
      minOrder: 200,
      paymentTerms: "7 days credit",
      certifications: ["FSSAI Certified", "Fresh Guarantee"],
      contact: {
        phone: "+91 9876543211",
        email: "sales@delhifresh.com",
        whatsapp: "+91 9876543211"
      },
      businessHours: "5 AM - 9 PM",
      establishedYear: 2018,
      monthlyCustomers: 320,
      onTimeDelivery: 92,
      qualityScore: 89,
      priceCompetitiveness: 78,
      responseTime: "< 45 min",
      isVerified: true,
      isPreferred: false,
      products: [
        {
          id: "4", name: "Potatoes", category: "Vegetables", price: 25, unit: "kg",
          quality: "Standard", availability: "In Stock", minQuantity: 5,
          freshness: "Harvested 2 days ago", origin: "Uttar Pradesh"
        },
        {
          id: "5", name: "Onions", category: "Vegetables", price: 35, unit: "kg",
          quality: "Premium", availability: "Limited", minQuantity: 10,
          bulkDiscount: { quantity: 50, discount: 8 }, origin: "Maharashtra"
        },
        {
          id: "6", name: "Tomatoes", category: "Vegetables", price: 45, unit: "kg",
          quality: "Premium", availability: "In Stock", minQuantity: 5,
          freshness: "Harvested today", origin: "Karnataka"
        }
      ]
    },
    {
      id: "3",
      name: "Pune Spice Market",
      category: "Spices & Seasonings",
      location: "Pune, Maharashtra",
      distance: 8.1,
      rating: 4.7,
      reviewCount: 89,
      deliveryTime: "2-3 days",
      minOrder: 300,
      paymentTerms: "Cash on delivery",
      certifications: ["FSSAI Certified", "Export Quality"],
      contact: {
        phone: "+91 9876543212",
        email: "info@punespices.com"
      },
      businessHours: "7 AM - 7 PM",
      establishedYear: 2012,
      monthlyCustomers: 180,
      onTimeDelivery: 88,
      qualityScore: 91,
      priceCompetitiveness: 82,
      responseTime: "< 1 hour",
      isVerified: true,
      isPreferred: false,
      products: [
        {
          id: "7", name: "Turmeric Powder", category: "Spices", price: 180, unit: "kg",
          quality: "Premium", availability: "In Stock", minQuantity: 2,
          origin: "Andhra Pradesh"
        },
        {
          id: "8", name: "Red Chili Powder", category: "Spices", price: 220, unit: "kg",
          quality: "Premium", availability: "In Stock", minQuantity: 2,
          bulkDiscount: { quantity: 10, discount: 12 }, origin: "Andhra Pradesh"
        },
        {
          id: "9", name: "Garam Masala", category: "Spices", price: 450, unit: "kg",
          quality: "Premium", availability: "In Stock", minQuantity: 1,
          origin: "Kerala"
        }
      ]
    },
    {
      id: "4",
      name: "Bangalore Oil Mills",
      category: "Cooking Oils",
      location: "Bangalore, Karnataka",
      distance: 12.3,
      rating: 4.9,
      reviewCount: 134,
      deliveryTime: "1-2 days",
      minOrder: 1000,
      paymentTerms: "15 days credit",
      certifications: ["FSSAI Certified", "Cold Pressed", "Organic"],
      contact: {
        phone: "+91 9876543213",
        email: "orders@bangaloreoils.com",
        whatsapp: "+91 9876543213"
      },
      businessHours: "6 AM - 6 PM",
      establishedYear: 2010,
      monthlyCustomers: 280,
      onTimeDelivery: 95,
      qualityScore: 96,
      priceCompetitiveness: 68,
      responseTime: "< 20 min",
      isVerified: true,
      isPreferred: true,
      products: [
        {
          id: "10", name: "Sunflower Oil", category: "Oils", price: 135, unit: "liter",
          quality: "Premium", availability: "In Stock", minQuantity: 5,
          bulkDiscount: { quantity: 20, discount: 10 }
        },
        {
          id: "11", name: "Coconut Oil", category: "Oils", price: 280, unit: "liter",
          quality: "Premium", availability: "In Stock", minQuantity: 2,
          bulkDiscount: { quantity: 10, discount: 15 }
        },
        {
          id: "12", name: "Mustard Oil", category: "Oils", price: 150, unit: "liter",
          quality: "Premium", availability: "Limited", minQuantity: 3
        }
      ]
    }
  ];

  useEffect(() => {
    setSuppliers(sampleSuppliers);
  }, []);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || supplier.category === categoryFilter;
    const matchesLocation = locationFilter === "all" || supplier.location.includes(locationFilter);
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    switch (sortBy) {
      case "rating": return b.rating - a.rating;
      case "distance": return a.distance - b.distance;
      case "price": return a.priceCompetitiveness - b.priceCompetitiveness;
      case "delivery": return a.deliveryTime.localeCompare(b.deliveryTime);
      default: return 0;
    }
  });

  const toggleSupplierSelection = (supplierId: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId) 
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const getProductComparison = (productName: string): ComparisonItem | null => {
    const comparisons = suppliers
      .map(supplier => {
        const product = supplier.products.find(p => 
          p.name.toLowerCase().includes(productName.toLowerCase())
        );
        if (!product) return null;
        
        const deliveryCost = supplier.distance * 5; // ₹5 per km
        const basePrice = product.price * quantity;
        const discount = product.bulkDiscount && quantity >= product.bulkDiscount.quantity 
          ? (basePrice * product.bulkDiscount.discount) / 100 
          : 0;
        const totalCost = basePrice - discount + deliveryCost;
        
        return {
          supplier,
          product,
          totalCost,
          deliveryCost
        };
      })
      .filter(Boolean);

    return comparisons.length > 0 ? {
      productName,
      suppliers: comparisons as any[]
    } : null;
  };

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Supplier Comparison</h2>
          <p className="text-gray-600">Compare prices, quality, and delivery options across suppliers</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Suppliers</TabsTrigger>
            <TabsTrigger value="compare">Compare ({selectedSuppliers.length})</TabsTrigger>
            <TabsTrigger value="products">Product Search</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search suppliers or products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Grains & Cereals">Grains & Cereals</SelectItem>
                      <SelectItem value="Fresh Vegetables">Fresh Vegetables</SelectItem>
                      <SelectItem value="Spices & Seasonings">Spices & Seasonings</SelectItem>
                      <SelectItem value="Cooking Oils">Cooking Oils</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="delivery">Delivery Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => setShowComparison(true)}
                    disabled={selectedSuppliers.length < 2}
                    className="bg-vendor hover:bg-vendor/90"
                  >
                    Compare ({selectedSuppliers.length})
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Suppliers List */}
            <div className="grid gap-6">
              {sortedSuppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          checked={selectedSuppliers.includes(supplier.id)}
                          onCheckedChange={() => toggleSupplierSelection(supplier.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{supplier.name}</h3>
                            {supplier.isVerified && (
                              <Badge className="bg-green-100 text-green-800">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {supplier.isPreferred && (
                              <Badge className="bg-blue-100 text-blue-800">Preferred</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{supplier.category}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium">{supplier.rating}</span>
                              <span className="text-sm text-gray-500">({supplier.reviewCount})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{supplier.distance}km away</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{supplier.deliveryTime}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">Min ₹{supplier.minOrder}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {supplier.certifications.map((cert, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <div className="font-medium text-green-600">{supplier.onTimeDelivery}%</div>
                              <div className="text-xs text-gray-500">On-time delivery</div>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <div className="font-medium text-blue-600">{supplier.qualityScore}%</div>
                              <div className="text-xs text-gray-500">Quality score</div>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <div className="font-medium text-orange-600">{supplier.responseTime}</div>
                              <div className="text-xs text-gray-500">Response time</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sample Products */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3 text-sm">Sample Products ({supplier.products.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {supplier.products.slice(0, 3).map((product) => (
                          <div key={product.id} className="p-3 border rounded-lg text-sm">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium">{product.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {product.quality}
                              </Badge>
                            </div>
                            <div className="text-gray-600">₹{product.price}/{product.unit}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Min: {product.minQuantity}{product.unit}
                              {product.bulkDiscount && (
                                <span className="ml-2 text-green-600">
                                  {product.bulkDiscount.discount}% off @{product.bulkDiscount.quantity}+
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{supplier.contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{supplier.contact.email}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Package2 className="w-4 h-4 mr-1" />
                            View Products
                          </Button>
                          <Button size="sm" className="bg-vendor hover:bg-vendor/90">
                            <Phone className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Price Comparison</CardTitle>
                <CardDescription>
                  Search for specific products and compare prices across all suppliers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      placeholder="e.g., Potatoes, Rice, Oil"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button 
                      className="w-full bg-vendor hover:bg-vendor/90"
                      onClick={() => {
                        if (selectedProduct) {
                          setActiveTab("compare");
                        }
                      }}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Compare Prices
                    </Button>
                  </div>
                </div>

                {selectedProduct && (
                  <div className="border-t pt-4">
                    {(() => {
                      const comparison = getProductComparison(selectedProduct);
                      if (!comparison) {
                        return <p className="text-center text-gray-500">No products found matching "{selectedProduct}"</p>;
                      }
                      
                      return (
                        <div className="space-y-4">
                          <h4 className="font-medium">Price Comparison for {quantity}kg of {selectedProduct}</h4>
                          <div className="grid gap-4">
                            {comparison.suppliers
                              .sort((a, b) => a.totalCost - b.totalCost)
                              .map((item, index) => (
                                <div key={item.supplier.id} className="p-4 border rounded-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center space-x-3">
                                      {index === 0 && (
                                        <Badge className="bg-green-100 text-green-800">Best Price</Badge>
                                      )}
                                      <h5 className="font-medium">{item.supplier.name}</h5>
                                      <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        <span className="text-sm">{item.supplier.rating}</span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-lg font-bold">₹{item.totalCost.toFixed(2)}</div>
                                      <div className="text-sm text-gray-500">Total cost</div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-600">Unit Price:</span>
                                      <div>₹{item.product.price}/{item.product.unit}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Quality:</span>
                                      <div>{item.product.quality}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Delivery:</span>
                                      <div>{item.supplier.deliveryTime}</div>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Delivery Cost:</span>
                                      <div>₹{item.deliveryCost}</div>
                                    </div>
                                  </div>
                                  {item.product.bulkDiscount && quantity >= item.product.bulkDiscount.quantity && (
                                    <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-800">
                                      <CheckCircle className="w-4 h-4 inline mr-1" />
                                      {item.product.bulkDiscount.discount}% bulk discount applied!
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            {selectedSuppliers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers selected</h3>
                  <p className="text-gray-600 mb-4">
                    Go to "Browse Suppliers" tab and select suppliers to compare them here
                  </p>
                  <Button onClick={() => setActiveTab("browse")}>
                    Browse Suppliers
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Comparison</CardTitle>
                    <CardDescription>
                      Side-by-side comparison of selected suppliers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3">Criteria</th>
                            {selectedSuppliers.map(id => {
                              const supplier = suppliers.find(s => s.id === id);
                              return supplier ? (
                                <th key={id} className="text-center p-3">
                                  <div>
                                    <div className="font-medium">{supplier.name}</div>
                                    <div className="text-sm text-gray-500">{supplier.category}</div>
                                  </div>
                                </th>
                              ) : null;
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Rating</td>
                            {selectedSuppliers.map(id => {
                              const supplier = suppliers.find(s => s.id === id);
                              return supplier ? (
                                <td key={id} className="text-center p-3">
                                  <div className="flex items-center justify-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="font-medium">{supplier.rating}</span>
                                    <span className="text-sm text-gray-500">({supplier.reviewCount})</span>
                                  </div>
                                </td>
                              ) : null;
                            })}
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Distance</td>
                            {selectedSuppliers.map(id => {
                              const supplier = suppliers.find(s => s.id === id);
                              return supplier ? (
                                <td key={id} className="text-center p-3">
                                  {supplier.distance}km
                                </td>
                              ) : null;
                            })}
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Delivery Time</td>
                            {selectedSuppliers.map(id => {
                              const supplier = suppliers.find(s => s.id === id);
                              return supplier ? (
                                <td key={id} className="text-center p-3">
                                  {supplier.deliveryTime}
                                </td>
                              ) : null;
                            })}
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Min Order</td>
                            {selectedSuppliers.map(id => {
                              const supplier = suppliers.find(s => s.id === id);
                              return supplier ? (
                                <td key={id} className="text-center p-3">
                                  ₹{supplier.minOrder}
                                </td>
                              ) : null;
                            })}
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Payment Terms</td>
                            {selectedSuppliers.map(id => {
                              const supplier = suppliers.find(s => s.id === id);
                              return supplier ? (
                                <td key={id} className="text-center p-3">
                                  {supplier.paymentTerms}
                                </td>
                              ) : null;
                            })}
                          </tr>
                          <tr className="border-b">
                            <td className="p-3 font-medium">Quality Score</td>
                            {selectedSuppliers.map(id => {
                              const supplier = suppliers.find(s => s.id === id);
                              return supplier ? (
                                <td key={id} className="text-center p-3">
                                  <div className="font-medium text-green-600">{supplier.qualityScore}%</div>
                                </td>
                              ) : null;
                            })}
                          </tr>
                          <tr>
                            <td className="p-3 font-medium">Products Count</td>
                            {selectedSuppliers.map(id => {
                              const supplier = suppliers.find(s => s.id === id);
                              return supplier ? (
                                <td key={id} className="text-center p-3">
                                  {supplier.products.length} items
                                </td>
                              ) : null;
                            })}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedSuppliers([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferred Suppliers</CardTitle>
                <CardDescription>
                  Suppliers you've marked as favorites for quick access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suppliers.filter(s => s.isPreferred).map((supplier) => (
                    <div key={supplier.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{supplier.name}</h4>
                          <p className="text-sm text-gray-600">{supplier.category} • {supplier.distance}km away</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>{supplier.rating}</span>
                            </div>
                            <span className="text-gray-500">{supplier.deliveryTime}</span>
                            <span className="text-green-600">{supplier.qualityScore}% quality</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Products
                          </Button>
                          <Button size="sm" className="bg-vendor hover:bg-vendor/90">
                            Quick Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
