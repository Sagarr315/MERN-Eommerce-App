import { useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import "../../css/AdminNavbar.css";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

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
              <span className="logo-text">amruddhi</span>
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
                  <ul className="list-unstyled mb-0">
                    <li>
                      <i className="bi bi-bag me-2"></i>
                      <strong>Fashion</strong>
                      <p className="mb-0 text-muted">
                        Trending designs to inspire you
                      </p>
                    </li>
                    <li>
                      <i className="bi bi-lightbulb me-2"></i>
                      <strong>Electronics</strong>
                      <p className="mb-0 text-muted">Up-and-coming designers</p>
                    </li>
                    <li>
                      <i className="bi bi-display me-2"></i>
                      <strong>Computer & Office</strong>
                      <p className="mb-0 text-muted">
                        Work designers are riffing on
                      </p>
                    </li>
                    {/* items similarly */}
                  </ul>
                </div>
              )}
            </div>

             <Link to="/discover" className="text-dark text-decoration-none fw-medium">
              Discover
            </Link>
            <Link to="/sarees" className="text-dark text-decoration-none fw-medium">
             Saree Stories
            </Link>
            <Link to="/kids" className="text-dark text-decoration-none fw-medium">
              Mini Wardrobe
            </Link>
            <Link to="/accessories" className="text-dark text-decoration-none fw-medium">
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
                <ul className="list-unstyled mb-0">
                  <li>
                    <i className="bi bi-bag me-2"></i>
                    <strong>Fashion</strong>
                    <p className="mb-0 text-muted">
                      Trending designs to inspire you
                    </p>
                  </li>
                  <li>
                    <i className="bi bi-lightbulb me-2"></i>
                    <strong>Electronics</strong>
                    <p className="mb-0 text-muted">Up-and-coming designers</p>
                  </li>
                  <li>
                    <i className="bi bi-display me-2"></i>
                    <strong>Computer & Office</strong>
                    <p className="mb-0 text-muted">
                      Work designers are riffing on
                    </p>
                  </li>
                  {/* Add remaining items similarly */}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Search / Cart / Account */}
          <div className="d-flex align-items-center gap-3">
            <FaSearch
              className="fs-5 cursor-pointer"
              onClick={() => setShowSearch(true)}
            />
            <Link to="/cart" className="text-decoration-none text-dark">
              <div className="position-relative">
                <FaShoppingCart className="fs-5" />
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
                  2
                </span>
              </div>
            </Link>
            {/* User Account Dropdown */}
            <div className="d-flex align-items-center position-relative">
              <div
                className="d-flex align-items-center cursor-pointer"
                style={{ cursor: "pointer" }}
                onClick={() => setShowAccount(!showAccount)}
              >
                <img
                  src=""
                  alt="User"
                  className="rounded-circle"
                  style={{ width: "35px", height: "35px" }}
                />
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
                    <li className="mb-2 dropdown-item">
                      <i className="bi bi-plus-lg me-2"></i> Add Products
                    </li>

                    <li className="mb-2 dropdown-item">
                      <i className="bi bi-card-checklist me-2"></i> Manage
                      Orders
                    </li>
                    <li className="mb-2 dropdown-item">
                      <i className="bi bi-bell me-2"></i> Notification
                    </li>
                    <hr />
                    <li className="mb-2 dropdown-item">
                      <i className="bi bi-person me-2"></i> Account
                    </li>
                    <li className="mb-2 dropdown-item">
                      <i className="bi bi-gear me-2"></i> Settings
                    </li>
                    <li className="mb-2 dropdown-item">
                      <i className="bi bi-shield-lock me-2"></i> Privacy
                    </li>

                    <hr />
                    <li className="mb-2 dropdown-item">
                      <i className="bi bi-book me-2"></i> Help Guide
                    </li>
                    <li className="mb-2 dropdown-item">
                      <i className="bi bi-question-circle me-2"></i> Help Center
                    </li>
                    <hr />
                    <li className="text-danger dropdown-item">
                      <i className="bi bi-box-arrow-right me-2"></i> Log Out
                    </li>
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
                <ul className="list-unstyled mb-0">
                  <li>
                    <i className="bi bi-bag me-2"></i>
                    <strong>Fashion</strong>
                    <p className="mb-0 text-muted">
                      Trending designs to inspire you
                    </p>
                  </li>
                  <li>
                    <i className="bi bi-lightbulb me-2"></i>
                    <strong>Electronics</strong>
                    <p className="mb-0 text-muted">Up-and-coming designers</p>
                  </li>
                  <li>
                    <i className="bi bi-display me-2"></i>
                    <strong>Computer & Office</strong>
                    <p className="mb-0 text-muted">
                      Work designers are riffing on
                    </p>
                  </li>
                  {/* Add remaining items similarly */}
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {showSearch && (
        <div className="mobile search-overlay ">
          <div className="search-box bg-white p-4 rounded shadow-lg">
            <div className="d-flex align-items-center mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search in all categories..."
              />
              <button className="btn btn-primary ms-2">Search</button>
              <button
                className="btn btn-light ms-2"
                onClick={() => setShowSearch(false)}
              >
                ✕
              </button>
            </div>

            <div>
              <h6>Suggested results</h6>
              <ul className="list-unstyled">
                <li>Apple iMac 2024 (All-in-One PC)</li>
                <li>Samsung Galaxy S24 Ultra (1Tb, Titanium Violet)</li>
                <li>MacBook Pro 14-inch M3 - Space Gray</li>
              </ul>
              <h6>History</h6>
              <ul className="list-unstyled">
                <li>Microsoft - Surface Laptop, 256 GB SSD</li>
                <li>Huawei - P40 Lite - Smartphone 128GB</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
