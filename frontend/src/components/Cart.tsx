import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { Cart as CartType, CartItem } from '../types/Cart';
import axiosInstance from '../api/axiosInstance';
import '../css/Cart.css';
import { useNavigate } from "react-router-dom";

interface CartProps {
  onUpdateCart: (productId: string, quantity: number) => Promise<void>;
  onRemoveFromCart: (productId: string) => Promise<void>;
}

export const Cart: React.FC<CartProps> = ({ onUpdateCart, onRemoveFromCart }) => {
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/cart/${user?.id}`);
      setCart(response.data);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(productId);
    try {
      await onUpdateCart(productId, newQuantity);
      await fetchCart();
    } catch (error) {
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setUpdating(productId);
    try {
      await onRemoveFromCart(productId);
      await fetchCart();
    } catch (error) {
    } finally {
      setUpdating(null);
    }
  };

  const calculateSubtotal = (): number => {
    if (!cart) return 0;
    return cart.products.reduce((total, item) => {
      if (!item.productId || typeof item.productId.price !== 'number') return total;
      return total + (item.productId.price * item.quantity);
    }, 0);
  };

  const calculateTotal = (): number => {
    return calculateSubtotal();
  };

  const getSafeImageUrl = (item: CartItem): string => {
    if (!item.productId || !item.productId.images || item.productId.images.length === 0) {
      return 'https://placehold.co/300x300?text=No+Image';
    }
    
    const image = item.productId.images[0];
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
  };

  const getSafeTitle = (item: CartItem): string => {
    return item.productId?.title || 'Product title not available';
  };

  const getSafePrice = (item: CartItem): number => {
    return item.productId?.price || 0;
  };

  const getSafeStock = (item: CartItem): number => {
    return item.productId?.stock || 0;
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-icon"></div>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started</p>
        <a href="/products" className="btn btn-primary">Continue Shopping</a>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <span className="cart-count">{cart.products.length} items</span>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.products.map((item: CartItem) => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <img 
                  src={getSafeImageUrl(item)}
                  alt={getSafeTitle(item)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=No+Image';
                  }}
                />
              </div>
              
              <div className="item-details">
                <h4 className="item-title">{getSafeTitle(item)}</h4>
                <p className="item-price">₹{getSafePrice(item).toLocaleString()}</p>
                
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.productId?._id || '', item.quantity - 1)}
                    disabled={item.quantity <= 1 || updating === item.productId?._id}
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.productId?._id || '', item.quantity + 1)}
                    disabled={item.quantity >= getSafeStock(item) || updating === item.productId?._id}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="item-actions">
                <div className="item-total">
                  ₹{(getSafePrice(item) * item.quantity).toLocaleString()}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.productId?._id || '')}
                  disabled={updating === item.productId?._id}
                >
                  {updating === item.productId?._id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{calculateSubtotal().toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{calculateTotal().toLocaleString()}</span>
            </div>
            <button 
              className="checkout-btn btn-primary"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};