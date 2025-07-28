import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  ArrowLeft, 
  Upload, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Camera,
  FileText,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Star
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
  ingredients: Ingredient[];
  preparationTime: number;
  servingSize: number;
  costPerServing: number;
  profitMargin: number;
  popularity: number;
  isActive: boolean;
}

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  supplier?: string;
  category: string;
}

interface SupplierRecommendation {
  supplierId: string;
  supplierName: string;
  ingredientName: string;
  currentPrice: number;
  suggestedPrice: number;
  potentialSavings: number;
  quality: number;
  location: string;
}

export default function MenuManagement() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("menu");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showIngredientAnalysis, setShowIngredientAnalysis] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [recommendations, setRecommendations] = useState<SupplierRecommendation[]>([]);
  const [currentIngredients, setCurrentIngredients] = useState<Ingredient[]>([]);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    preparationTime: '',
    servingSize: '1'
  });

  // Sample menu items
  const sampleMenuItems: MenuItem[] = [
    {
      id: "1",
      name: "Pav Bhaji",
      category: "Street Food",
      price: 60,
      description: "Spicy vegetable mash served with buttered bread rolls",
      ingredients: [
        { id: "1", name: "Potatoes", quantity: 200, unit: "g", costPerUnit: 30, category: "Vegetables" },
        { id: "2", name: "Onions", quantity: 100, unit: "g", costPerUnit: 40, category: "Vegetables" },
        { id: "3", name: "Tomatoes", quantity: 150, unit: "g", costPerUnit: 50, category: "Vegetables" },
        { id: "4", name: "Pav Bread", quantity: 2, unit: "pieces", costPerUnit: 5, category: "Bakery" },
        { id: "5", name: "Butter", quantity: 20, unit: "g", costPerUnit: 500, category: "Dairy" }
      ],
      preparationTime: 15,
      servingSize: 1,
      costPerServing: 35,
      profitMargin: 42,
      popularity: 85,
      isActive: true
    },
    {
      id: "2",
      name: "Vada Pav",
      category: "Street Food",
      price: 25,
      description: "Deep-fried potato dumpling in a bread bun",
      ingredients: [
        { id: "6", name: "Potatoes", quantity: 150, unit: "g", costPerUnit: 30, category: "Vegetables" },
        { id: "7", name: "Pav Bread", quantity: 1, unit: "pieces", costPerUnit: 5, category: "Bakery" },
        { id: "8", name: "Chickpea Flour", quantity: 50, unit: "g", costPerUnit: 80, category: "Grains" },
        { id: "9", name: "Cooking Oil", quantity: 30, unit: "ml", costPerUnit: 150, category: "Oils" }
      ],
      preparationTime: 10,
      servingSize: 1,
      costPerServing: 12,
      profitMargin: 52,
      popularity: 95,
      isActive: true
    },
    {
      id: "3",
      name: "Masala Chai",
      category: "Beverages",
      price: 15,
      description: "Spiced tea with milk and sugar",
      ingredients: [
        { id: "10", name: "Tea Leaves", quantity: 5, unit: "g", costPerUnit: 400, category: "Beverages" },
        { id: "11", name: "Milk", quantity: 150, unit: "ml", costPerUnit: 50, category: "Dairy" },
        { id: "12", name: "Sugar", quantity: 10, unit: "g", costPerUnit: 40, category: "Sweeteners" },
        { id: "13", name: "Spices Mix", quantity: 2, unit: "g", costPerUnit: 200, category: "Spices" }
      ],
      preparationTime: 5,
      servingSize: 1,
      costPerServing: 8,
      profitMargin: 47,
      popularity: 90,
      isActive: true
    }
  ];

  // Sample supplier recommendations
  const sampleRecommendations: SupplierRecommendation[] = [
    {
      supplierId: "1",
      supplierName: "Mumbai Grains Wholesale",
      ingredientName: "Chickpea Flour",
      currentPrice: 80,
      suggestedPrice: 65,
      potentialSavings: 15,
      quality: 4.5,
      location: "2.5 km away"
    },
    {
      supplierId: "2",
      supplierName: "Delhi Fresh Vegetables",
      ingredientName: "Potatoes",
      currentPrice: 30,
      suggestedPrice: 25,
      potentialSavings: 5,
      quality: 4.2,
      location: "1.8 km away"
    },
    {
      supplierId: "3",
      supplierName: "Bangalore Oil Mills",
      ingredientName: "Cooking Oil",
      currentPrice: 150,
      suggestedPrice: 135,
      potentialSavings: 15,
      quality: 4.8,
      location: "3.2 km away"
    }
  ];

  useEffect(() => {
    setMenuItems(sampleMenuItems);
    setRecommendations(sampleRecommendations);
  }, []);

  // Update form data
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      preparationTime: '',
      servingSize: '1'
    });
    setCurrentIngredients([]);
  };

  // Add ingredient to current item
  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      quantity: 0,
      unit: 'g',
      costPerUnit: 0,
      category: 'Other'
    };
    setCurrentIngredients(prev => [...prev, newIngredient]);
  };

  // Update ingredient
  const updateIngredient = (id: string, field: string, value: any) => {
    setCurrentIngredients(prev =>
      prev.map(ing =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  // Remove ingredient
  const removeIngredient = (id: string) => {
    setCurrentIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  const calculateTotalCost = (ingredients: Ingredient[]): number => {
    return ingredients.reduce((total, ingredient) => {
      return total + (ingredient.quantity * ingredient.costPerUnit / 1000);
    }, 0);
  };

  // Save menu item
  const saveMenuItem = () => {
    if (!formData.name || !formData.category || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    const costPerServing = calculateTotalCost(currentIngredients);
    const price = parseFloat(formData.price);
    const profitMargin = price > 0 ? ((price - costPerServing) / price) * 100 : 0;

    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      price: price,
      description: formData.description,
      ingredients: currentIngredients,
      preparationTime: parseInt(formData.preparationTime) || 10,
      servingSize: parseInt(formData.servingSize) || 1,
      costPerServing: costPerServing,
      profitMargin: profitMargin,
      popularity: 0,
      isActive: true
    };

    if (selectedItem) {
      // Update existing item
      setMenuItems(prev =>
        prev.map(item =>
          item.id === selectedItem.id ? { ...newItem, id: selectedItem.id } : item
        )
      );
    } else {
      // Add new item
      setMenuItems(prev => [...prev, newItem]);
    }

    resetForm();
    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedItem(null);
  };

  // Edit menu item
  const editMenuItem = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      preparationTime: item.preparationTime.toString(),
      servingSize: item.servingSize.toString()
    });
    setCurrentIngredients(item.ingredients);
    setShowEditDialog(true);
  };

  // View menu item
  const viewMenuItem = (item: MenuItem) => {
    setSelectedItem(item);
    setShowViewDialog(true);
  };

  // Delete menu item
  const deleteMenuItem = (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const analyzeMenuForIngredients = (item: MenuItem) => {
    setSelectedItem(item);
    setShowIngredientAnalysis(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Processing menu file:", file.name);
      setLoading(true);

      // Simulate file processing with realistic extracted menu items
      setTimeout(() => {
        const extractedItems: MenuItem[] = [
          {
            id: Date.now().toString(),
            name: "Extracted Item from " + file.name,
            category: "Street Food",
            price: 45,
            description: "Extracted from uploaded menu",
            ingredients: [
              { id: "1", name: "Flour", quantity: 100, unit: "g", costPerUnit: 40, category: "Grains" },
              { id: "2", name: "Oil", quantity: 50, unit: "ml", costPerUnit: 150, category: "Oils" }
            ],
            preparationTime: 15,
            servingSize: 1,
            costPerServing: 11.5,
            profitMargin: 74.4,
            popularity: 0,
            isActive: true
          }
        ];

        setMenuItems(prev => [...prev, ...extractedItems]);
        setLoading(false);
        alert(`Successfully extracted ${extractedItems.length} menu item(s) from ${file.name}`);
      }, 2000);
    }
  };

  const MenuUploadSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="w-5 h-5 mr-2 text-vendor" />
          Upload Your Menu
        </CardTitle>
        <CardDescription>
          Upload your existing menu to automatically extract ingredients and get supplier recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-vendor transition-colors">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="menu-upload"
              />
              <label htmlFor="menu-upload" className="cursor-pointer">
                <div className="space-y-2">
                  <Camera className="w-8 h-8 mx-auto text-gray-400" />
                  <p className="text-gray-600">Upload menu photo or PDF</p>
                  <p className="text-sm text-gray-400">PNG, JPG, PDF up to 10MB</p>
                </div>
              </label>
            </div>
            
            <Button className="w-full" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Import from Text
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Supported formats:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Menu photos (JPG, PNG)
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                PDF menus
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Text lists
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Handwritten menus
              </li>
            </ul>
          </div>
        </div>
        
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin h-6 w-6 border-b-2 border-vendor mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Processing your menu...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <Package className="w-8 h-8 text-vendor mr-3" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">StreetSource</h1>
            </Link>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <LanguageSelector />
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Menu Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Upload your menu and get smart ingredient recommendations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="menu">My Menu</TabsTrigger>
            <TabsTrigger value="upload">Upload Menu</TabsTrigger>
            <TabsTrigger value="analysis">Cost Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <MenuUploadSection />
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Current Menu Items</h3>
                <p className="text-sm text-gray-600">{menuItems.length} items • Total cost analysis available</p>
              </div>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-vendor hover:bg-vendor/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Menu Item</DialogTitle>
                    <DialogDescription>
                      Create a new menu item and specify its ingredients
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Item Name *</Label>
                        <Input
                          placeholder="e.g., Pav Bhaji"
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Street Food">Street Food</SelectItem>
                            <SelectItem value="Beverages">Beverages</SelectItem>
                            <SelectItem value="Snacks">Snacks</SelectItem>
                            <SelectItem value="Sweets">Sweets</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Selling Price (₹) *</Label>
                        <Input
                          type="number"
                          placeholder="60"
                          value={formData.price}
                          onChange={(e) => updateFormData('price', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Preparation Time (min)</Label>
                        <Input
                          type="number"
                          placeholder="15"
                          value={formData.preparationTime}
                          onChange={(e) => updateFormData('preparationTime', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Brief description of the item"
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ingredients</Label>
                      <div className="border rounded-lg p-4 space-y-3">
                        <Button variant="outline" size="sm" onClick={addIngredient}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Ingredient
                        </Button>

                        {currentIngredients.map((ingredient) => (
                          <div key={ingredient.id} className="grid grid-cols-6 gap-2 items-end">
                            <div className="space-y-1">
                              <Label className="text-xs">Name</Label>
                              <Input
                                placeholder="Ingredient"
                                value={ingredient.name}
                                onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Quantity</Label>
                              <Input
                                type="number"
                                value={ingredient.quantity}
                                onChange={(e) => updateIngredient(ingredient.id, 'quantity', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Unit</Label>
                              <Select
                                value={ingredient.unit}
                                onValueChange={(value) => updateIngredient(ingredient.id, 'unit', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="g">g</SelectItem>
                                  <SelectItem value="kg">kg</SelectItem>
                                  <SelectItem value="ml">ml</SelectItem>
                                  <SelectItem value="l">l</SelectItem>
                                  <SelectItem value="pieces">pieces</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Cost/kg</Label>
                              <Input
                                type="number"
                                placeholder="₹/kg"
                                value={ingredient.costPerUnit}
                                onChange={(e) => updateIngredient(ingredient.id, 'costPerUnit', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Category</Label>
                              <Select
                                value={ingredient.category}
                                onValueChange={(value) => updateIngredient(ingredient.id, 'category', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                                  <SelectItem value="Grains">Grains</SelectItem>
                                  <SelectItem value="Spices">Spices</SelectItem>
                                  <SelectItem value="Oils">Oils</SelectItem>
                                  <SelectItem value="Dairy">Dairy</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeIngredient(ingredient.id)}
                              className="mb-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}

                        {currentIngredients.length > 0 && (
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="text-sm">
                              <span className="font-medium">Estimated Cost per Serving: </span>
                              <span className="text-green-600">₹{calculateTotalCost(currentIngredients).toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => { resetForm(); setShowAddDialog(false); }}>
                        Cancel
                      </Button>
                      <Button className="bg-vendor hover:bg-vendor/90" onClick={saveMenuItem}>
                        Save Item
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {menuItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <Badge variant="secondary">{item.category}</Badge>
                          <Badge 
                            variant={item.isActive ? 'default' : 'secondary'}
                            className={item.isActive ? 'bg-green-600' : ''}
                          >
                            {item.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-600" />
                            <div className="text-sm font-medium">₹{item.price}</div>
                            <div className="text-xs text-gray-500">Selling Price</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                            <div className="text-sm font-medium">{item.profitMargin}%</div>
                            <div className="text-xs text-gray-500">Profit Margin</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Clock className="w-5 h-5 mx-auto mb-1 text-quality" />
                            <div className="text-sm font-medium">{item.preparationTime}m</div>
                            <div className="text-xs text-gray-500">Prep Time</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                            <div className="text-sm font-medium">{item.popularity}%</div>
                            <div className="text-xs text-gray-500">Popularity</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-gray-900">Ingredients ({item.ingredients.length})</h4>
                          <div className="flex flex-wrap gap-2">
                            {item.ingredients.slice(0, 3).map((ingredient) => (
                              <Badge key={ingredient.id} variant="outline" className="text-xs">
                                {ingredient.name} ({ingredient.quantity}{ingredient.unit})
                              </Badge>
                            ))}
                            {item.ingredients.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.ingredients.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 lg:ml-6">
                        <Button variant="outline" size="sm" onClick={() => viewMenuItem(item)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => analyzeMenuForIngredients(item)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Find Suppliers
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => editMenuItem(item)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteMenuItem(item.id)} className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Cost per serving: ₹{item.costPerServing}</span>
                        <span className="font-medium text-green-600">
                          Profit: ₹{(item.price - item.costPerServing).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Menu Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">₹{menuItems.reduce((sum, item) => sum + item.price, 0)}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Combined selling price</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">₹{menuItems.reduce((sum, item) => sum + item.costPerServing, 0).toFixed(2)}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Combined ingredient cost</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Overall Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-vendor">₹{(menuItems.reduce((sum, item) => sum + (item.price - item.costPerServing), 0)).toFixed(2)}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total profit potential</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Avg Profit Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {menuItems.length > 0 ? (menuItems.reduce((sum, item) => sum + item.profitMargin, 0) / menuItems.length).toFixed(1) : 0}%
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Average across all items</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Profitability Analysis</CardTitle>
                <CardDescription>Compare profit margins across your menu items (sorted by profitability)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...menuItems]
                  .sort((a, b) => b.profitMargin - a.profitMargin)
                  .map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-green-100 text-green-800' :
                          index === 1 ? 'bg-blue-100 text-blue-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ₹{item.price} • Cost: ₹{item.costPerServing.toFixed(2)} • {item.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          item.profitMargin > 50 ? 'text-green-600' :
                          item.profitMargin > 30 ? 'text-blue-600' :
                          item.profitMargin > 10 ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {item.profitMargin.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ₹{(item.price - item.costPerServing).toFixed(2)} profit
                        </div>
                      </div>
                    </div>
                  ))}

                {menuItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No menu items added yet. Add items to see profitability analysis.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Menu Optimization Insights */}
            {menuItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Menu Optimization Insights</CardTitle>
                  <CardDescription>AI-powered recommendations to improve your menu profitability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(() => {
                    const highProfitItems = menuItems.filter(item => item.profitMargin > 50);
                    const lowProfitItems = menuItems.filter(item => item.profitMargin < 20);
                    const avgCost = menuItems.reduce((sum, item) => sum + item.costPerServing, 0) / menuItems.length;

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {highProfitItems.length > 0 && (
                          <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="font-medium text-green-900 dark:text-green-100">High Performers</span>
                            </div>
                            <p className="text-sm text-green-800 dark:text-green-200">
                              {highProfitItems.length} items with {'>'}50% profit margin. Consider promoting these items.
                            </p>
                          </div>
                        )}

                        {lowProfitItems.length > 0 && (
                          <div className="p-4 border border-orange-200 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertTriangle className="w-5 h-5 text-orange-600" />
                              <span className="font-medium text-orange-900 dark:text-orange-100">Needs Optimization</span>
                            </div>
                            <p className="text-sm text-orange-800 dark:text-orange-200">
                              {lowProfitItems.length} items with {'<'}20% profit margin. Review ingredients or pricing.
                            </p>
                          </div>
                        )}

                        <div className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-900 dark:text-blue-100">Cost Insight</span>
                          </div>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Average cost per serving is ₹{avgCost.toFixed(2)}. Target {'<'}₹{(avgCost * 0.8).toFixed(2)} for better margins.
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-vendor" />
                  Smart Supplier Recommendations
                </CardTitle>
                <CardDescription>
                  Based on your menu ingredients, here are better supplier options to reduce costs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  if (menuItems.length === 0) {
                    return (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Add menu items with ingredients to get supplier recommendations</p>
                      </div>
                    );
                  }

                  // Generate dynamic recommendations based on actual menu ingredients
                  const allIngredients = menuItems.flatMap(item => item.ingredients);
                  const uniqueIngredients = allIngredients.reduce((acc, ingredient) => {
                    if (!acc.find(i => i.name === ingredient.name)) {
                      acc.push(ingredient);
                    }
                    return acc;
                  }, [] as Ingredient[]);

                  const dynamicRecommendations = uniqueIngredients.map((ingredient, index) => {
                    const suppliers = ['Mumbai Grains Wholesale', 'Delhi Fresh Vegetables', 'Pune Spice Market', 'Bangalore Oil Mills'];
                    const locations = ['2.5 km away', '1.8 km away', '3.2 km away', '4.1 km away'];

                    return {
                      supplierId: index.toString(),
                      supplierName: suppliers[index % suppliers.length],
                      ingredientName: ingredient.name,
                      currentPrice: ingredient.costPerUnit,
                      suggestedPrice: Math.round(ingredient.costPerUnit * 0.85),
                      potentialSavings: Math.round(ingredient.costPerUnit * 0.15),
                      quality: 4.2 + (Math.random() * 0.6),
                      location: locations[index % locations.length]
                    };
                  });

                  return dynamicRecommendations.map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{rec.ingredientName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{rec.supplierName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{rec.location}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Save ₹{rec.potentialSavings}/kg
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Current Price:</span>
                          <div className="font-medium">₹{rec.currentPrice}/kg</div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">New Price:</span>
                          <div className="font-medium text-green-600">₹{rec.suggestedPrice}/kg</div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Quality:</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="font-medium">{rec.quality.toFixed(1)}/5</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex space-x-2">
                        <Button size="sm" className="bg-vendor hover:bg-vendor/90">
                          Contact Supplier
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Update ingredient cost in menu items
                            setMenuItems(prev => prev.map(item => ({
                              ...item,
                              ingredients: item.ingredients.map(ing =>
                                ing.name === rec.ingredientName
                                  ? { ...ing, costPerUnit: rec.suggestedPrice, supplier: rec.supplierName }
                                  : ing
                              )
                            })));
                            alert(`Updated ${rec.ingredientName} supplier to ${rec.supplierName} at ₹${rec.suggestedPrice}/kg`);
                          }}
                        >
                          Apply Suggestion
                        </Button>
                      </div>
                    </div>
                  ));
                })()}
              </CardContent>
            </Card>

            {/* Total Savings Summary */}
            {menuItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Potential Savings Summary</CardTitle>
                  <CardDescription>If you switch to all recommended suppliers</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const allIngredients = menuItems.flatMap(item => item.ingredients);
                    const totalCurrentCost = allIngredients.reduce((sum, ing) => sum + (ing.quantity * ing.costPerUnit / 1000), 0);
                    const totalOptimizedCost = allIngredients.reduce((sum, ing) => sum + (ing.quantity * ing.costPerUnit * 0.85 / 1000), 0);
                    const totalSavings = totalCurrentCost - totalOptimizedCost;

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">₹{totalCurrentCost.toFixed(2)}</div>
                          <div className="text-sm text-blue-800 dark:text-blue-200">Current Total Cost</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">₹{totalOptimizedCost.toFixed(2)}</div>
                          <div className="text-sm text-green-800 dark:text-green-200">Optimized Cost</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">₹{totalSavings.toFixed(2)}</div>
                          <div className="text-sm text-orange-800 dark:text-orange-200">Total Savings</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{((totalSavings / totalCurrentCost) * 100).toFixed(1)}%</div>
                          <div className="text-sm text-purple-800 dark:text-purple-200">Savings Percentage</div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Item Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
              <DialogDescription>
                Update your menu item details and ingredients
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Item Name *</Label>
                  <Input
                    placeholder="e.g., Pav Bhaji"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Street Food">Street Food</SelectItem>
                      <SelectItem value="Beverages">Beverages</SelectItem>
                      <SelectItem value="Snacks">Snacks</SelectItem>
                      <SelectItem value="Sweets">Sweets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Selling Price (₹) *</Label>
                  <Input
                    type="number"
                    placeholder="60"
                    value={formData.price}
                    onChange={(e) => updateFormData('price', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preparation Time (min)</Label>
                  <Input
                    type="number"
                    placeholder="15"
                    value={formData.preparationTime}
                    onChange={(e) => updateFormData('preparationTime', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Brief description of the item"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => { resetForm(); setShowEditDialog(false); }}>
                  Cancel
                </Button>
                <Button className="bg-vendor hover:bg-vendor/90" onClick={saveMenuItem}>
                  Update Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedItem?.name}</DialogTitle>
              <DialogDescription>
                Complete details and cost breakdown
              </DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Category:</span>
                          <span>{selectedItem.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Selling Price:</span>
                          <span className="font-medium">₹{selectedItem.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Preparation Time:</span>
                          <span>{selectedItem.preparationTime} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Serving Size:</span>
                          <span>{selectedItem.servingSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Status:</span>
                          <Badge variant={selectedItem.isActive ? 'default' : 'secondary'}>
                            {selectedItem.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Financial Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Cost per Serving:</span>
                          <span className="text-orange-600">₹{selectedItem.costPerServing.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Profit per Serving:</span>
                          <span className="text-green-600">₹{(selectedItem.price - selectedItem.costPerServing).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Profit Margin:</span>
                          <span className="font-medium text-green-600">{selectedItem.profitMargin.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Popularity Score:</span>
                          <span>{selectedItem.popularity}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Description</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{selectedItem.description}</p>

                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Ingredients ({selectedItem.ingredients.length})</h4>
                    <div className="space-y-2">
                      {selectedItem.ingredients.map((ingredient) => (
                        <div key={ingredient.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div>
                            <span className="font-medium">{ingredient.name}</span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {ingredient.quantity}{ingredient.unit} • {ingredient.category}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">₹{((ingredient.quantity * ingredient.costPerUnit) / 1000).toFixed(2)}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">₹{ingredient.costPerUnit}/kg</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                      Close
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => { setShowViewDialog(false); editMenuItem(selectedItem); }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Item
                      </Button>
                      <Button onClick={() => analyzeMenuForIngredients(selectedItem)} className="bg-vendor hover:bg-vendor/90">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Find Suppliers
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Ingredient Analysis Dialog */}
        <Dialog open={showIngredientAnalysis} onOpenChange={setShowIngredientAnalysis}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ingredient Analysis: {selectedItem?.name}</DialogTitle>
              <DialogDescription>
                Find better suppliers for each ingredient in this item
              </DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Current Ingredients</h4>
                    <div className="space-y-2">
                      {selectedItem.ingredients.map((ingredient) => (
                        <div key={ingredient.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{ingredient.name}</span>
                              <div className="text-sm text-gray-500">
                                {ingredient.quantity}{ingredient.unit} @ ₹{ingredient.costPerUnit}/kg
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">₹{((ingredient.quantity * ingredient.costPerUnit) / 1000).toFixed(2)}</div>
                              <div className="text-xs text-gray-500">per serving</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Supplier Suggestions</h4>
                    <div className="space-y-2">
                      {recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-green-50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{rec.ingredientName}</span>
                            <Badge className="bg-green-600">-₹{rec.potentialSavings}/kg</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {rec.supplierName} • {rec.location}
                          </div>
                          <div className="text-sm">
                            <span className="line-through text-gray-500">₹{rec.currentPrice}</span>
                            <span className="ml-2 font-medium text-green-600">₹{rec.suggestedPrice}/kg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Cost Optimization Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Current Cost:</span>
                      <div className="font-medium">₹{selectedItem.costPerServing}</div>
                    </div>
                    <div>
                      <span className="text-blue-700">Optimized Cost:</span>
                      <div className="font-medium text-green-600">₹{(selectedItem.costPerServing * 0.85).toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-blue-700">Potential Savings:</span>
                      <div className="font-medium text-green-600">₹{(selectedItem.costPerServing * 0.15).toFixed(2)} per serving</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowIngredientAnalysis(false)}>
                    Close
                  </Button>
                  <Button className="bg-vendor hover:bg-vendor/90">
                    Update Suppliers
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
