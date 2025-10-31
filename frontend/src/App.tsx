import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Discover from "./pages/Discover";
import Sarees from "./pages/sarees";
import Kids from "./pages/kids";
import Accessories from "./pages/Accessories";
import Footer from "./components/Footer";
import ProductDetails from "./components/ProductDetails";
import CartPage from "./pages/user/CartPage";
import WishlistPage from "./pages/user/WishlistPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import OrdersPage from "./pages/user/OrdersPage";
import AdminProductPage from "./pages/admin/AdminProductPage";
import AdminProductsList from "./pages/admin/AdminProductsList";
import AdminCategoriesList from "./pages/admin/AdminCategoriesList";
import AdminRoute from "./components/AdminRoute";
import AdminOrdersList from "./pages/admin/AdminOrdersList";
import AdminNotifications from "./pages/admin/AdminNotifications";
import UserRoute from "./components/UserRoute";

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <ProtectedRoute type="guest">
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute type="guest">
                <Register />
              </ProtectedRoute>
            }
          />

          <Route path="/discover" element={<Discover />} />
          <Route path="/sarees" element={<Sarees />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />

          {/* User-only routes */}
          <Route
            path="/user"
            element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <UserRoute>
                <CartPage />
              </UserRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <UserRoute>
                <WishlistPage />
              </UserRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <UserRoute>
                <CheckoutPage />
              </UserRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <UserRoute>
                <OrdersPage />
              </UserRoute>
            }
          />
          <Route
            path="/user"
            element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/AdminProductPage"
            element={
              <AdminRoute>
                <AdminProductPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/AdminProductPage/:id"
            element={
              <AdminRoute>
                <AdminProductPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/AdminProductsList"
            element={
              <AdminRoute>
                <AdminProductsList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/AdminCategoriesList"
            element={
              <AdminRoute>
                <AdminCategoriesList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/AdminOrdersList"
            element={
              <AdminRoute>
                <AdminOrdersList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/AdminNotifications"
            element={
              <AdminRoute>
                <AdminNotifications />
              </AdminRoute>
            }
          />
        </Routes>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
