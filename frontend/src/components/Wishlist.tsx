import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { Wishlist, WishlistItem } from '../types/Wishlist';
import axiosInstance from '../api/axiosInstance';
import '../css/Wishlist.css';

interface WishlistProps {
  onAddToCart: (product: any) => Promise<void>;
  onRemoveFromWishlist: (productId: string) => Promise<void>;
}

const WishlistComponent: React.FC<WishlistProps> = ({
  onAddToCart,
  onRemoveFromWishlist,
}) => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { user } = useContext(AuthContext) || {};

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/wishlist');
      setWishlist(response.data);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemoving(productId);
    try {
      await onRemoveFromWishlist(productId);
      await fetchWishlist();
    } catch (error: any) {
      alert(error.message || 'Failed to remove from wishlist');
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = async (product: any) => {
    const productId = product._id;
    setAddingToCart(productId);
    try {
      await onAddToCart(product);
      alert('Product added to cart successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to add product to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const getSafeImageUrl = (item: WishlistItem): string => {
    const image = item.productId?.images?.[0];
    return image
      ? image.startsWith('http')
        ? image
        : `http://localhost:5000${image}`
      : 'https://placehold.co/300x300?text=No+Image';
  };

  const getSafeTitle = (item: WishlistItem): string =>
    item.productId?.title || 'No title available';

  const getSafeDescription = (item: WishlistItem): string => {
    const desc = item.productId?.description || 'No description available';
    return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc;
  };

  const getSafePrice = (item: WishlistItem): number =>
    item.productId?.price || 0;

  const getSafeProductId = (item: WishlistItem): string =>
    item.productId?._id || item._id;

  const getProductForCart = (item: WishlistItem): any => {
    if (item.productId) {
      return {
        _id: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        images: item.productId.images,
        description: item.productId.description
      };
    } else {
      return {
        _id: item._id,
        title: getSafeTitle(item),
        price: getSafePrice(item)
      };
    }
  };

  if (loading) {
    return (
      <div className="wishlist-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="empty-wishlist-icon"></div>
        <h3>Your wishlist is empty</h3>
        <p>Save your favorite items here for later</p>
        <a href="/products" className="btn btn-primary">
          Explore Products
        </a>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <span className="wishlist-count">{wishlist.products.length} items</span>
      </div>

      <div className="wishlist-grid">
        {wishlist.products.map((item: WishlistItem) => {
          const productId = getSafeProductId(item);
          const productForCart = getProductForCart(item);
          
          return (
            <div key={item._id} className="wishlist-item">
              <div className="item-image">
                <img
                  src={getSafeImageUrl(item)}
                  alt={getSafeTitle(item)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/300x300?text=No+Image';
                  }}
                />
                <button
                  className="remove-wishlist-btn"
                  onClick={() => handleRemoveFromWishlist(productId)}
                  disabled={removing === productId}
                  title="Remove from wishlist"
                >
                  {removing === productId ? '...' : '×'}
                </button>
              </div>

              <div className="item-details">
                <h4 className="item-title">{getSafeTitle(item)}</h4>
                <p className="item-description">{getSafeDescription(item)}</p>
                <div className="item-price">
                  ₹{getSafePrice(item).toLocaleString()}
                </div>

                <div className="item-actions">
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(productForCart)}
                    disabled={addingToCart === productId}
                  >
                    {addingToCart === productId ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistComponent;