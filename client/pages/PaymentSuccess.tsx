
import React from 'react'
import { useCart } from '../hooks/useCart'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'

const PaymentSuccess = () => {
  const { clearCart } = useCart()
  const navigate = useNavigate()

  // Clear the cart after successful payment
  React.useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="container mx-auto py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/shop')}>
            Continue Shopping
          </Button>
          <Button variant="outline" onClick={() => navigate('/orders')}>
            View Order Details
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess