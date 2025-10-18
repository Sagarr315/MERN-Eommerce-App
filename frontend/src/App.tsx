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
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
