import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import axiosInstance from '../api/axiosInstance';
import { FaTshirt, FaFemale, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import styles from '../css/Discover.module.css';

const Discover: React.FC = () => {
  //  USE ANY TYPE FOR STATE - COMPLETELY SAFE
  const [selectedMainCategory, setSelectedMainCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>(undefined);
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  //  Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        const allCategories = res.data || [];
        
        //  FORCE TYPE CONVERSION
        const mainCats = (allCategories as any[]).filter((cat: any) => !cat.parentCategory);
        setMainCategories(mainCats);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setMainCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  //  Fetch subcategories when main category is selected
  useEffect(() => {
    if (!selectedMainCategory) {
      setSubCategories([]);
      return;
    }

    const fetchSubCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        const allCategories = res.data || [];

        //  FORCE TYPE CONVERSION
        const subs = (allCategories as any[]).filter(
          (cat: any) => cat.parentCategory === selectedMainCategory._id
        );

        setSubCategories(subs);
        setSelectedSubCategory(undefined);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setSubCategories([]);
      }
    };

    fetchSubCategories();
  }, [selectedMainCategory]);

  //  Click Handlers
  const handleMainCategoryClick = (category: any) => {
    setSelectedMainCategory(category);
  };

  const handleSubCategoryClick = (subCategoryId: string) => {
    setSelectedSubCategory(
      subCategoryId === selectedSubCategory ? undefined : subCategoryId
    );
  };

  const handleBackToMain = () => {
    setSelectedMainCategory(null);
    setSelectedSubCategory(undefined);
  };

  const handleViewAll = () => {
    setSelectedMainCategory(null);
    setSelectedSubCategory(undefined);
  };

  //  Icons
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('saree') || name.includes('women')) return <FaFemale />;
    if (name.includes('kid') || name.includes('children')) return <FaTshirt />;
    if (name.includes('accessory') || name.includes('bag')) return <FaShoppingBag />;
    return <FaShoppingBag />;
  };

  //  Loading
  if (loading) {
    return (
      <div className={`container my-5 text-center ${styles.loadingContainer}`}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className={styles.loadingText}>Loading categories...</p>
      </div>
    );
  }

  //  Final UI
  return (
    <div className={`container my-5 ${styles.container}`}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>
          {selectedMainCategory
            ? `${selectedMainCategory.name} Collection`
            : 'Shop by Category'}
        </h2>
        <button className={styles.viewAllBtn} onClick={handleViewAll}>
          {selectedMainCategory ? 'View All Categories' : 'See more categories'} →
        </button>
      </div>

      {/* Back Button */}
      {selectedMainCategory && (
        <button className={styles.backBtn} onClick={handleBackToMain}>
          <FaArrowLeft className="me-2" />
          Back to Categories
        </button>
      )}

      {/* Sub Categories Heading */}
      {selectedMainCategory && subCategories.length > 0 && (
        <h3 className={styles.subCategoriesTitle}>
          {selectedMainCategory.name} Types
        </h3>
      )}

      {/* Sub Categories as buttons in grid */}
      {selectedMainCategory && subCategories.length > 0 && (
        <div className="row  mb-4">
          {subCategories.map((subCat: any) => (
            <div key={subCat._id} className="col-4 col-sm-3 col-md-2 mb-2">
              <button
                className={`w-100 ${styles.subCategoryBtn} ${
                  selectedSubCategory === subCat._id ? styles.active : ''
                }`}
                onClick={() => handleSubCategoryClick(subCat._id)}
              >
                {subCat.name}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Categories as small cards in grid */}
      {!selectedMainCategory && (
        <div className="row mx-1">
          {mainCategories.map((category: any) => (
            <div
              key={category._id}
              className={`col-4 col-sm-3 col-md-2 ${styles.categoryCard} ${
                selectedMainCategory?._id === category._id ? styles.active : ''
              }`}
              onClick={() => handleMainCategoryClick(category)}
            >
              <div className={styles.categoryIcon}>
                {getCategoryIcon(category.name)}
              </div>
              <h5 className={styles.categoryName}>{category.name}</h5>
            </div>
          ))}
        </div>
      )}

      {/* No Categories */}
      {mainCategories.length === 0 && !loading && (
        <div className="text-center py-5">
          <p className="text-muted">No categories found.</p>
        </div>
      )}

      {/* Products */}
      <div className="mt-4">
        <ProductList category={selectedSubCategory || selectedMainCategory?._id} />
      </div>
    </div>
  );
};

export default Discover;