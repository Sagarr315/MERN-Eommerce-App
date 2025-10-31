import styles from '../css/Cart.module.css';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { Cart as CartType, CartItem } from '../types/Cart';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from "react-router-dom";
import { FaLock } from 'react-icons/fa';

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
      console.error('Error fetching cart:', error);
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
      console.error('Error updating quantity:', error);
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
      console.error('Error removing item:', error);
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
      return 'https://placehold.co/300x300/e2e8f0/475569?text=No+Image';
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
      <div className={styles['cart-loading']}>
        <div className={styles['loading-spinner']}>
          <div className={styles['spinner-circle']}></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className={styles['cart-empty-state']}>
        <div className={styles['empty-cart-animation']}>
          <div className={styles['cart-icon']}>🛒</div>
          <div className={styles['empty-dots']}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <h2>Your Cart Feels Light</h2>
        <p>Discover amazing products and fill it up!</p>
        <button 
          className={styles['btn-explore']}
          onClick={() => navigate('/products')}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className={styles['modern-cart']}>
      {/* Header */}
      <div className={styles['cart-header-section']}>
        <div className={styles['header-content']}>
          <h1 className={styles['cart-title']}>Shopping Cart</h1>
          <div className={styles['cart-meta']}>
            <span className={styles['item-count']}>{cart.products.length} {cart.products.length === 1 ? 'item' : 'items'}</span>
            <span className={styles['cart-divider']}>•</span>
            <span className={styles['total-price']}>₹{calculateTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles['cart-layout']}>
        {/* Cart Items */}
        <div className={styles['cart-items-section']}>
          <div className={styles['items-header']}>
            <h3>Products</h3>
            <span className="d-none d-lg-inline d-md-inline" >Quantity & Price</span>
          </div>

          <div className={styles['cart-items-list']}>
            {cart.products.map((item: CartItem) => (
              <div key={item._id} className={styles['modern-cart-item']}>
                {/* Product Image */}
                <div className={styles['product-image-container']}>
                  <img 
                    src={getSafeImageUrl(item)}
                    alt={getSafeTitle(item)}
                    className={styles['product-image']}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/300x300/e2e8f0/475569?text=No+Image';
                    }}
                  />
                  {item.quantity > 1 && (
                    <span className={styles['quantity-badge']}>Quantity {item.quantity}</span>
                  )}
                </div>

                {/* Product Details */}
                <div className={styles['product-details']}>
                  <h4 className={styles['product-title']}>{getSafeTitle(item)}</h4>
                  <p className={styles['product-price']}>₹{getSafePrice(item).toLocaleString()}</p>
                  <div className={styles['stock-info']}>
                    {getSafeStock(item) > 0 ? (
                      <span className={styles['in-stock']}>In Stock ({getSafeStock(item)} available)</span>
                    ) : (
                      <span className={styles['out-of-stock']}>Out of Stock</span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className={styles['quantity-section']}>
                  <div className={styles['modern-quantity-controls']}>
                    <button
                      className={`${styles['quantity-btn']} ${styles['decrease']}`}
                      onClick={() => handleQuantityChange(item.productId?._id || '', item.quantity - 1)}
                      disabled={item.quantity <= 1 || updating === item.productId?._id}
                    >
                      <span className={styles['btn-icon']}>−</span>
                    </button>
                    
                    <div className={styles['quantity-display']}>
                      <span className={styles['quantity-number']}>{item.quantity}</span>
                    </div>
                    
                    <button
                      className={`${styles['quantity-btn']} ${styles['increase']}`}
                      onClick={() => handleQuantityChange(item.productId?._id || '', item.quantity + 1)}
                      disabled={item.quantity >= getSafeStock(item) || updating === item.productId?._id}
                    >
                      <span className={styles['btn-icon']}>+</span>
                    </button>
                  </div>
                </div>

                {/* Item Total & Actions */}
                <div className={styles['item-total-section']}>
                  <div className={styles['item-total-price']}>
                     <span className="d-inline d-sm-none">Price: </span>
                    ₹{(getSafePrice(item) * item.quantity).toLocaleString()}
                  </div>
                  <button
                    className={styles['remove-item-btn']}
                    onClick={() => handleRemoveItem(item.productId?._id || '')}
                    disabled={updating === item.productId?._id}
                  >
                    {updating === item.productId?._id ? (
                      <span className={styles['removing-text']}>Removing...</span>
                    ) : (
                      <span className={styles['remove-text']}>Remove</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className={styles['order-summary-section']}>
          <div className={styles['summary-card']}>
            <h3 className={styles['summary-title']}>Order Summary</h3>
            
            <div className={styles['summary-details']}>
              <div className={styles['summary-row']}>
                <span className={styles['label']}>Subtotal ({cart.products.length} items)</span>
                <span className={styles['value']}>₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              
              <div className={styles['summary-row']}>
                <span className={styles['label']}>Shipping</span>
                <span className={`${styles['value']} ${styles['free']}`}>FREE</span>
              </div>
              
              <div className={styles['summary-row']}>
                <span className={styles['label']}>Tax</span>
                <span className={styles['value']}>Included</span>
              </div>
              
              <div className={styles['summary-divider']}></div>
              
              <div className={`${styles['summary-row']} ${styles['total-row']}`}>
                <span className={styles['label']}>Total Amount</span>
                <span className={`${styles['value']} ${styles['total-amount']}`}>₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <button 
              className={styles['checkout-btn']}
              onClick={() => navigate('/checkout')}
            >
              <span className={styles['btn-text']}>Proceed to Checkout</span>
              <span className={styles['btn-arrow']}>→</span>
            </button>

            <div className={styles['security-notice']}>
              <div className={styles['secure-icon']}><FaLock /></div>
              <span>Secure checkout guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};