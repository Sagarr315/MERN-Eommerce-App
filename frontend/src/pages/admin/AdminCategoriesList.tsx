import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

interface Category {
  _id: string;
  name: string;
  parentCategory?: string | null;
  isActive: boolean; // ✅ ADDED
}

const AdminCategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      // ✅ CORRECT: Use admin endpoint to get ALL categories
      const res = await axiosInstance.get('/categories/admin/all');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ ACTIVATE CATEGORY
  const handleActivate = async (id: string) => {
    try {
      await axiosInstance.patch(`/categories/${id}/activate`);
      setCategories(categories.map(cat => 
        cat._id === id ? { ...cat, isActive: true } : cat
      ));
    } catch (err) {
      setError('Failed to activate category');
    }
  };

  // ✅ DEACTIVATE CATEGORY
  const handleDeactivate = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this category? Products under this category will be hidden.')) return;
    
    try {
      await axiosInstance.patch(`/categories/${id}/deactivate`);
      setCategories(categories.map(cat => 
        cat._id === id ? { ...cat, isActive: false } : cat
      ));
    } catch (err) {
      setError('Failed to deactivate category');
    }
  };

  if (loading) return <div className="container text-center mt-5"><div className="spinner-border"></div></div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📁 All Categories</h2>
        <div>
          <button 
            onClick={() => window.location.href = '/admin/AdminProductPage'} 
            className="btn btn-primary me-2"
          >
            ➕ Add New Category
          </button>
          <button onClick={fetchCategories} className="btn btn-outline-secondary">
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">Categories List ({categories.length})</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-dark">
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
                    <td>📁 {category.name}</td>
                    <td>
                      {category.parentCategory ? 
                        <span className="badge bg-secondary">Subcategory</span> : 
                        <span className="badge bg-primary">Main Category</span>
                      }
                    </td>
                    <td>
                      <span className={`badge ${category.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        {category.isActive ? (
                          <button 
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleDeactivate(category._id)}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button 
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleActivate(category._id)}
                          >
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
            <div className="text-center py-5">
              <h5>No categories found</h5>
              <button 
                onClick={() => window.location.href = '/admin/AdminProductPage'} 
                className="btn btn-primary"
              >
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