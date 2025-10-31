import React, { useEffect, useState } from "react";
import ProductCard from "./ProductLayout";
import type { Product } from "../types/Product";
import axiosInstance from "../api/axiosInstance";
import "../css/ProductList.css";
import { FiFilter } from 'react-icons/fi';

interface Props {
  category?: string;
}

const ProductList: React.FC<Props> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState<string>("name");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [categoryName, setCategoryName] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false); // Mobile filters toggle
  const limit = 12;

  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "name_desc", label: "Name Z-A" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-1000", label: "Under ₹1,000" },
    { value: "1000-5000", label: "₹1,000 - ₹5,000" },
    { value: "5000-10000", label: "₹5,000 - ₹10,000" },
    { value: "10000-999999", label: "Over ₹10,000" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [category, page, sortBy, priceRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        sort: sortBy,
      };

      if (category) params.category = category;
      if (priceRange !== "all") params.priceRange = priceRange;

      const res = await axiosInstance.get("/products", { params });

      const productsData = res.data.products || res.data || [];
      const totalData = res.data.total || productsData.length;

      setProducts(productsData);
      setTotal(totalData);

      if (category && productsData.length > 0 && productsData[0].category) {
        setCategoryName(productsData[0].category.name || "");
      } else {
        setCategoryName("");
      }
    } catch (err: any) {
      setProducts([]);
      setTotal(0);
      setCategoryName("");
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriceRange(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSortBy("name");
    setPriceRange("all");
    setPage(1);
    setShowFilters(false);
  };

  const handleAddToCart = () => {
    // Your add to cart logic
  };

  const handleToggleWishlist = async (productId: string) => {
    try {
      const currentProduct = products.find(p => p._id === productId);
      const isCurrentlyInWishlist = currentProduct?.isInWishlist || false;

      if (isCurrentlyInWishlist) {
        await axiosInstance.delete('/wishlist/remove', {
          data: { productId }
        });
        alert('Removed from favorites!');
      } else {
        await axiosInstance.post('/wishlist/add', {
          productId
        });
        alert('Added to favorites!');
      }
      
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p._id === productId 
            ? { ...p, isInWishlist: !isCurrentlyInWishlist }
            : p
        )
      );
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container my-3 my-md-4">
      {/* Header Section - Improved for mobile */}
      <div className="row mb-3 mb-md-4">
        <div className="col-12">
          <div className="product-list-header">
            <div className="header-content">
              <h1 className="page-title">
                {categoryName ? `${categoryName} Collection` : "All Products"}
              </h1>
              <p className="product-count">{total} products found</p>
            </div>
            
            {/* Mobile Filter Toggle Button */}
            <button
              className="btn btn-filter-toggle d-md-none"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span>Filters</span>
              <i className={`filter-icon ${showFilters ? 'active' : ''}`}><FiFilter/></i>
            </button>
            
            {/* Filters Section - Responsive */}
            <div className={`filters-section ${showFilters ? 'show' : ''}`}>
              <div className="filter-group">
                <label className="filter-label">Sort by:</label>
                <select 
                  value={sortBy}
                  onChange={handleSortChange}
                  className="filter-select"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Price:</label>
                <select
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  className="filter-select"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-clear-filters"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <h4 className="text-muted mb-3">No products found</h4>
            <p className="text-muted mb-3">
              Try adjusting your filters or search terms
            </p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Products Grid - Improved responsive columns */}
          <div className="row g-2 g-sm-3 g-md-4">
            {products.map((product) => (
              <div key={product._id} className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isInWishlist={product.isInWishlist || false}
                />
              </div>
            ))}
          </div>

          {/* Pagination - Improved for mobile */}
          {totalPages > 1 && (
            <div className="pagination-section">
              <button
                className="btn btn-pagination"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ←
              </button>

              <span className="pagination-info d-none d-sm-inline">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <span className="pagination-info d-sm-none">
                <strong>{page}</strong>/<strong>{totalPages}</strong>
              </span>

              <button
                className="btn btn-pagination"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;