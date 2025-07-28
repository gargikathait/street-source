import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CreateVendorRequest, ApiResponse } from "@shared/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Package, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function VendorOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Company Information
    companyName: '',
    companyType: '',
    industry: '',
    employees: '',
    description: '',
    // Step 2: Contact & Location
    contactName: '',
    jobTitle: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    // Step 3: Products & Services
    categories: '',
    productsDescription: '',
    capacity: '',
    leadTime: '',
    minOrder: '',
    paymentTerms: '',
    // Step 4: Certifications
    certifications: [] as string[],
    otherCertifications: '',
    references: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data
  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.companyType) newErrors.companyType = 'Company type is required';
      if (!formData.industry) newErrors.industry = 'Industry is required';
    }

    if (step === 2) {
      if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
      if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';
      if (!formData.country) newErrors.country = 'Country is required';
    }

    if (step === 3) {
      if (!formData.categories) newErrors.categories = 'Product category is required';
      if (!formData.productsDescription.trim()) newErrors.productsDescription = 'Product description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const submitForm = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      const vendorData: CreateVendorRequest = {
        name: formData.companyName,
        category: formData.categories,
        contactEmail: formData.email,
        location: `${formData.city}, ${formData.state}`,
        description: formData.productsDescription,
        certifications: formData.certifications
      };

      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData)
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        toast({
          title: "Application Submitted!",
          description: "Your vendor application has been submitted successfully. We'll review it within 2-3 business days.",
        });
        navigate('/');
      } else {
        throw new Error(result.message || 'Failed to submit application');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <Package className="w-8 h-8 text-vendor mr-3" />
              <h1 className="text-xl font-bold text-gray-900">StreetSource</h1>
            </Link>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Supplier Registration</h2>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Company Information</CardTitle>
                  <CardDescription>
                    Tell us about your company and what you offer
                  </CardDescription>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input
                      id="company-name"
                      placeholder="Your Company Inc."
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      className={errors.companyName ? 'border-red-500' : ''}
                    />
                    {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-type">Company Type *</Label>
                    <Select value={formData.companyType} onValueChange={(value) => updateFormData('companyType', value)}>
                      <SelectTrigger className={errors.companyType ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturer">Manufacturer</SelectItem>
                        <SelectItem value="distributor">Distributor</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="service">Service Provider</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.companyType && <p className="text-sm text-red-500">{errors.companyType}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="automotive">Automotive</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employees">Number of Employees</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-1000">201-1000</SelectItem>
                        <SelectItem value="1000+">1000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your company and what products/services you offer..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Contact & Location</CardTitle>
                  <CardDescription>
                    Provide your contact information and business location
                  </CardDescription>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Primary Contact Name *</Label>
                    <Input id="contact-name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-title">Job Title *</Label>
                    <Input id="contact-title" placeholder="Sales Manager" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email *</Label>
                    <Input id="email" type="email" placeholder="john@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" placeholder="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" placeholder="https://company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input id="linkedin" placeholder="https://linkedin.com/in/johndoe" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Business Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input id="address" placeholder="123 Business St" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" placeholder="San Francisco" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province *</Label>
                      <Input id="state" placeholder="CA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP/Postal Code *</Label>
                      <Input id="zip" placeholder="94102" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="mx">Mexico</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Products & Services</CardTitle>
                  <CardDescription>
                    Detail what products or services you can provide
                  </CardDescription>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categories">Product Categories *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics & Components</SelectItem>
                        <SelectItem value="raw-materials">Raw Materials</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing Equipment</SelectItem>
                        <SelectItem value="logistics">Logistics & Shipping</SelectItem>
                        <SelectItem value="software">Software & Services</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="products">Products/Services Description *</Label>
                    <Textarea 
                      id="products" 
                      placeholder="Describe the specific products or services you offer..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Production Capacity</Label>
                      <Input id="capacity" placeholder="e.g., 10,000 units/month" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lead-time">Average Lead Time</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3">1-3 days</SelectItem>
                          <SelectItem value="4-7">4-7 days</SelectItem>
                          <SelectItem value="1-2">1-2 weeks</SelectItem>
                          <SelectItem value="3-4">3-4 weeks</SelectItem>
                          <SelectItem value="1-2m">1-2 months</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min-order">Minimum Order Quantity</Label>
                      <Input id="min-order" placeholder="e.g., 100 units" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-terms">Payment Terms</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net-30">Net 30</SelectItem>
                          <SelectItem value="net-60">Net 60</SelectItem>
                          <SelectItem value="prepaid">Prepaid</SelectItem>
                          <SelectItem value="cod">Cash on Delivery</SelectItem>
                          <SelectItem value="credit">Credit Terms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-xl mb-2">Certifications & Compliance</CardTitle>
                  <CardDescription>
                    Upload relevant certifications and compliance documents
                  </CardDescription>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Quality Certifications</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {['ISO 9001', 'ISO 14001', 'AS9100', 'TS 16949', 'FDA', 'CE Marking'].map((cert) => (
                        <label key={cert} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{cert}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="other-certs">Other Certifications</Label>
                    <Textarea 
                      id="other-certs" 
                      placeholder="List any other relevant certifications..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Document Upload</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="space-y-2">
                        <div className="text-gray-500">
                          <Package className="w-8 h-8 mx-auto mb-2" />
                          <p>Drop files here or click to browse</p>
                          <p className="text-sm">Upload certificates, compliance docs, company profile</p>
                        </div>
                        <Button variant="outline">Choose Files</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="references">Business References</Label>
                    <Textarea 
                      id="references" 
                      placeholder="Provide 2-3 business references with contact information..."
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Almost Done!</span>
                  </div>
                  <p className="text-sm text-green-800 mt-1">
                    Review your information and submit your application. Our team will review and respond within 2-3 business days.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button onClick={nextStep} className="flex items-center bg-vendor hover:bg-vendor/90">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={submitForm}
                  disabled={loading}
                  className="flex items-center bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
