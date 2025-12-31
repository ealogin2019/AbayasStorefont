import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { CheckCircle2, Package, Home } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    
    if (paymentIntent) {
      // Payment was successful
      // In a real implementation, you would verify the payment on the server
      // and create the order in the database
      setOrderNumber(`ORD-${Date.now()}`);
      
      // Clear cart after successful payment
      setTimeout(() => {
        clearCart();
        setIsProcessing(false);
      }, 1000);
    } else {
      // No payment intent, redirect to cart
      navigate('/cart');
    }
  }, [searchParams, clearCart, navigate]);

  if (isProcessing) {
    return (
      <div className="container mx-auto py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Processing your order...</h2>
          <p className="text-gray-600 mt-2">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20">
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200 shadow-lg">
          <CardContent className="pt-10 pb-8">
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
                <p className="text-lg text-gray-600">
                  Thank you for your purchase
                </p>
              </div>

              {/* Order Details */}
              {orderNumber && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    <Package className="w-5 h-5" />
                    <span className="font-medium">Order Number:</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{orderNumber}</p>
                  <p className="text-sm text-gray-600 mt-4">
                    A confirmation email has been sent to your email address.
                  </p>
                </div>
              )}

              {/* Information */}
              <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• You'll receive an email confirmation shortly</li>
                  <li>• We'll send you tracking information once your order ships</li>
                  {isAuthenticated && (
                    <li>• Track your order status in your account profile</li>
                  )}
                  <li>• Estimated delivery: 3-5 business days</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button 
                  onClick={() => navigate('/shop')}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Continue Shopping
                </Button>
                {isAuthenticated && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    View My Orders
                  </Button>
                )}
              </div>

              {/* Support Info */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Need help? Contact us at{' '}
                  <a href="mailto:support@arababayas.com" className="text-primary hover:underline">
                    support@arababayas.com
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
