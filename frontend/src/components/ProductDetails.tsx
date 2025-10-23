import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import type { Product } from "../types/Product";

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
        setError(err.response?.data?.message || 'Product not found');
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
      await axiosInstance.post('/cart/add', {
        userId: user.id,
        productId: product._id,
        quantity: quantity
      });

      alert('Product added to cart successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add product to cart');
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
          {error || 'Product not found'}
        </div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" />
        Back to Products
      </button>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-4">
            <img
              src={product.images[selectedImage]?.startsWith('http') 
                ? product.images[selectedImage] 
                : `http://localhost:5000${product.images[selectedImage]}`
              }
              alt={product.title}
              className="img-fluid rounded"
              style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/500x500?text=No+Image';
              }}
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="d-flex gap-2 flex-wrap">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image.startsWith('http') ? image : `http://localhost:5000${image}`}
                  alt={`${product.title} ${index + 1}`}
                  className={`img-thumbnail ${selectedImage === index ? 'border-primary' : ''}`}
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/80x80?text=No+Image';
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <h1 className="h2">{product.title}</h1>

          <div className="mb-3">
            <span className="h3 text-primary">₹{product.price.toLocaleString()}</span>
          </div>

          <div className="mb-4">
            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <p className="mb-4">{product.description}</p>

          <div className="row mb-4">
            <div className="col-md-4">
              <label htmlFor="quantity" className="form-label">Quantity</label>
              <select
                id="quantity"
                className="form-select"
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
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
          >
            <FaShoppingCart className="me-2" />
            {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
          </button>

          {!user && (
            <div className="mt-2">
              <small className="text-muted">
                * You need to login to add items to cart
              </small>
            </div>
          )}
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <h3 className="h4 mb-4">Customer Reviews</h3>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;