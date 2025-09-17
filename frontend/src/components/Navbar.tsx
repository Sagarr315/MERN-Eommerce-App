import logo from "../assets/logo.png";
import "../css/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg shadow-sm">
      <div className="container">
        {/* Logo / Branding */}
        <a className="navbar-brand fw-bold" href="#">
          <img src={logo} alt="logo" height={60} />
        </a>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Home */}
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Home
              </a>
            </li>

            {/* Sarees Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="sareeDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Sarees
              </a>
              <ul className="dropdown-menu" aria-labelledby="sareeDropdown">
                <li>
                  <a className="dropdown-item" href="#">
                    Silk Sarees
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Cotton Sarees
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Banarasi Sarees
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Designer Sarees
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Wedding Sarees
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Party Wear Sarees
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    More Collections...
                  </a>
                </li>
              </ul>
            </li>

            {/* Ladies Wear Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="ladiesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Ladies
              </a>
              <ul className="dropdown-menu" aria-labelledby="ladiesDropdown">
                <li>
                  <a className="dropdown-item" href="#">
                    Kurtis
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Tops & T-Shirts
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Jeans
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Dresses
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Ethnic Wear
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Footwear
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Bags & Accessories
                  </a>
                </li>
              </ul>
            </li>

            {/* Deals */}
            <li className="nav-item">
              <a className="nav-link" href="#">
                Deals
              </a>
            </li>
          </ul>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3">
            {/* Cart */}
            <button className="btn btn-cart position-relative">
              <i className="bi bi-cart fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                0
              </span>
            </button>

            {/* Sign In / Sign Up */}
            <a href="/signin" className="btn btn-primary">
              Sign In
            </a>
            <a href="/signup" className="btn btn-primary">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
