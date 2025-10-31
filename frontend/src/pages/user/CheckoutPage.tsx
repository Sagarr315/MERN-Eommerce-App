import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import type { Cart, CartItem } from '../../types/Cart';

interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

const CheckoutPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('new');
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const [address, setAddress] = useState<Address>({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
    fetchUserAddresses();
  }, [user, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/cart/${user?.id}`);
      setCart(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
const fetchUserAddresses = async () => {
  try {
    const response = await axiosInstance.get(`/admin/users/${user?.id}`);
    setSavedAddresses(response.data.addresses || []);
  } catch (error) {
    console.error('Failed to fetch addresses');
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedAddress(value);
    
    if (value !== 'new') {
      const selected = savedAddresses.find(addr => addr._id === value);
      if (selected) {
        setAddress({
          fullName: selected.fullName,
          phone: selected.phone,
          street: selected.street,
          city: selected.city,
          state: selected.state,
          zipCode: selected.zipCode,
          country: selected.country
        });
      }
    } else {
      // Reset form for new address
      setAddress({
        fullName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        phone: ''
      });
    }
  };

  const calculateSubtotal = (): number => {
    if (!cart) return 0;
    return cart.products.reduce((total, item) => {
      return total + (item.productId?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateTotal = (): number => {
    return calculateSubtotal();
  };

  const handlePlaceOrder = async () => {
    if (!user || !cart) return;

    // Validate required address fields
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.zipCode) {
      alert('Please fill all required address fields');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderData = {
        products: cart.products.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country
        }
      };

      await axiosInstance.post('/orders', orderData);
      
      alert('Order placed successfully!');
      
      // Clear cart after successful order
      for (const item of cart.products) {
        await axiosInstance.delete('/cart/remove', {
          data: { 
            userId: user.id, 
            productId: item.productId._id 
          }
        });
      }
      
      navigate('/orders');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning text-center">
          <h4>Your cart is empty</h4>
          <p>Add some products to proceed with checkout</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Shipping Address</h4>
            </div>
            <div className="card-body">
              {/* Address Selection Dropdown */}
              {savedAddresses.length > 0 && (
                <div className="mb-4">
                  <label className="form-label">Select Saved Address</label>
                  <select 
                    className="form-select"
                    value={selectedAddress}
                    onChange={handleAddressSelect}
                  >
                    <option value="new">Add New Address</option>
                    {savedAddresses.map(addr => (
                      <option key={addr._id} value={addr._id}>
                        {addr.fullName} - {addr.street}, {addr.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="street" className="form-label">Street Address *</label>
                <input
                  type="text"
                  className="form-control"
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="city" className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="state" className="form-label">State *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="zipCode" className="form-label">ZIP Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="zipCode"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="country" className="form-label">Country *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h4>Payment Method</h4>
            </div>
            <div className="card-body">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="card"
                  defaultChecked
                />
                <label className="form-check-label" htmlFor="card">
                  Credit/Debit Card
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="cod"
                />
                <label className="form-check-label" htmlFor="cod">
                  Cash on Delivery
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h4>Order Summary</h4>
            </div>
            <div className="card-body">
              {cart.products.map((item: CartItem) => (
                <div key={item._id} className="d-flex justify-content-between mb-2">
                  <div>
                    <h6 className="mb-0">{item.productId?.title}</h6>
                    <small className="text-muted">Qty: {item.quantity}</small>
                  </div>
                  <span>₹{((item.productId?.price || 0) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong>₹{calculateTotal().toLocaleString()}</strong>
              </div>
              
              <button
                className="btn btn-primary w-100"
                onClick={handlePlaceOrder}
                disabled={placingOrder || !address.fullName || !address.street || !address.city}
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;