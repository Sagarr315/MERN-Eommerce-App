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
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage'; 
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/discover" element={<Discover />} />
          <Route path="/sarees" element={<Sarees />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/accessories" element={<Accessories />} />
          // Add this route
          <Route path="/products/:id" element={<ProductDetails />} />
         <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            // Add this route
<Route path="/checkout" element={<CheckoutPage />} />

<Route path="/orders" element={<OrdersPage />} />

        </Routes>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
