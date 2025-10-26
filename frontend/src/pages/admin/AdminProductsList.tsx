import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

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

  // ✅ REMOVED the separate handleEdit function since we use navigate directly

  if (loading) return <div className="container text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 All Products</h2>
        <div>
          <button 
            onClick={() => navigate('/admin/AdminProductPage')} 
            className="btn btn-primary me-2"
          >
            ➕ Add New Product
          </button>
          <button onClick={fetchProducts} className="btn btn-outline-secondary">
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">Products List ({products.length})</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="bg-secondary rounded d-flex align-items-center justify-content-center"
                          style={{ width: '50px', height: '50px' }}>
                          <span className="text-white">No Image</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{product.title}</strong>
                      <br />
                      <small className="text-muted">Category: {product.category?.name}</small>
                    </td>
                    <td>₹{product.price}</td>
                    <td>
                      <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${product.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/admin/AdminProductPage/${product._id}`)} // ✅ DIRECT NAVIGATION
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="text-center py-5">
              <h5>No products found</h5>
              <button 
                onClick={() => navigate('/admin/AdminProductPage')} 
                className="btn btn-primary"
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