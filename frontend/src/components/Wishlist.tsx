import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import type { Wishlist, WishlistItem } from "../types/Wishlist";
import axiosInstance from "../api/axiosInstance";
import { FaTrash, FaShoppingCart, FaPhone, FaHeart } from "react-icons/fa";
import styles from "../css/Wishlist.module.css";
import { Link } from "react-router-dom";

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
      const response = await axiosInstance.get("/wishlist");
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
      alert(error.message || "Failed to remove from wishlist");
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = async (product: any) => {
    const productId = product._id;
    setAddingToCart(productId);
    try {
      await onAddToCart(product);
      alert("Product added to cart successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to add product to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  const getSafeImageUrl = (item: WishlistItem): string => {
    const image = item.productId?.images?.[0];
    return image
      ? image.startsWith("http")
        ? image
        : `http://localhost:5000${image}`
      : "https://placehold.co/300x300?text=No+Image";
  };

  const getSafeTitle = (item: WishlistItem): string =>
    item.productId?.title || "No title available";

  const getSafeDescription = (item: WishlistItem): string => {
    const desc = item.productId?.description || "No description available";
    return desc.length > 100 ? `${desc.substring(0, 100)}...` : desc;
  };

  const getSafePrice = (item: WishlistItem): number =>
    item.productId?.price || 0;

  const getSafeStock = (item: WishlistItem): number =>
    item.productId?.stock || 0;

  const getSafeProductId = (item: WishlistItem): string =>
    item.productId?._id || item._id;

  const getProductForCart = (item: WishlistItem): any => {
    if (item.productId) {
      return {
        _id: item.productId._id,
        title: item.productId.title,
        price: item.productId.price,
        images: item.productId.images,
        description: item.productId.description,
        stock: item.productId.stock,
      };
    } else {
      return {
        _id: item._id,
        title: getSafeTitle(item),
        price: getSafePrice(item),
        stock: getSafeStock(item),
      };
    }
  };

  if (loading) {
    return (
      <div className={styles["wishlist-loading"]}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
    return (
      <div className={styles["wishlist-empty"]}>
        <div className={styles["empty-wishlist-icon"]}>
          <FaHeart className="text-danger" />
        </div>
        <h3>Your wishlist is empty</h3>
        <p>Save your favorite items here for later</p>
        <Link to="/discover" className={styles["add-to-cart-btn"]}>
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className={styles["wishlist-page"]}>
      <div className={styles["wishlist-header"]}>
        <h1>My Wishlist</h1>
        <span className={styles["wishlist-count"]}>
          {wishlist.products.length} items
        </span>
      </div>

      <div className={styles["wishlist-table-container"]}>
        <table className={styles["wishlist-table"]}>
          <thead>
            <tr>
              <th className="text-start">Product</th>
              <th className="text-center">Price</th>
              <th className="text-center">Stock Status</th>
              <th className="text-center">Action</th>
              <th className="text-center">Remove</th>
            </tr>
          </thead>
          <tbody>
            {wishlist.products.map((item: WishlistItem) => {
              const productId = getSafeProductId(item);
              const productForCart = getProductForCart(item);
              const stock = getSafeStock(item);
              const isInStock = stock > 0;

              return (
                <tr key={item._id}>
                  <td
                    className={`${styles["product-cell"]} text-start align-middle`}
                    data-label="Product"
                  >
                    <div className={styles["product-info"]}>
                      <div className={styles["product-image"]}>
                        <img
                          src={getSafeImageUrl(item)}
                          alt={getSafeTitle(item)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/300x300?text=No+Image";
                          }}
                        />
                      </div>
                      <div className={styles["product-details"]}>
                        <h4 className={styles["product-title"]}>
                          {getSafeTitle(item)}
                        </h4>
                        <p className={styles["product-description"]}>
                          {getSafeDescription(item)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    className={`${styles["price-cell"]} text-center align-middle`}
                    data-label="Price"
                  >
                    ₹{getSafePrice(item).toLocaleString()}
                  </td>
                  <td
                    className={`${styles["stock-cell"]} text-center align-middle`}
                    data-label="Stock Status"
                  >
                    <span
                      className={`${styles["stock-status"]} ${
                        isInStock ? styles["in-stock"] : styles["out-of-stock"]
                      }`}
                    >
                      {isInStock ? "In Stock" : "Stock Out"}
                    </span>
                  </td>
                  <td
                    className={`${styles["action-cell"]} text-center align-middle`}
                    data-label="Action"
                  >
                    {isInStock ? (
                      <button
                        className={`${styles["add-to-cart-btn"]} btn btn-success btn-sm`}
                        onClick={() => handleAddToCart(productForCart)}
                        disabled={addingToCart === productId}
                      >
                        <FaShoppingCart className="me-2" />
                        {addingToCart === productId
                          ? "Adding..."
                          : "Add to Cart"}
                      </button>
                    ) : (
                      <button
                        className={`${styles["contact-us-btn"]} btn btn-secondary btn-sm`}
                        disabled
                      >
                        <FaPhone className="me-2" />
                        Contact Us
                      </button>
                    )}
                  </td>
                  <td
                    className={`${styles["remove-cell"]} text-center align-middle`}
                    data-label="Remove"
                  >
                    <button
                      className={`${styles["remove-btn"]} btn btn-outline-danger btn-sm`}
                      onClick={() => handleRemoveFromWishlist(productId)}
                      disabled={removing === productId}
                      title="Remove from wishlist"
                    >
                      {removing === productId ? (
                        <div
                          className="spinner-border spinner-border-sm"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WishlistComponent;
