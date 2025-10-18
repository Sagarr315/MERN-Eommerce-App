import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Spinner,
  Form,
  Button,
  Card,
  Container,
} from "react-bootstrap";
import ProductCard from "./ProductLayout";
import type { Product } from "../types/Product";
import axiosInstance from "../api/axiosInstance";
import "../css/ProductList.css";

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
  const limit = 12;

  // Sort options
  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "name_desc", label: "Name Z-A" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];

  // Price range options
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
      console.error(" Error fetching products:", err?.response?.data || err);
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
  };
  // Add these 3 functions after your existing handleSortChange, handlePriceRangeChange functions:

  const handleAddToCart = (product: Product) => {
    console.log("Add to cart:", product);
    // TODO: Implement add to cart logic
  };

  const handleToggleWishlist = (product: Product) => {
    console.log("Toggle wishlist:", product);
    // TODO: Implement wishlist logic
  };

  const handleQuickView = (product: Product) => {
    console.log("Quick view:", product);
    // TODO: Implement quick view modal
  };
  const totalPages = Math.ceil(total / limit);

  return (
    <Container className="my-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 fw-bold text-dark mb-1">
                {categoryName ? `${categoryName} Collection` : "All Products"}
              </h1>
              <p className="text-muted mb-0">{total} products found</p>
            </div>
            <div className="d-flex gap-3">
              {/* Sort Dropdown */}
              <Form.Group controlId="sortSelect" className="mb-0">
                <Form.Label className="fw-semibold me-2">Sort by:</Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="border-0 bg-light"
                  style={{ minWidth: "180px" }}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Price Range Filter */}
              <Form.Group controlId="priceRangeSelect" className="mb-0">
                <Form.Label className="fw-semibold me-2">Price:</Form.Label>
                <Form.Select
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  className="border-0 bg-light"
                  style={{ minWidth: "180px" }}
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Clear Filters */}
              <Button
                variant="outline-secondary"
                onClick={clearFilters}
                className="border-0"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h4 className="text-muted mb-3">No products found</h4>
            <p className="text-muted mb-3">
              Try adjusting your filters or search terms
            </p>
            <Button variant="primary" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row className="g-4">
            {products.map((product) => (
              <Col key={product._id} xl={3} lg={4} md={6} sm={6}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={handleQuickView}
                />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-5">
              <Button
                variant="outline-primary"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded-circle me-3"
                style={{ width: "45px", height: "45px" }}
              >
                ←
              </Button>

              <span className="mx-4 fw-semibold">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>

              <Button
                variant="outline-primary"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-circle ms-3"
                style={{ width: "45px", height: "45px" }}
              >
                →
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductList;
