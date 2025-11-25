# 🛍️  E-Commerce Frontend

## ✨ Features
### 🎯 Core Functionality
- **👥 User Authentication** - Login, registration with JWT token management
- **📦 Product Catalog** - Browse products by categories, search and filter
- **🛒 Shopping Cart** - Add/remove items, quantity management, checkout
- **❤️ Wishlist** - Save favorite products, quick add to cart
- **📋 Order Management** - Track orders, view order history and status
- **👑 Role-Based Access** - Separate interfaces for Admin and Customers

### 🚀 Advanced Features
- **📂 Category Navigation** - Hierarchical categories with dedicated pages
- **🏠 Dynamic Homepage** - Hero banners, advertisements, featured products
- **🔍 Advanced Search** - Real-time search with suggestions and filters
- **📱 Responsive Design** - Mobile-first design with Bootstrap
- **🎨 Modern UI/UX** - Clean interface with smooth animations
- **🔄 State Management** - Context API for global state

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.1.1 with TypeScript 5.9
- **Routing**: React Router DOM 7.9
- **UI Library**: Bootstrap 5.3.8 + React Bootstrap 2.10 + Custom CSS
- **HTTP Client**: Axios 1.12
- **Icons**: React Icons 5.5 + Bootstrap Icons 1.13
- **State Management**: React Context API

### Development
- **Build Tool**: Vite 7.1
- **Language**: TypeScript 5.9
- **Styling**: CSS Modules + Bootstrap
- **Linting**: ESLint 9.33

## 📁 Project Structure
```text
src/
├── components/
│   ├── admin/          # Admin-specific components
│   ├── user/           # User-specific components  
│   ├── Cart.tsx        # Shopping cart component
│   ├── ProductLayout.tsx # Product card component
│   ├── Navbar.tsx      # Navigation component
│   └── Footer.tsx      # Footer component
├── pages/
│   ├── admin/          # Admin pages
│   ├── user/           # User pages
│   ├── Home.tsx        # Homepage
│   ├── Discover.tsx    # Product discovery
│   ├── Login.tsx       # Authentication
│   └── Register.tsx    # User registration
├── context/
│   └── AuthContext.tsx # Authentication context
├── types/
│   ├── Product.ts      # Product interfaces
│   ├── Cart.ts         # Cart interfaces
│   └── User.ts         # User interfaces
├── api/
│   └── axiosInstance.ts # API configuration
├── css/
│   ├── components/     # Component-specific styles
│   └── pages/          # Page-specific styles
└── App.tsx             # Main application component

🚀 Quick Start
Prerequisites
  Node.js (v16 or higher)
  Backend API running

1.Installation

2.Clone the repository
    git clone <your-repo-url>
    cd frontend

3.Install dependencies
    npm install

4.Environment Configuration
    cp .env.example .env

5.Edit .env file:
    env
    VITE_API_URL=http://localhost:5000/api
    
6.Run the application
    npm run dev          # Development server
    npm run build        # Production build
    npm run preview      # Preview production build

🎯 Component Overview
🔐 Authentication Components
    Login - User authentication with email/phone
    Register - New user registration
    ProtectedRoute - Route protection for authenticated users
    AdminRoute - Admin-only route protection
    UserRoute - Customer-only route protection

📦 Product Components
    ProductList - Grid/list view of products with filtering
    ProductLayout - Individual product card with actions
    ProductDetails - Detailed product view
    ProductCard - Reusable product display component

🛒 Cart & Checkout
    Cart - Shopping cart management
    CheckoutPage - Order placement with address management
    WishlistComponent - Favorite products management

👑 Admin Components
    AdminProductPage - Product creation/editing
    AdminProductsList - Product management
    AdminCategoriesList - Category management
    AdminOrdersList - Order management
    AdminHomeContent - Homepage content management
    AdminNotifications - Notification system

👤 User Components
    UserNavbar - Customer navigation
    Profile - User profile and address management
    OrdersPage - Order history and tracking

🎨 Pages & Routing
Public Routes
    / - Homepage with featured products
    /discover - Product discovery
    /login - User authentication
    /register - User registration
    /products/:id - Product details
    /category/:id - Category products

User-Only Routes
    /cart - Shopping cart
    /wishlist - Favorite products
    /checkout - Order placement
    /orders - Order history
    /profile - User profile

Admin-Only Routes
    /admin/AdminProductPage - Product management
    /admin/AdminProductsList - Products list
    /admin/AdminCategoriesList - Category management
    /admin/AdminOrdersList - Order management
    /admin/AdminHomeContent - Home content
    /admin/AdminNotifications - Notifications

🔧 Configuration
API Integration
The frontend communicates with the backend via Axios instances configured in axiosInstance.ts:

      const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: { "Content-Type": "application/json" },
      });

1.Authentication Flow
    User logs in/registers
    JWT token stored in localStorage
    Token automatically included in API requests
    Protected routes validate authentication
    Role-based access control for admin/user features

2.State Management
    AuthContext - Manages user authentication state
    Local Storage - Persists user session
    Component State - Local UI state management

🎨 Styling & UI
    Design System
        Bootstrap 5 - Core UI framework
        Custom CSS - Component-specific styles
        CSS Modules - Scoped styling
        Responsive Design - Mobile-first approach

Key Styling Features
    Gradient buttons and modern card designs
    Smooth animations and transitions
    Consistent color scheme and typography
    Mobile-optimized navigation