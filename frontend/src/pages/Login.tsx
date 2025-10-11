import "../css/Login.css";
import { FcGoogle } from "react-icons/fc";
import { BiSolidShoppingBags } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const identifier = String(formData.get("emailOrPhone") || "");
    const password = String(formData.get("password") || "");

    // Build payload dynamically
    let data: Record<string, string> = { password };
    if (identifier.includes("@")) {
      data.email = identifier;
    } else {
      data.phone = identifier;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/login", data);
      const result = response.data;

      console.log("Login Response:", result);

      if (result.token && result.user) {
        // Save using AuthContext
        login(result.token, result.user);

        // Redirect based on role
        if (result.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        alert("Invalid login details!");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section min-vh-100 d-flex align-items-center">
      <div className="d-flex w-100 min-vh-100 flex-column flex-md-row p-5 bg-light">
        {/* LEFT SIDE */}
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
                <span style={{ marginLeft: "-12px", transform: "translateY(-2px)" }}>
                  amruddhi
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
                    Stay ahead with our latest collections — curated for every occasion and mood.
                  </p>
                </li>
                <li className="mb-4">
                  <h5 className="fw-semibold">
                    <FaCheckCircle /> Quality You Can Feel
                  </h5>
                  <p className="text-muted mb-0">
                    From fabric to finish, every piece is crafted with care for lasting comfort.
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

        {/* RIGHT SIDE LOGIN CARD */}
        <div className="right-side d-flex align-items-center justify-content-center w-100 m-0">
          <div className="card shadow-lg rounded-4" style={{ maxWidth: "420px", width: "100%" }}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome back</h2>
                <p className="text-muted small">Log in to your account</p>
              </div>

              {/* Google Login */}
              <button
                type="button"
                className="btn btn-light w-100 border d-flex align-items-center justify-content-center gap-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <FcGoogle size={20} />
                <span>Continue with Google</span>
              </button>

              <div className="d-flex align-items-center my-4">
                <hr className="flex-grow-1" />
                <span className="px-2 text-muted small">
                  or continue with email / phone
                </span>
                <hr className="flex-grow-1" />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="emailOrPhone" className="form-label">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    id="emailOrPhone"
                    name="emailOrPhone"
                    className="form-control"
                    placeholder="Enter your email or phone"
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

                <div className="d-flex justify-content-end mb-4">
                  <a
                    href="/forgot"
                    className="small text-primary text-decoration-none"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                <p
                  className="text-center mt-4 mb-0 small text-muted"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Don’t have an account yet?{" "}
                  <a href="/register" className="text-primary fw-semibold">
                    Sign up
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

export default Login;
