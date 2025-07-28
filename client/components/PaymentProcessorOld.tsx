import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
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
  User
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
  
  // Card payment form
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  
  // UPI payment form
  const [upiId, setUpiId] = useState('');
  
  // Net banking form
  const [selectedBank, setSelectedBank] = useState('');
  
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cod',
      type: 'cod',
      label: 'Cash on Delivery',
      description: 'Pay when your order arrives at your doorstep',
      icon: Truck,
      fees: 0,
      processingTime: 'On delivery'
    },
    {
      id: 'upi',
      type: 'upi',
      label: 'UPI Payment',
      description: 'Pay instantly using Google Pay, PhonePe, Paytm, etc.',
      icon: Smartphone,
      fees: 0,
      processingTime: 'Instant'
    },
    {
      id: 'card',
      type: 'card',
      label: 'Credit/Debit Card',
      description: 'Secure payment with your Visa, Mastercard, or RuPay card',
      icon: CreditCard,
      fees: amount * 0.018, // 1.8% processing fee
      processingTime: 'Instant'
    },
    {
      id: 'netbanking',
      type: 'netbanking',
      label: 'Net Banking',
      description: 'Pay directly from your bank account',
      icon: Building,
      fees: 15, // Flat ₹15 fee
      processingTime: '2-5 minutes'
    }
  ];

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'Union Bank of India',
    'IDBI Bank',
    'Central Bank of India'
  ];

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

  const validateCardDetails = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      toast({
        title: "Error",
        description: "Please enter a valid card number",
        variant: "destructive"
      });
      return false;
    }
    if (!expiryDate || expiryDate.length < 5) {
      toast({
        title: "Error",
        description: "Please enter a valid expiry date",
        variant: "destructive"
      });
      return false;
    }
    if (!cvv || cvv.length < 3) {
      toast({
        title: "Error",
        description: "Please enter a valid CVV",
        variant: "destructive"
      });
      return false;
    }
    if (!cardHolderName) {
      toast({
        title: "Error",
        description: "Please enter card holder name",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const processPayment = async () => {
    setLoading(true);
    setPaymentStep('processing');

    try {
      let paymentDetails = {};
      
      if (selectedMethod === 'card') {
        if (!validateCardDetails()) {
          setLoading(false);
          setPaymentStep('details');
          return;
        }
        paymentDetails = {
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiryDate,
          cvv,
          cardHolderName,
          saveCard
        };
      } else if (selectedMethod === 'upi') {
        if (!upiId) {
          toast({
            title: "Error",
            description: "Please enter UPI ID",
            variant: "destructive"
          });
          setLoading(false);
          setPaymentStep('details');
          return;
        }
        paymentDetails = { upiId };
      } else if (selectedMethod === 'netbanking') {
        if (!selectedBank) {
          toast({
            title: "Error",
            description: "Please select a bank",
            variant: "destructive"
          });
          setLoading(false);
          setPaymentStep('details');
          return;
        }
        paymentDetails = { bank: selectedBank };
      }

      const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
      const totalAmount = amount + (selectedPaymentMethod?.fees || 0);

      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          paymentMethod: selectedMethod,
          amount: totalAmount,
          paymentDetails
        })
      });

      const result = await response.json();

      if (result.success) {
        setTransactionId(result.data.transactionId);
        setPaymentStep('success');
        onSuccess(result.data.transactionId);
        
        toast({
          title: "Payment Successful",
          description: `Payment of ₹${totalAmount} completed successfully`
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Payment could not be processed. Please try again.",
        variant: "destructive"
      });
      setPaymentStep('details');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setPaymentStep('select');
    setSelectedMethod('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardHolderName('');
    setUpiId('');
    setSelectedBank('');
    setSaveCard(false);
    setTransactionId('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod);
  const totalAmount = amount + (selectedPaymentMethod?.fees || 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Secure Payment</DialogTitle>
          <DialogDescription>
            Complete your payment securely
          </DialogDescription>
        </DialogHeader>

        {paymentStep === 'select' && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Order Amount:</span>
                <span>₹{amount}</span>
              </div>
              {selectedMethod && selectedPaymentMethod?.fees > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Processing Fee:</span>
                  <span className="text-sm">₹{selectedPaymentMethod.fees}</span>
                </div>
              )}
              <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>₹{selectedMethod ? totalAmount : amount}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Select Payment Method</h3>
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Card 
                    key={method.id}
                    className={`cursor-pointer transition-all ${
                      selectedMethod === method.id ? 'ring-2 ring-vendor bg-vendor/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Icon className="w-6 h-6 text-vendor" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{method.label}</h4>
                            {method.fees > 0 && (
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                +₹{method.fees}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{method.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-green-600">{method.processingTime}</span>
                            <div className="flex items-center space-x-1">
                              <Shield className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-600">Secure</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Button 
              onClick={() => setPaymentStep('details')}
              disabled={!selectedMethod}
              className="w-full bg-vendor hover:bg-vendor/90"
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {paymentStep === 'details' && selectedPaymentMethod && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <selectedPaymentMethod.icon className="w-6 h-6 text-vendor" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{selectedPaymentMethod.label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Amount: ₹{totalAmount}</p>
              </div>
            </div>

            {selectedMethod === 'cod' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">Cash on Delivery</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Please keep exact change ready. Our delivery partner will collect ₹{totalAmount} when your order arrives.
                </p>
              </div>
            )}

            {selectedMethod === 'upi' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="upi">UPI ID</Label>
                  <Input
                    id="upi"
                    placeholder="example@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="space-y-4">
                <div>
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
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  <div>
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
                <div>
                  <Label htmlFor="cardHolder">Card Holder Name</Label>
                  <Input
                    id="cardHolder"
                    placeholder="John Doe"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save-card"
                    checked={saveCard}
                    onCheckedChange={(checked) => setSaveCard(checked as boolean)}
                  />
                  <Label htmlFor="save-card" className="text-sm">
                    Save card for future payments
                  </Label>
                </div>
              </div>
            )}

            {selectedMethod === 'netbanking' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bank">Select Bank</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map(bank => (
                        <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Lock className="w-4 h-4" />
              <span>Your payment information is encrypted and secure</span>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setPaymentStep('select')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={processPayment}
                disabled={loading}
                className="flex-1 bg-vendor hover:bg-vendor/90"
              >
                {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
              </Button>
            </div>
          </div>
        )}

        {paymentStep === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin h-12 w-12 border-b-2 border-vendor mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Processing Payment</h3>
            <p className="text-gray-600 dark:text-gray-300">Please don't close this window...</p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your payment of ₹{totalAmount} has been processed successfully.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">Transaction ID:</p>
              <p className="font-mono text-sm font-medium">{transactionId}</p>
            </div>
            <Button onClick={handleClose} className="w-full bg-vendor hover:bg-vendor/90">
              Continue
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { PaymentProcessor };
