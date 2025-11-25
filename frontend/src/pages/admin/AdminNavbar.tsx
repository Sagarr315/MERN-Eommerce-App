import { useState, useEffect } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import "../../css/AdminNavbar.css";
import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "../../components/LogoutButton";
import axiosInstance from "../../api/axiosInstance";

const AdminNavbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mainCategories, setMainCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  // Define which categories have dedicated pages
  const dedicatedPages: { [key: string]: string } = {
    saree: "/sarees",
    kids: "/kids",
    accessories: "/accessories",
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await axiosInstance.get("/notifications");
      const unread = res.data.filter((n: any) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  const fetchMainCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await axiosInstance.get("/categories");
      // Filter only main categories (parentCategory is null)
      const mainCats = res.data.filter(
        (category: any) => !category.parentCategory && category.isActive
      );
      setMainCategories(mainCats);
    } catch (err) {
      console.error("Failed to fetch categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Handle category click - navigate to appropriate page
  const handleCategoryClick = (category: any) => {
    const categoryNameLower = category.name.toLowerCase();

    // Check if category has a dedicated page
    if (dedicatedPages[categoryNameLower]) {
      navigate(dedicatedPages[categoryNameLower]);
    } else {
      // Use dynamic category page
      navigate(`/category/${category._id}`);
    }

    setShowCategories(false); // Close dropdown after click
  };

  // Search products
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await axiosInstance.get(
        `/products?search=${encodeURIComponent(query)}&limit=8`
      );
      setSearchResults(response.data.products || []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    fetchUnreadCount();
    fetchMainCategories();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white py-2 shadow-sm fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center px-3">
          {/* Left: Logo */}
          <div className="responsive-logo d-flex align-items-center">
            <Link
              to="/"
              className="navbar-brand fw-bold d-flex align-items-center"
            >
              <img src="/letter-s.png" alt="logo" className="logo-img" />
              <span className="logo-text">aGaR</span>
            </Link>
          </div>

          {/* Center: Full Menu - Visible only on large screens */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <div className="position-relative">
              <button
                className="btn btn-light border rounded-pill px-3 dropdown-toggle"
                onClick={() => setShowCategories(!showCategories)}
              >
                <i className="bi bi-clipboard me-2"></i> All categories
              </button>

              {showCategories && (
                <div
                  className="dropdown-menu-custom shadow rounded p-3 position-absolute top-100 start-0 mt-2"
                  style={{
                    width: "320px",
                    zIndex: 1050,
                    backgroundColor: "white",
                  }}
                >
                  {loadingCategories ? (
                    <div className="text-center">Loading categories...</div>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {mainCategories.map((category: any) => (
                        <li
                          key={category._id}
                          className="mb-3 cursor-pointer"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleCategoryClick(category)}
                        >
                          <strong>{category.name}</strong>
                          <p className="mb-0 text-muted">
                            Explore our {category.name} collection
                          </p>
                        </li>
                      ))}
                      {mainCategories.length === 0 && (
                        <li className="text-muted">No categories available</li>
                      )}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/discover"
              className="text-dark text-decoration-none fw-medium"
            >
              Discover
            </Link>
            <Link
              to="/sarees"
              className="text-dark text-decoration-none fw-medium"
            >
              Saree Stories
            </Link>
            <Link
              to="/kids"
              className="text-dark text-decoration-none fw-medium"
            >
              Mini Wardrobe
            </Link>
            <Link
              to="/accessories"
              className="text-dark text-decoration-none fw-medium"
            >
              Accessories Lab
            </Link>
          </div>

          {/* Center: Only Categories Button - Visible on medium screens */}
          <div className="d-none d-sm-flex d-lg-none align-items-center position-relative">
            <button
              className="btn btn-light border rounded-pill px-3 dropdown-toggle"
              onClick={() => setShowCategories(!showCategories)}
            >
              <i className="bi bi-clipboard me-2"></i> All categories
            </button>

            {showCategories && (
              <div
                className="dropdown-menu-custom shadow rounded p-3 position-absolute top-100 start-0 mt-2"
                style={{
                  width: "320px",
                  zIndex: 1050,
                  backgroundColor: "white",
                }}
              >
                {loadingCategories ? (
                  <div className="text-center">Loading categories...</div>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {mainCategories.map((category: any) => (
                      <li
                        key={category._id}
                        className="mb-3 cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleCategoryClick(category)}
                      >
                        <strong>{category.name}</strong>
                        <p className="mb-0 text-muted">
                          Explore our {category.name} collection
                        </p>
                      </li>
                    ))}
                    {mainCategories.length === 0 && (
                      <li className="text-muted">No categories available</li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Right: Search / Cart / Account */}
          <div className="d-flex align-items-center gap-3">
            <FaSearch
              className="fs-5 cursor-pointer"
              onClick={() => setShowSearch(true)}
            />

            {/* User Account Dropdown */}
            <div className="d-flex align-items-center position-relative">
              <div
                className="d-flex align-items-center cursor-pointer"
                style={{ cursor: "pointer" }}
                onClick={() => setShowAccount(!showAccount)}
              >
                <span className="ms-2 fw-medium d-none d-md-block">
                  My Account
                </span>
                <FiChevronDown className="ms-1" />
              </div>

              {showAccount && (
                <div
                  className="dropdown-menu-custom shadow rounded p-3 position-absolute top-100 end-0 mt-2"
                  style={{
                    minWidth: "170px",
                    width: "50%",
                    maxWidth: "220px",
                    zIndex: 1050,
                    backgroundColor: "white",
                  }}
                >
                  <ul className="list-unstyled mb-0">
                    <Link
                      to="/admin/AdminProductPage"
                      className="text-decoration-none text-dark"
                    >
                      <li className="mb-2 dropdown-item">
                        <i className="bi bi-plus-lg me-2"></i> Add Products
                      </li>
                    </Link>
                    <Link
                      to="/admin/AdminHomeContent"
                      className="text-decoration-none text-dark"
                    >
                      <li className="mb-2 dropdown-item">
                        <i className="bi bi-plus-lg me-2"></i> Add Home Content
                      </li>
                    </Link>
                    <hr/>
                    <Link
                      to="/admin/AdminOrdersList"
                      className="text-decoration-none text-dark"
                    >
                      <li className="mb-2 dropdown-item">
                        <i className="bi bi-card-checklist me-2"></i> Manage
                        Orders
                      </li>
                    </Link>
                    <Link
                      to="/admin/AdminNotifications"
                      className="text-decoration-none text-dark"
                    >
                      <li className="dropdown-item d-flex justify-content-between align-items-center">
                        <span>
                          <i className="bi bi-bell me-2"></i> Notification
                        </span>
                        {unreadCount > 0 && (
                          <span className="badge bg-danger">{unreadCount}</span>
                        )}
                      </li>
                    </Link>
                    <hr />
                    <Link
                      to="/admin/profile"
                      className="text-decoration-none text-dark"
                    >
                      <li className="mb-2 dropdown-item">
                        <i className="bi bi-person me-2"></i> Account
                      </li>
                    </Link>

                    <hr />

                    <LogoutButton />
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Categories Row - Show only on small screens */}
        <div className="d-sm-none container-fluid px-3 mt-2">
          <div className="w-100 position-relative">
            <button
              className="btn btn-light border rounded-pill px-3 dropdown-toggle w-100 text-center"
              onClick={() => setShowCategories(!showCategories)}
            >
              <i className="bi bi-clipboard me-2"></i> All categories
            </button>

            {showCategories && (
              <div
                className="dropdown-menu-custom shadow rounded p-3 position-absolute top-100 start-0 end-0 mt-1"
                style={{
                  width: "290px",
                  zIndex: 1050,
                  backgroundColor: "white",
                }}
              >
                {loadingCategories ? (
                  <div className="text-center">Loading categories...</div>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {mainCategories.map((category: any) => (
                      <li
                        key={category._id}
                        className="mb-3 cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleCategoryClick(category)}
                      >
                        <strong>{category.name}</strong>
                        <p className="mb-0 text-muted">
                          Explore our {category.name} collection
                        </p>
                      </li>
                    ))}
                    {mainCategories.length === 0 && (
                      <li className="text-muted">No categories available</li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {showSearch && (
        <div className="search-overlay active">
          <div className="search-container">
            <div className="search-header">
              <div className="search-input-group">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products and categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchLoading && <FaSpinner className="search-spinner" />}
                <button
                  className="search-close"
                  onClick={() => setShowSearch(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="search-results">
              {searchQuery && (
                <>
                  {searchLoading ? (
                    <div className="search-loading">
                      <FaSpinner className="spinner" />
                      <span>Searching...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className="search-results-header">
                        <h6>Search Results ({searchResults.length})</h6>
                      </div>
                      <div className="search-results-list">
                        {searchResults.map((product) => (
                          <div
                            key={product._id}
                            className="search-result-item"
                            onClick={() => handleProductClick(product._id)}
                          >
                            <img
                              src={
                                product.images?.[0] || "/images/placeholder.jpg"
                              }
                              alt={product.title}
                              className="search-result-image"
                            />
                            <div className="search-result-info">
                              <div className="search-result-title">
                                {product.title}
                              </div>
                              <div className="search-result-price">
                                ₹{product.price?.toLocaleString()}
                              </div>
                              <div className="search-result-category">
                                {product.category?.name}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="search-no-results">
                      No products found for "{searchQuery}"
                    </div>
                  )}
                </>
              )}

              {!searchQuery && (
                <div className="search-suggestions">
                  <h6>Popular Searches</h6>
                  <div className="suggestion-tags">
                    <span
                      className="suggestion-tag"
                      onClick={() => setSearchQuery("saree")}
                    >
                      Saree
                    </span>
                    <span
                      className="suggestion-tag"
                      onClick={() => setSearchQuery("kids")}
                    >
                      Kids Wear
                    </span>
                    <span
                      className="suggestion-tag"
                      onClick={() => setSearchQuery("accessories")}
                    >
                      Accessories
                    </span>
                    <span
                      className="suggestion-tag"
                      onClick={() => setSearchQuery("dress")}
                    >
                      Dress
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
