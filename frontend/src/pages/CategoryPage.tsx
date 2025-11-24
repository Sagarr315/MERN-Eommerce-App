import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ProductList from '../components/ProductList';
import axiosInstance from '../api/axiosInstance';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface SubCategory {
  _id: string;
  name: string;
}

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Fetch category details and subcategories
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId) return;

      try {
        setLoading(true);
        
        // Fetch main category details
        const categoryRes = await axiosInstance.get(`/categories/${categoryId}`);
        setCategory(categoryRes.data);

        // Fetch all subcategories of this category
        const allCategoriesRes = await axiosInstance.get('/categories');
        const subs = allCategoriesRes.data.filter((cat: any) => 
          cat.parentCategory === categoryId && cat.isActive
        );
        setSubCategories(subs);

      } catch (err) {
        console.error('Error fetching category data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  const handleSubCategoryClick = (subCategoryId: string) => {
    setSelectedSubCategory(selectedSubCategory === subCategoryId ? undefined : subCategoryId);
  };

  const handleShowAll = () => {
    setSelectedSubCategory(undefined);
  };

  if (loading) {
    return (
      <Container className="my-4">
        <div className="text-center">Loading...</div>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container className="my-4">
        <div className="text-center">Category not found</div>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {/* Category Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 className="h2 fw-bold">{category.name}</h1>
              {category.description && (
                <p className="text-muted mb-0">{category.description}</p>
              )}
            </div>
            <Button 
              variant="outline-primary" 
              onClick={handleShowAll}
              disabled={!selectedSubCategory}
            >
              Show All {category.name}
            </Button>
          </div>
          
          {/* Subcategory Filters */}
          {subCategories.length > 0 && (
            <div className="subcategory-filters">
              <h5 className="mb-3">Filter by {category.name} Type:</h5>
              <div className="d-flex flex-wrap gap-2">
                {subCategories.map((subCat) => (
                  <Button
                    key={subCat._id}
                    variant={selectedSubCategory === subCat._id ? "primary" : "outline-primary"}
                    onClick={() => handleSubCategoryClick(subCat._id)}
                    className="text-capitalize"
                  >
                    {subCat.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Col>
      </Row>

      {/* Product List */}
      {/* If subcategory selected, show products from that subcategory */}
      {/* Otherwise show products from main category */}
      <ProductList 
        category={selectedSubCategory || categoryId} 
        key={selectedSubCategory || categoryId}
      />
    </Container>
  );
};

export default CategoryPage;