import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { 
  FaFolder, 
  FaPlus, 
  FaSync, 
  FaEye, 
  FaEyeSlash, 
  FaListAlt,
  FaBox,
  FaTags
} from 'react-icons/fa';
import '../../css/AdminCategoriesList.css';

interface Category {
  _id: string;
  name: string;
  parentCategory?: string | null;
  isActive: boolean;
}

const AdminCategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/categories/admin/all');
      setCategories(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleActivate = async (id: string) => {
    try {
      await axiosInstance.patch(`/categories/${id}/activate`);
      setCategories(categories.map(cat => 
        cat._id === id ? { ...cat, isActive: true } : cat
      ));
      setError(null);
    } catch (err) {
      setError('Failed to activate category');
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this category? Products under this category will be hidden.')) return;
    
    try {
      await axiosInstance.patch(`/categories/${id}/deactivate`);
      setCategories(categories.map(cat => 
        cat._id === id ? { ...cat, isActive: false } : cat
      ));
      setError(null);
    } catch (err) {
      setError('Failed to deactivate category');
    }
  };

  if (loading) return (
    <div className="spinner-container">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div className="container categories-container mt-4">
      <div className="header-section">
        <h2 className="header-title">
          <FaTags className="me-2" />
          All Categories
        </h2>
        <div className="actions-section">
          <button 
            onClick={() => window.location.href = '/admin/AdminProductPage'} 
            className="btn gradient-btn"
          >
            <FaPlus className="me-2" />
            Add New Category
          </button>
          <button onClick={fetchCategories} className="btn refresh-btn">
            <FaSync className="me-2" />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card category-card">
        <div className="card-header">
          <h5 className="card-title">
            <FaListAlt className="me-2" />
            Categories List ({categories.length})
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td data-label="Category Name">
                      <div className="category-name">
                        <FaFolder className="text-primary" />
                        {category.name}
                      </div>
                    </td>
                    <td data-label="Type">
                      {category.parentCategory ? 
                        <span className="badge badge-sub">Subcategory</span> : 
                        <span className="badge badge-main">Main Category</span>
                      }
                    </td>
                    <td data-label="Status">
                      <span className={`badge ${category.isActive ? 'badge-active' : 'badge-inactive'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div className="action-buttons">
                        {category.isActive ? (
                          <button 
                            className="btn btn-deactivate"
                            onClick={() => handleDeactivate(category._id)}
                          >
                            <FaEyeSlash className="me-1" />
                            Deactivate
                          </button>
                        ) : (
                          <button 
                            className="btn btn-activate"
                            onClick={() => handleActivate(category._id)}
                          >
                            <FaEye className="me-1" />
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {categories.length === 0 && (
            <div className="empty-state">
              <FaBox size={48} className="text-muted mb-3" />
              <h5>No categories found</h5>
              <button 
                onClick={() => window.location.href = '/admin/AdminProductPage'} 
                className="btn gradient-btn mt-2"
              >
                <FaPlus className="me-2" />
                Create First Category
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesList;