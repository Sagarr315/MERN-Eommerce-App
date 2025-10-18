import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import { Button, Container, Row, Col } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance';

interface SubCategory {
  _id: string;
  name: string;
}

const Accessories: React.FC = () => {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>(undefined);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const mainCategoryRes = await axiosInstance.get('/categories');
        const accessoriesCategory = mainCategoryRes.data.find((cat: any) => 
          cat.name.toLowerCase().includes('accessory')
        );

        if (accessoriesCategory) {
          const subCategoriesRes = await axiosInstance.get('/categories');
          const accessoriesSubCategories = subCategoriesRes.data.filter((cat: any) => 
            cat.parentCategory === accessoriesCategory._id
          );
          setSubCategories(accessoriesSubCategories);
        }
      } catch (err) {
        console.error('Error fetching subcategories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  const handleSubCategoryClick = (subCategoryId: string) => {
    setSelectedSubCategory(selectedSubCategory === subCategoryId ? undefined : subCategoryId);
  };

  const handleShowAll = () => {
    setSelectedSubCategory(undefined);
  };

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h3 fw-bold">Accessories Collection</h2>
            <Button 
              variant="outline-primary" 
              onClick={handleShowAll}
              disabled={!selectedSubCategory}
            >
              Show All Accessories
            </Button>
          </div>
          
          {!loading && subCategories.length > 0 && (
            <div className="subcategory-filters">
              <h5 className="mb-3">Filter by Accessory Type:</h5>
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

      <ProductList category={selectedSubCategory || "accessories"} />
    </Container>
  );
};

export default Accessories;