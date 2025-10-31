import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { 
  FaBox, 
  FaPlus, 
  FaSync, 
  FaEdit, 
  FaTrash, 
  FaImage,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

import '../../css/AdminCategoriesList.css';

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
}

const AdminProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/products?limit=100');
      setProducts(res.data.products);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  if (loading) return (
    <div className="spinner-container">
      <div className="spinner-border"></div>
    </div>
  );

  return (
    <div className="categories-container  mt-4 m-4">
      <div className="header-section">
        <h2 className="header-title d-flex align-items-center gap-2">
          <FaBox className="text-primary" />
          All Products
        </h2>
        <div className="actions-section">
          <button 
            onClick={() => navigate('/admin/AdminProductPage')} 
            className="gradient-btn d-flex align-items-center justify-content-center gap-2"
          >
            <FaPlus />
            <span className="d-none d-sm-inline">Add New Product</span>
            <span className="d-sm-none">Add Product</span>
          </button>
          <button onClick={fetchProducts} className="refresh-btn d-flex align-items-center justify-content-center gap-2">
            <FaSync />
            <span className="d-none d-sm-inline">Refresh</span>
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="category-card">
        <div className="card-header">
          <h5 className="card-title mb-0">Products List ({products.length})</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th className="text-nowrap">Image</th>
                  <th className="text-nowrap">Product Name</th>
                  <th className="text-nowrap">Price</th>
                  <th className="text-nowrap">Stock</th>
                  <th className="text-nowrap">Status</th>
                  <th className="text-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.title}
                          className="rounded"
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            objectFit: 'cover',
                            minWidth: '40px'
                          }}
                        />
                      ) : (
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-center"
                          style={{ 
                            width: '40px', 
                            height: '40px',
                            minWidth: '40px'
                          }}>
                          <FaImage className="text-white fs-6" />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <strong className="text-truncate" style={{ maxWidth: '150px' }}>
                          {product.title}
                        </strong>
                        <small className="text-muted text-truncate" style={{ maxWidth: '150px' }}>
                          Cat: {product.category?.name}
                        </small>
                      </div>
                    </td>
                    <td className="text-nowrap">
                      <strong>₹{product.price}</strong>
                    </td>
                    <td>
                      <span className={`badge ${product.stock > 0 ? 'badge-active' : 'badge-inactive'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${product.isActive ? 'badge-active' : 'badge-inactive'}`}>
                        {product.isActive ? 
                          <span className="d-flex align-items-center gap-1">
                            <FaCheckCircle />
                            <span className="d-none d-md-inline">Active</span>
                          </span> : 
                          <span className="d-flex align-items-center gap-1">
                            <FaTimesCircle />
                            <span className="d-none d-md-inline">Inactive</span>
                          </span>
                        }
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-activate d-flex align-items-center gap-1"
                          onClick={() => navigate(`/admin/AdminProductPage/${product._id}`)}
                        >
                          <FaEdit />
                          <span className="d-none d-lg-inline">Edit</span>
                        </button>
                        <button 
                          className="btn-deactivate d-flex align-items-center gap-1"
                          onClick={() => handleDelete(product._id)}
                        >
                          <FaTrash />
                          <span className="d-none d-lg-inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="empty-state">
              <h5>No products found</h5>
              <button 
                onClick={() => navigate('/admin/AdminProductPage')} 
                className="gradient-btn mt-2"
              >
                Create First Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductsList;