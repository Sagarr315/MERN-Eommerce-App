import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import type { Product } from "../types/Product";
import styles from "../css/ProductDetails.module.css";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext)!;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    if (!product) return;

    setAddingToCart(true);
    try {
      await axiosInstance.post("/cart/add", {
        userId: user.id,
        productId: product._id,
        quantity: quantity,
      });

      alert("Product added to cart successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add product to cart");
    } finally {
      setAddingToCart(false);
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

  if (error || !product) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error || "Product not found"}
        </div>
        <button 
          className={`btn ${styles.backBtn}`}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={`container mt-4 ${styles.productDetailsContainer}`}>
      <button
        className={`btn ${styles.backBtn}`}
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" />
        Back to Products
      </button>

      <div className={styles.productDetailsRow}>
        <div className={styles.productImageCol}>
          <div className={styles.mainImageContainer}>
            <img
              src={
                product.images[selectedImage]?.startsWith("http")
                  ? product.images[selectedImage]
                  : `http://localhost:5000${product.images[selectedImage]}`
              }
              alt={product.title}
              className={styles.mainProductImage}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/500x500?text=No+Image";
              }}
            />
          </div>

          {product.images.length > 1 && (
            <div className={styles.thumbnailContainer}>
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={
                    image.startsWith("http")
                      ? image
                      : `http://localhost:5000${image}`
                  }
                  alt={`${product.title} ${index + 1}`}
                  className={`${styles.thumbnailImage} ${
                    selectedImage === index ? styles.thumbnailActive : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/80x80?text=No+Image";
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.productInfoCol}>
          <h1 className={styles.productTitle}>{product.title}</h1>

          <div className={styles.priceSection}>
            <span className={styles.productPrice}>
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <div className={styles.stockSection}>
            <span className={`${styles.stockBadge} ${
              product.stock > 0 ? styles.inStock : styles.outOfStock
            }`}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <p className={styles.productDescription}>{product.description}</p>

          <div className={styles.quantitySection}>
            <label htmlFor="quantity" className={styles.quantityLabel}>
              Quantity
            </label>
            <select
              id="quantity"
              className={styles.quantitySelect}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={product.stock === 0}
            >
              {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            className={styles.addToCartBtn}
            onClick={() => {
              if (user?.role === "admin") {
                alert("Admins cannot add items to cart");
              } else {
                handleAddToCart(); 
              }
            }}
            disabled={product.stock === 0 || addingToCart}
          >
            <FaShoppingCart className={styles.cartIcon} />
            {addingToCart ? "Adding to Cart..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;