import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import NavigationBreadcrumb from "@/components/NavigationBreadcrumb";
import { TrendingUp, BarChart3, Users, DollarSign, Clock, Target } from "lucide-react";

export default function Analytics() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation title={t('analytics')} />
      <NavigationBreadcrumb />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analytics</h2>
          <p className="text-gray-600">Deep insights into your vendor performance and supply chain optimization</p>
        </div>

        <div className="space-y-8">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Savings</p>
                    <p className="text-2xl font-bold text-green-600">$247.2K</p>
                    <p className="text-xs text-gray-500">vs last quarter</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-4">
                  <Badge className="bg-green-100 text-green-800">+18.2%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                    <p className="text-2xl font-bold text-blue-600">2.4h</p>
                    <p className="text-xs text-gray-500">vendor response</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mt-4">
                  <Badge className="bg-green-100 text-green-800">-12%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Quality Rating</p>
                    <p className="text-2xl font-bold text-quality">92.8%</p>
                    <p className="text-xs text-gray-500">average score</p>
                  </div>
                  <Target className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="mt-4">
                  <Badge className="bg-green-100 text-green-800">+5.2%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">On-Time Delivery</p>
                    <p className="text-2xl font-bold text-availability">96.4%</p>
                    <p className="text-xs text-gray-500">delivery rate</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-4">
                  <Badge className="bg-green-100 text-green-800">+3.1%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Quality, Pricing, and Availability over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Interactive chart would be displayed here</p>
                    <p className="text-sm text-gray-400">Showing 6-month trend analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vendor Distribution</CardTitle>
                <CardDescription>Performance by category and region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-vendor"></div>
                      <span className="text-sm font-medium">Electronics</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">147 vendors</p>
                      <p className="text-xs text-gray-500">42% of total</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-supply"></div>
                      <span className="text-sm font-medium">Manufacturing</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">98 vendors</p>
                      <p className="text-xs text-gray-500">28% of total</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-quality"></div>
                      <span className="text-sm font-medium">Logistics</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">63 vendors</p>
                      <p className="text-xs text-gray-500">18% of total</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-pricing"></div>
                      <span className="text-sm font-medium">Services</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">42 vendors</p>
                      <p className="text-xs text-gray-500">12% of total</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Highest rated vendors this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">TechSupply Co.</p>
                    <p className="text-sm text-gray-500">Electronics</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">98.2%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Global Materials</p>
                    <p className="text-sm text-gray-500">Manufacturing</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">96.8%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">FastShip Logistics</p>
                    <p className="text-sm text-gray-500">Logistics</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">95.4%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Alerts</CardTitle>
                <CardDescription>Vendors requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Quick Parts Inc.</p>
                    <p className="text-sm text-gray-500">Quality declining</p>
                  </div>
                  <Badge variant="destructive">High Risk</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reliable Supplies</p>
                    <p className="text-sm text-gray-500">Delivery delays</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Budget Components</p>
                    <p className="text-sm text-gray-500">Price fluctuation</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Watch</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>AI-powered insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Diversify Suppliers</p>
                  <p className="text-xs text-blue-700">Consider adding 2-3 backup vendors for critical components</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Cost Optimization</p>
                  <p className="text-xs text-green-700">Negotiate volume discounts with top 3 vendors</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900">Process Improvement</p>
                  <p className="text-xs text-yellow-700">Automate reorder points for 15 high-volume items</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export and Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Reports & Export</CardTitle>
              <CardDescription>Generate detailed reports for stakeholders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-vendor hover:bg-vendor/90">
                  Export Performance Report
                </Button>
                <Button variant="outline">
                  Download Quality Metrics
                </Button>
                <Button variant="outline">
                  Generate Cost Analysis
                </Button>
                <Button variant="outline">
                  Risk Assessment Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
