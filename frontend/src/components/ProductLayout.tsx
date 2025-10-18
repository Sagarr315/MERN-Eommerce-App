import React, { useState } from "react";
import type { Product } from "../types/Product";
import { FaHeart, FaCartPlus, FaEye,  FaRegHeart } from "react-icons/fa";
import "../css/ProductLayout.css";

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

const ProductLayout: React.FC<Props> = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  onQuickView 
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].startsWith("http")
        ? product.images[0]
        : `http://localhost:5000${product.images[0]}`
      : "https://placehold.co/300x300?text=No+Image";

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted);
    onToggleWishlist(product);
  };

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  const handleQuickView = () => {
    onQuickView(product);
  };

  // Safe category name extraction - FIXED THE ERROR
  const getCategoryName = () => {
    if (!product.category) return '';
    
    // Handle different category formats safely
    if (typeof product.category === 'object') {
      const categoryObj = product.category as any; // Use type assertion
      return categoryObj.name || '';
    }
    
    return String(product.category);
  };

  return (
    <div className="product-card">
      {/* Product Image with Overlay */}
      <div className="product-image-container">
        <img 
          src={imageUrl} 
          alt={product.title}
          className={`product-image ${imageLoaded ? 'loaded' : 'loading'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Quick Actions Overlay */}
        <div className="product-actions-overlay">
          <button 
            className="action-btn quick-view-btn"
            onClick={handleQuickView}
            title="Quick View"
          >
            <FaEye />
          </button>
          <button 
            className={`action-btn wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlistClick}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-details">
        {/* Category Tag */}
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

        

        {/* Price Section */}
        <div className="product-price-section">
          <div className="price-container">
            <span className="current-price">₹{product.price.toLocaleString()}</span>
          </div>
          
          {/* Stock Status */}
          <div className="stock-status">
            <span className="in-stock">Available</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          <FaCartPlus className="cart-icon" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductLayout;