import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Footer.css";
import { BsStars } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="footer bg-white text-dark pt-5 mt-3 border-top">
      <div className="container">
        {/* Top Section - Floating CTA & Social */}
        <div className="row align-items-center justify-content-between pb-4 border-bottom">
          {/* Left Text */}
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <h4 className="fw-bold mb-1">
              Fashion Made Simple <BsStars />
            </h4>
            <p className="text-muted small mb-0">
              Explore our collections for free — stylish looks for everyone.
            </p>
          </div>

          {/* Right Social Icons */}
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a
                href="https://instagram.com"
                className="text-dark fs-5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="https://facebook.com"
                className="text-dark fs-5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://twitter.com"
                className="text-dark fs-5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Middle Mega Grid */}
        <div className="row text-center text-md-start pt-5 pb-4 g-4">
          <div className="col-6 col-md-3">
            <h6 className="fw-bold mb-3">Shop</h6>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/new-arrival"
                  className="text-decoration-none text-muted"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/sarees" className="text-decoration-none text-muted">
                  Sarees
                </Link>
              </li>
              <li>
                <Link to="/kids" className="text-decoration-none text-muted">
                  Kids
                </Link>
              </li>
              <li>
                <Link
                  to="/accessories"
                  className="text-decoration-none text-muted"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/discover"
                  className="text-decoration-none text-muted"
                >
                  Discover All
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="fw-bold mb-3">Customer Care</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/contact" className="text-decoration-none text-muted">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-decoration-none text-muted">
                  About
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-decoration-none text-muted">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <h6 className="fw-bold mb-3">Join the Club</h6>
            <p className="text-muted small mb-2">
              Get exclusive deals, early access to sales, and fashion updates.
            </p>
            <Link
              to="/discover"
              className="btn btn-outline-secondary btn-sm rounded-pill px-3 custom-footer-btn"
            >
              Explore Now
            </Link>
          </div>
        </div>

        {/* Bottom Creative Wave Divider */}
        <div className="footer-wave position-relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              fill="#f8f9fa"
              d="M0,32L80,53.3C160,75,320,117,480,106.7C640,96,800,32,960,32C1120,32,1280,96,1360,128L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            ></path>
          </svg>
        </div>

        {/* Bottom Bar */}
        <div className="text-center py-3 small text-muted">
          © {new Date().getFullYear()} <strong>Sagar</strong> — All rights
          reserved.
          <br />
          <span className="fw-light">Designed with ❤️ by Sagar Bhor.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
