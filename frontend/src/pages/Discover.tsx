import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import { Card, Spinner } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';
import '../css/Discover.css';
import { FaTshirt, FaFemale, FaShoppingBag } from 'react-icons/fa';

interface Category {
  _id: string;
  name: string;
  parentCategory?: string;
}

const Discover: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category) => {
    if (selectedCategory === category._id) {
      setSelectedCategory(undefined);
      setSelectedCategoryName(undefined);
    } else {
      setSelectedCategory(category._id);
      setSelectedCategoryName(category.name);
    }
  };

  const handleViewAll = () => {
    setSelectedCategory(undefined);
    setSelectedCategoryName(undefined);
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Shop by Category</h2>
        <button 
          className="btn btn-link text-primary text-decoration-none fw-semibold p-0"
          onClick={handleViewAll}
        >
          {selectedCategory ? 'View All Products' : 'See more categories'} →
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="row g-3 mb-5">
          {categories.map((cat) => (
            <div key={cat._id} className="col-6 col-sm-4 col-md-3 col-lg-2">
              <Card
                onClick={() => handleCategoryClick(cat)}
                className={`category-card text-center p-3 shadow-sm ${
                  selectedCategory === cat._id ? 'active' : ''
                }`}
                style={{ 
                  cursor: 'pointer', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  height: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Card.Body className="p-0 d-flex flex-column align-items-center justify-content-center">
                  <div className="category-icon mb-2" style={{ fontSize: '1.8rem', color: '#666' }}>
                    {cat.name.toLowerCase().includes('saree') && <FaFemale />}
                    {cat.name.toLowerCase().includes('kid') &&  <FaTshirt />}
                    {cat.name.toLowerCase().includes('accessory') && <FaShoppingBag />}
                  </div>
                  <Card.Title className="fs-6 mb-0 text-capitalize text-center">
                    {cat.name}
                  </Card.Title>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mb-5">
          <p className="text-muted">No categories found.</p>
        </div>
      )}

      {/* Products Section */}
      <div className="mt-4">
        {selectedCategoryName && (
          <h3 className="mb-4 text-capitalize">{selectedCategoryName} Collection</h3>
        )}
        <ProductList category={selectedCategory} />
      </div>
    </div>
  );
};

export default Discover;