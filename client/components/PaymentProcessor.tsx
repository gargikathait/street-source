import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import {
  CreditCard,
  Smartphone,
  Building,
  Truck,
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  QrCode,
  Phone
} from "lucide-react";

interface PaymentMethod {
  id: string;
  type: 'cod' | 'upi' | 'card' | 'netbanking';
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  fees: number;
  processingTime: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  onSuccess: (transactionId: string) => void;
}

function PaymentProcessor({ isOpen, onClose, orderId, amount, onSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'processing' | 'success'>('select');
  const [transactionId, setTransactionId] = useState('');
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Card payment form
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  
  // UPI payment form
  const [upiId, setUpiId] = useState('');
  
  // Net banking form
  const [selectedBank, setSelectedBank] = useState('');
  
  // Terms acceptance
  const [acceptTerms, setAcceptTerms] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cod',
      type: 'cod',
      label: 'Cash on Delivery',
      description: 'Pay when your order is delivered',
      icon: Truck,
      fees: 0,
      processingTime: 'On delivery'
    },
    {
      id: 'upi',
      type: 'upi',
      label: 'UPI Payment',
      description: 'Pay using Google Pay, PhonePe, Paytm',
      icon: Smartphone,
      fees: 0,
      processingTime: 'Instant'
    },
    {
      id: 'card',
      type: 'card',
      label: 'Credit/Debit Card',
      description: 'Visa, Mastercard, RuPay',
      icon: CreditCard,
      fees: Math.round(amount * 0.02), // 2% processing fee
      processingTime: 'Instant'
    },
    {
      id: 'netbanking',
      type: 'netbanking',
      label: 'Net Banking',
      description: 'Pay directly from your bank account',
      icon: Building,
      fees: 10,
      processingTime: '2-3 minutes'
    }
  ];

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Bank of Baroda',
    'Punjab National Bank',
    'Kotak Mahindra Bank',
    'IDFC First Bank'
  ];

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setSelectedMethod('');
      setPaymentStep('select');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardHolderName('');
      setUpiId('');
      setSelectedBank('');
      setAcceptTerms(false);
      setTransactionId('');
    }
  }, [isOpen]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateCardNumber = (number: string) => {
    const num = number.replace(/\s/g, '');
    return num.length >= 13 && num.length <= 19;
  };

  const validateExpiryDate = (date: string) => {
    const [month, year] = date.split('/');
    if (!month || !year) return false;
    const now = new Date();
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expiry > now;
  };

  const generateTransactionId = () => {
    return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
  };

  const simulatePayment = async (method: PaymentMethod): Promise<boolean> => {
    // Simulate payment processing with different success rates
    return new Promise((resolve) => {
      setTimeout(() => {
        // 95% success rate for simulation
        const success = Math.random() > 0.05;
        resolve(success);
      }, 2000 + Math.random() * 3000); // 2-5 seconds
    });
  };

  const processPayment = async () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method) return;

    // Validation
    if (method.type === 'card') {
      if (!validateCardNumber(cardNumber)) {
        toast({
          title: "Invalid Card Number",
          description: "Please enter a valid card number",
          variant: "destructive"
        });
        return;
      }
      if (!validateExpiryDate(expiryDate)) {
        toast({
          title: "Invalid Expiry Date",
          description: "Please enter a valid expiry date",
          variant: "destructive"
        });
        return;
      }
      if (cvv.length < 3) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid CVV",
          variant: "destructive"
        });
        return;
      }
      if (!cardHolderName.trim()) {
        toast({
          title: "Card Holder Name Required",
          description: "Please enter the card holder name",
          variant: "destructive"
        });
        return;
      }
    }

    if (method.type === 'upi' && !upiId.trim()) {
      toast({
        title: "UPI ID Required",
        description: "Please enter your UPI ID",
        variant: "destructive"
      });
      return;
    }

    if (method.type === 'netbanking' && !selectedBank) {
      toast({
        title: "Bank Selection Required",
        description: "Please select your bank",
        variant: "destructive"
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Accept Terms",
        description: "Please accept the terms and conditions",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setPaymentStep('processing');

    try {
      const success = await simulatePayment(method);
      
      if (success) {
        const txnId = generateTransactionId();
        setTransactionId(txnId);
        setPaymentStep('success');
        
        // Call success callback
        setTimeout(() => {
          onSuccess(txnId);
          toast({
            title: "Payment Successful",
            description: `Payment of ₹${(amount + method.fees).toFixed(2)} completed successfully`
          });
        }, 1000);
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Transaction failed. Please try again or use a different payment method.",
        variant: "destructive"
      });
      setPaymentStep('details');
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setPaymentStep('details');
  };

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
  const totalAmount = selectedMethodData ? amount + selectedMethodData.fees : amount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2 text-green-600" />
            Secure Payment
          </DialogTitle>
          <DialogDescription>
            Order #{orderId} • Amount: ₹{amount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        {paymentStep === 'select' && (
          <div className="space-y-4">
            <h3 className="font-medium">Choose Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Card
                    key={method.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => handleMethodSelect(method.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-6 h-6 text-vendor" />
                          <div>
                            <h4 className="font-medium">{method.label}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {method.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {method.fees > 0 && (
                            <p className="text-sm text-gray-600">+₹{method.fees}</p>
                          )}
                          <p className="text-xs text-gray-500">{method.processingTime}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {paymentStep === 'details' && selectedMethodData && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setPaymentStep('select')}>
                ← Back
              </Button>
              <h3 className="font-medium">{selectedMethodData.label}</h3>
            </div>

            {selectedMethodData.type === 'cod' && (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    You will pay ₹{amount.toFixed(2)} in cash when your order is delivered.
                  </p>
                </div>
              </div>
            )}

            {selectedMethodData.type === 'upi' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upi">UPI ID</Label>
                  <Input
                    id="upi"
                    placeholder="yourname@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <QrCode className="w-16 h-16 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Scan QR code with your UPI app to pay
                  </p>
                </div>
              </div>
            )}

            {selectedMethodData.type === 'card' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardHolder">Card Holder Name</Label>
                  <Input
                    id="cardHolder"
                    placeholder="Name as on card"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {selectedMethodData.type === 'netbanking' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank">Select Your Bank</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Order Amount:</span>
                <span>₹{amount.toFixed(2)}</span>
              </div>
              {selectedMethodData.fees > 0 && (
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>₹{selectedMethodData.fees.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total Amount:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
              />
              <Label htmlFor="terms" className="text-sm">
                I accept the terms and conditions
              </Label>
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-300">
                  Your payment is secured with 256-bit SSL encryption
                </span>
              </div>
            </div>

            <Button
              onClick={processPayment}
              disabled={loading || !acceptTerms}
              className="w-full bg-vendor hover:bg-vendor/90"
            >
              {loading ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)}`}
            </Button>
          </div>
        )}

        {paymentStep === 'processing' && (
          <div className="text-center py-8 space-y-4">
            <div className="animate-spin h-12 w-12 border-b-2 border-vendor mx-auto"></div>
            <h3 className="font-medium">Processing Payment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Please wait while we process your payment...
            </p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
            <h3 className="font-medium text-green-600">Payment Successful!</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Transaction ID: {transactionId}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Amount: ₹{totalAmount.toFixed(2)}
              </p>
            </div>
            <Button onClick={onClose} className="w-full">
              Continue
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { PaymentProcessor };
