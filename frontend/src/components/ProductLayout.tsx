import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/Product";
import { FaHeart, FaCartPlus, FaEye, FaRegHeart } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import "../css/ProductLayout.css";

interface Props {
  product: Product | null;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isInWishlist?: boolean;
}

const ProductLayout: React.FC<Props> = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext)!;

  if (!product) {
    return (
      <div className="product-card">
        <div className="product-image-container">
          <img 
            src="https://placehold.co/300x300?text=No+Product" 
            alt="Product not available"
            className="product-image"
          />
        </div>
        <div className="product-details">
          <h3 className="product-title">Product not available</h3>
          <p className="product-description">This product could not be loaded.</p>
        </div>
      </div>
    );
  }

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].startsWith("http")
        ? product.images[0]
        : `http://localhost:5000${product.images[0]}`
      : "https://placehold.co/300x300?text=No+Image";

  const handleWishlistClick = async () => {
    if (!user) {
      alert("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    try {
      await onToggleWishlist(product._id);
    } catch (error) {
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      await axiosInstance.post('/cart/add', {
        userId: user.id,
        productId: product._id,
        quantity: 1
      });

      alert('Product added to cart successfully!');
      
      if (onAddToCart) {
        onAddToCart(product);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuickView = () => {
    navigate(`/products/${product._id}`);
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const getCategoryName = () => {
    if (!product.category) return '';
    if (typeof product.category === 'object') {
      const categoryObj = product.category as any;
      return categoryObj.name || '';
    }
    return String(product.category);
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{cursor: 'pointer'}}>
      <div className="product-image-container">
        <img 
          src={imageUrl} 
          alt={product.title}
          className={`product-image ${imageLoaded ? 'loaded' : 'loading'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        <div className="product-actions-overlay">
          <button 
            className="action-btn quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickView();
            }}
            title="Quick View"
          >
            <FaEye />
          </button>
          <button 
            className={`action-btn wishlist-btn ${isInWishlist ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistClick();
            }}
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {isInWishlist ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
      </div>

      <div className="product-details">
        {product.category && (
          <span className="product-category">
            {getCategoryName()}
          </span>
        )}
        
        <h3 className="product-title">{product.title}</h3>
        
        <p className="product-description">
          {product.description && product.description.length > 80 
            ? `${product.description.substring(0, 80)}...` 
            : product.description
          }
        </p>

        <div className="product-price-section">
          <div className="price-container">
            <span className="current-price">₹{product.price.toLocaleString()}</span>
          </div>
          
          <div className="stock-status">
            <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        <button 
          className="add-to-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={product.stock === 0 || addingToCart}
        >
          <FaCartPlus className="cart-icon" />
          {addingToCart ? 'Adding...' : (product.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
        </button>
      </div>
    </div>
  );
};

export default ProductLayout;