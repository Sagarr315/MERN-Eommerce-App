import "../css/Login.css";
import {Link} from "react-router-dom"
import { FcGoogle } from "react-icons/fc";
import { BiSolidShoppingBags } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import axiosInstance from "../api/axiosInstance";

const Register = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const data = {
  name: String(formData.get("username") || ""),
  phone: String(formData.get("phone") || ""),
  email: String(formData.get("email") || ""),
  password: String(formData.get("password") || ""),
  confirmPassword: String(formData.get("confirm-password") || ""),
};

  if (data.password.trim() !== data.confirmPassword.trim()) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await axiosInstance.post("/auth/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response.data);
    alert("Account created successfully!");
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    alert("Failed to create account. Please try again.");
  }
};

  return (
    <section className="login-section min-vh-100 d-flex align-items-center">
      <div className="d-flex w-100 min-vh-100 flex-column flex-md-row p-5 bg-light">
        <div className="left-side d-none d-md-flex flex-column justify-content-between m-4 w-50">
          <div>
            <a
              href="/"
              className="d-inline-flex align-items-center mb-4 text-decoration-none"
            >
              <span
                className="logo-text"
                style={{
                  fontFamily: "forte",
                  fontSize: "55px",
                  color: "black",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <img
                  src="/letter-s.png"
                  height={55}
                  width={55}
                  style={{ display: "block", transform: "rotate(25deg)" }}
                  alt="Samruddhi logo"
                />
                <span
                  style={{ marginLeft: "-12px", transform: "translateY(-2px)" }}
                >
                  aGaR
                </span>
              </span>
            </a>

            <div>
              <h4 className="fw-bold mb-4">
                <BiSolidShoppingBags /> Why Choose Samruddhi
              </h4>
              <ul className="list-unstyled">
                <li className="mb-4">
                  <h5 className="fw-semibold">
                    <FaCheckCircle /> Trendy Styles, Every Season
                  </h5>
                  <p className="text-muted mb-0">
                    Stay ahead with our latest collections — curated for every
                    occasion and mood.
                  </p>
                </li>
                <li className="mb-4">
                  <h5 className="fw-semibold">
                    <FaCheckCircle /> Quality You Can Feel
                  </h5>
                  <p className="text-muted mb-0">
                    From fabric to finish, every piece is crafted with care for
                    lasting comfort.
                  </p>
                </li>
                <li>
                  <h5 className="fw-semibold">
                    <FaCheckCircle /> Affordable Luxury
                  </h5>
                  <p className="text-muted mb-0">
                    Enjoy premium fashion at prices that fit your lifestyle.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="small text-muted">
            <a href="/about" className="text-decoration-none me-3 text-dark">
              About
            </a>
            <a href="/terms" className="text-decoration-none me-3 text-dark">
              Terms & Conditions
            </a>
            <a href="/contact" className="text-decoration-none text-dark">
              Contact
            </a>
          </div>
        </div>

        <div className="right-side d-flex align-items-center justify-content-center w-100 m-0">
          <div
            className="card shadow-lg rounded-4"
            style={{ maxWidth: "420px", width: "100%" }}
          >
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create your account</h2>
                <p className="text-muted small">Join us and start shopping!</p>
              </div>

              <button
                type="button"
                className="btn btn-light w-100 border d-flex align-items-center justify-content-center gap-2 mb-4"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <FcGoogle size={20} />
                <span>Sign up with Google</span>
              </button>

              <div className="d-flex align-items-center my-4">
                <hr className="flex-grow-1" />
                <span className="px-2 text-muted small">
                  or sign up with email
                </span>
                <hr className="flex-grow-1" />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder="@johndoe"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirm-password" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    className="form-control"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="terms"
                    required
                  />
                  <label className="form-check-label" htmlFor="terms">
                    I agree to the <Link to="/terms">Terms & Conditions</Link>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Create Account
                </button>

                <p
                  className="text-center mt-4 mb-0 small text-muted"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Already have an account?{" "}
                  <a href="/login" className="text-primary fw-semibold">
                    Login here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
