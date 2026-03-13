import { useState, useEffect } from 'react';
import {
  CreditCard,
  FileText,
  Building2,
  Truck,
  Zap,
  Crown,
  Lock,
  Check,
  CheckCircle2,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import StepIndicator from '../components/StepIndicator';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatUtils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';

const steps = ['Shipping', 'Payment', 'Review', 'Confirmation'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cartItems, subtotal, clearCart } = useCart();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    institution: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      const names = (user.name || '').split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      const defaultAddress = user.addresses?.find(a => a.isDefault) || user.addresses?.[0] || {};

      setFormData({
        firstName: firstName || '',
        lastName: lastName || '',
        institution: defaultAddress.institution || '',
        streetAddress: defaultAddress.street || '',
        city: defaultAddress.city || '',
        state: defaultAddress.state || '',
        zipCode: defaultAddress.zip || '',
        phone: user.phone || defaultAddress.phone || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const shippingCost = shippingMethod === 'express' ? 29.99 : shippingMethod === 'white-glove' ? 149.99 : 0;
  const tax = subtotal * 0.085;
  const total = subtotal + shippingCost + tax;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.streetAddress || !formData.city) {
      toast.error('Please fill in all required shipping fields');
      return;
    }

    if (formData.phone && formData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user ? user.uid : 'guest',
        userName: user?.name || `${formData.firstName} ${formData.lastName}`.trim() || 'Guest Customer',
        userEmail: user?.email || formData.email || '',
        userPhone: user?.phone || formData.phone || '',
        userType: user?.isInstitutional ? 'Institutional' : 'Individual',
        items: cartItems,
        subtotal,
        shippingCost,
        tax,
        total,
        shippingMethod,
        paymentMethod,
        shippingAddress: formData,
        status: 'Placed',
      };

      const newOrderId = await createOrder(orderData);
      setOrderDetails({ id: newOrderId, total });
      clearCart();
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shippingMethods = [
    { id: 'standard', label: 'Standard Shipping', desc: '5-7 business days', price: 'FREE', icon: Truck },
    { id: 'express', label: 'Express Shipping', desc: '2-3 business days', price: formatCurrency(500), icon: Zap },
    { id: 'white-glove', label: 'White Glove Delivery', desc: 'Installation included', price: formatCurrency(2000), icon: Crown },
  ];

  const paymentMethods = [
    { id: 'credit-card', label: 'Credit Card', icon: CreditCard },
    { id: 'purchase-order', label: 'Purchase Order', icon: FileText },
    { id: 'wire-transfer', label: 'Wire Transfer', icon: Building2 },
  ];

  return (
    <div className="container-main animate-fade-in pb-12">
      <Breadcrumbs items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

      <h1 className="text-2xl font-bold text-text-primary text-center mb-8">
        Secure Checkout
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
              <Truck size={20} className="text-primary" />
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'First Name', placeholder: 'John', name: 'firstName' },
                { label: 'Last Name', placeholder: 'Doe', name: 'lastName' },
                { label: 'Institution / Company', placeholder: 'City General Hospital', full: true, name: 'institution' },
                { label: 'Street Address', placeholder: '123 Medical Center Dr', full: true, name: 'streetAddress' },
                { label: 'City', placeholder: 'San Francisco', name: 'city' },
                { label: 'State', placeholder: 'California', name: 'state' },
                { label: 'ZIP Code', placeholder: '94102', name: 'zipCode' },
                { label: 'Phone', placeholder: '(555) 123-4567', name: 'phone' },
              ].map((field, i) => (
                <div key={i} className={field.full ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Method */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-lg font-bold text-text-primary mb-5">Shipping Method</h2>
            <div className="space-y-3">
              {shippingMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === method.id
                      ? 'border-primary bg-primary-light'
                      : 'border-border hover:border-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={shippingMethod === method.id}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="accent-primary"
                  />
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${shippingMethod === method.id ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary'
                    }`}>
                    <method.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">{method.label}</p>
                    <p className="text-xs text-text-secondary">{method.desc}</p>
                  </div>
                  <span className={`text-sm font-bold ${method.price === 'FREE' ? 'text-green-600' : 'text-text-primary'}`}>
                    {method.price}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment will be processed by payment gateway */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-text-primary">Payment</h2>
            </div>
            <p className="text-sm text-text-secondary">
              You will be securely redirected to our payment gateway to complete your purchase. We accept Visa, Mastercard, AMEX, FSA, and HSA cards.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            icon={Lock}
            onClick={handleCheckout}
            disabled={isSubmitting || cartItems.length === 0}
          >
            {isSubmitting ? 'Processing...' : `Complete Order — ${formatCurrency(total)}`}
          </Button>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
            <h3 className="text-lg font-bold text-text-primary mb-5">Order Summary</h3>
            <div className="space-y-4 mb-5">
              {cartItems.length === 0 ? (
                <p className="text-sm text-text-secondary text-center py-4">No items in cart</p>
              ) : (
                cartItems.map((item) => {
                  const isService = item.category === 'Services' || (item.id && String(item.id).startsWith('service-'));
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      {!isService && (
                        item.image ? (
                          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                            <Package size={20} className="text-text-secondary" />
                          </div>
                        )
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                        <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  );
                })
              )}
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                  {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Tax (8.5%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"></div>
          <div className="relative bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Order Confirmed!</h2>
            <p className="text-text-secondary mb-1">Thank you for your purchase.</p>
            <p className="text-sm font-medium text-text-primary mb-8">
              Order ID: <span className="text-primary">{orderDetails?.id}</span>
            </p>
            
            <div className="space-y-3">
              <Button 
                variant="primary" 
                className="w-full justify-center" 
                href={user ? '/orders' : '/'}
                size="lg"
              >
                Go to My Orders
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-center" 
                href="/products"
                size="lg"
              >
                Browse More Products
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
