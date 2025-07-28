import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Store, 
  Truck, 
  Users, 
  Shield, 
  TrendingUp, 
  CheckCircle,
  Globe,
  Package,
  BarChart3,
  Eye,
  EyeOff,
  UserPlus,
  LogIn
} from "lucide-react";

interface AuthFormProps {
  onAuthenticate: (userData: any) => void;
}

export default function AuthForm({ onAuthenticate }: AuthFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessType: "",
    address: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication success
      const userData = {
        id: "vendor_001",
        businessName: loginData.email.split('@')[0],
        email: loginData.email,
        isVerified: true,
        memberSince: "2023"
      };
      
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });
      
      onAuthenticate(userData);
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please ensure both passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock registration success
      const userData = {
        id: `vendor_${Date.now()}`,
        businessName: signupData.businessName,
        ownerName: signupData.ownerName,
        email: signupData.email,
        phone: signupData.phone,
        businessType: signupData.businessType,
        address: signupData.address,
        isVerified: false,
        memberSince: new Date().getFullYear().toString()
      };
      
      toast({
        title: "Account created successfully!",
        description: "Welcome to StreetSource. Please verify your email to continue.",
      });
      
      onAuthenticate(userData);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Store,
      title: "Verified Suppliers",
      description: "Connect with trusted, verified suppliers in your area"
    },
    {
      icon: TrendingUp,
      title: "Best Prices",
      description: "Compare prices and get the best deals for your business"
    },
    {
      icon: Users,
      title: "Group Orders",
      description: "Join bulk orders with other vendors for better discounts"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable delivery to your location"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and secure payment processing"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track your business performance and growth"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Store className="h-12 w-12 text-vendor mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              StreetSource
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The complete platform for street vendors to source supplies, compare prices, and grow their business
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <Badge variant="secondary" className="flex items-center">
              <Globe className="h-4 w-4 mr-1" />
              Available in India
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Trusted by 10,000+ vendors
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Features Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why choose StreetSource?
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="border-none shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <feature.icon className="h-8 w-8 text-vendor" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="bg-vendor border-none text-vendor-foreground">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Ready to get started?</h3>
                    <p className="text-vendor-foreground/90">
                      Join thousands of vendors already using StreetSource to grow their business
                    </p>
                  </div>
                  <Package className="h-16 w-16 text-vendor-foreground/80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Authentication Forms */}
          <div className="w-full max-w-md mx-auto">
            <Card className="shadow-xl border-none">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold">
                  {activeTab === "login" ? "Welcome back" : "Create your account"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "login" 
                    ? "Sign in to your StreetSource account"
                    : "Join the StreetSource community today"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" className="flex items-center">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-4 mt-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                    
                    <div className="text-center">
                      <Button variant="link" className="text-sm">
                        Forgot your password?
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-4 mt-6">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input
                            id="businessName"
                            placeholder="Your business name"
                            value={signupData.businessName}
                            onChange={(e) => setSignupData(prev => ({ ...prev, businessName: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="ownerName">Owner Name</Label>
                          <Input
                            id="ownerName"
                            placeholder="Your full name"
                            value={signupData.ownerName}
                            onChange={(e) => setSignupData(prev => ({ ...prev, ownerName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="signupEmail">Email</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="Enter your email"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={signupData.phone}
                          onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="businessType">Business Type</Label>
                        <Input
                          id="businessType"
                          placeholder="e.g., Food stall, Clothing, Electronics"
                          value={signupData.businessType}
                          onChange={(e) => setSignupData(prev => ({ ...prev, businessType: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="address">Business Address</Label>
                        <Input
                          id="address"
                          placeholder="Enter your business address"
                          value={signupData.address}
                          onChange={(e) => setSignupData(prev => ({ ...prev, address: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="signupPassword">Password</Label>
                        <div className="relative">
                          <Input
                            id="signupPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={signupData.password}
                            onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                    
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                      By creating an account, you agree to our Terms of Service and Privacy Policy
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
