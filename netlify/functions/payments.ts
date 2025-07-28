import { Handler } from '@netlify/functions';

// In-memory payments database
let paymentsDatabase: any[] = [
  {
    id: 'PAY001',
    transactionId: 'TXN1234567890',
    orderId: 'ORD001',
    vendorId: 'vendor_001',
    amount: 780,
    currency: 'INR',
    paymentMethod: 'upi',
    paymentProvider: 'razorpay',
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    details: {
      upiId: 'radhika@paytm',
      gateway: 'Razorpay',
      reference: 'RZP_TXN_001'
    }
  },
  {
    id: 'PAY002',
    transactionId: 'TXN1234567891',
    orderId: 'ORD002',
    vendorId: 'vendor_001',
    amount: 655,
    currency: 'INR',
    paymentMethod: 'cod',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    details: {
      deliveryAgent: 'Vikram Singh',
      expectedCollection: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
    }
  }
];

// Payment processing simulation
function processPayment(paymentData: any) {
  const processingTime = {
    'upi': 1000, // 1 second
    'card': 3000, // 3 seconds
    'netbanking': 5000, // 5 seconds
    'cod': 0 // Instant (no processing needed)
  };

  const successRate = {
    'upi': 0.95,
    'card': 0.92,
    'netbanking': 0.88,
    'cod': 1.0
  };

  const method = paymentData.paymentMethod;
  const success = Math.random() < (successRate[method as keyof typeof successRate] || 0.9);

  return new Promise((resolve) => {
    setTimeout(() => {
      if (success || method === 'cod') {
        resolve({
          success: true,
          transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 6)}`.toUpperCase(),
          status: method === 'cod' ? 'pending' : 'completed',
          gateway: getPaymentGateway(method),
          reference: `${getPaymentGateway(method).toUpperCase()}_${Date.now()}`
        });
      } else {
        resolve({
          success: false,
          error: 'Payment failed. Please try again.',
          errorCode: 'PAYMENT_DECLINED'
        });
      }
    }, processingTime[method as keyof typeof processingTime] || 2000);
  });
}

function getPaymentGateway(method: string) {
  const gateways = {
    'upi': 'razorpay',
    'card': 'stripe',
    'netbanking': 'payu',
    'cod': 'internal'
  };
  return gateways[method as keyof typeof gateways] || 'razorpay';
}

function calculateFees(amount: number, method: string) {
  const feeStructure = {
    'upi': 0, // No fees for UPI
    'card': amount * 0.02, // 2% for cards
    'netbanking': 10, // Flat ₹10 for net banking
    'cod': 0 // No processing fees for COD
  };
  
  return Math.round((feeStructure[method as keyof typeof feeStructure] || 0) * 100) / 100;
}

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const pathSegments = event.path.split('/').filter(Boolean);
    const paymentId = pathSegments[2]; // /api/payments/PAY001
    const action = pathSegments[3]; // /api/payments/PAY001/refund

    switch (event.httpMethod) {
      case 'GET':
        if (paymentId) {
          // Get specific payment
          const payment = paymentsDatabase.find(p => p.id === paymentId);
          if (!payment) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Payment not found' })
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: payment })
          };
        }

        // Get payments with filters
        const vendorId = event.queryStringParameters?.vendorId;
        const orderId = event.queryStringParameters?.orderId;
        const status = event.queryStringParameters?.status;
        const method = event.queryStringParameters?.method;
        const limit = event.queryStringParameters?.limit;

        let filteredPayments = [...paymentsDatabase];

        if (vendorId) {
          filteredPayments = filteredPayments.filter(p => p.vendorId === vendorId);
        }

        if (orderId) {
          filteredPayments = filteredPayments.filter(p => p.orderId === orderId);
        }

        if (status) {
          filteredPayments = filteredPayments.filter(p => p.status === status);
        }

        if (method) {
          filteredPayments = filteredPayments.filter(p => p.paymentMethod === method);
        }

        // Sort by creation date (newest first)
        filteredPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (limit) {
          filteredPayments = filteredPayments.slice(0, parseInt(limit));
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: filteredPayments,
            count: filteredPayments.length
          })
        };

      case 'POST':
        if (action === 'refund') {
          // Process refund
          const refundData = JSON.parse(event.body || '{}');
          const payment = paymentsDatabase.find(p => p.id === paymentId);
          
          if (!payment) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, error: 'Payment not found' })
            };
          }

          if (payment.status !== 'completed') {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ success: false, error: 'Only completed payments can be refunded' })
            };
          }

          const refundAmount = refundData.amount || payment.amount;
          if (refundAmount > payment.amount) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ success: false, error: 'Refund amount cannot exceed payment amount' })
            };
          }

          // Create refund record
          const refund = {
            id: `REF${Date.now()}`,
            paymentId: payment.id,
            transactionId: `REFUND_${Date.now()}`,
            amount: refundAmount,
            currency: payment.currency,
            status: 'processing',
            reason: refundData.reason || 'Customer request',
            createdAt: new Date().toISOString(),
            processedAt: null
          };

          // Simulate refund processing
          setTimeout(() => {
            refund.status = 'completed';
            refund.processedAt = new Date().toISOString();
            payment.refunds = payment.refunds || [];
            payment.refunds.push(refund);
          }, 2000);

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: refund,
              message: 'Refund initiated successfully'
            })
          };
        }

        // Process new payment
        const paymentData = JSON.parse(event.body || '{}');
        
        // Validate required fields
        if (!paymentData.orderId || !paymentData.amount || !paymentData.paymentMethod) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: 'Missing required fields: orderId, amount, paymentMethod'
            })
          };
        }

        // Calculate fees
        const fees = calculateFees(paymentData.amount, paymentData.paymentMethod);
        const totalAmount = paymentData.amount + fees;

        // Process payment
        const paymentResult = await processPayment({
          ...paymentData,
          totalAmount,
          fees
        });

        if (!paymentResult.success) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              error: paymentResult.error,
              errorCode: paymentResult.errorCode
            })
          };
        }

        // Create payment record
        const newPayment = {
          id: `PAY${Date.now()}`,
          transactionId: paymentResult.transactionId,
          orderId: paymentData.orderId,
          vendorId: paymentData.vendorId || 'vendor_001',
          amount: paymentData.amount,
          fees: fees,
          totalAmount: totalAmount,
          currency: paymentData.currency || 'INR',
          paymentMethod: paymentData.paymentMethod,
          paymentProvider: paymentResult.gateway,
          status: paymentResult.status,
          createdAt: new Date().toISOString(),
          completedAt: paymentResult.status === 'completed' ? new Date().toISOString() : null,
          details: {
            gateway: paymentResult.gateway,
            reference: paymentResult.reference,
            ...paymentData.details
          },
          metadata: paymentData.metadata || {}
        };

        paymentsDatabase.push(newPayment);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            data: newPayment,
            message: 'Payment processed successfully'
          })
        };

      case 'PUT':
        // Update payment status (webhook from payment gateway)
        const updateData = JSON.parse(event.body || '{}');
        const paymentIndex = paymentsDatabase.findIndex(p => p.id === paymentId);
        
        if (paymentIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, error: 'Payment not found' })
          };
        }

        // Update payment status
        paymentsDatabase[paymentIndex] = {
          ...paymentsDatabase[paymentIndex],
          status: updateData.status,
          completedAt: updateData.status === 'completed' ? new Date().toISOString() : paymentsDatabase[paymentIndex].completedAt,
          failureReason: updateData.failureReason,
          lastUpdated: new Date().toISOString()
        };

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: paymentsDatabase[paymentIndex],
            message: 'Payment status updated successfully'
          })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error in payments API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' })
    };
  }
};
