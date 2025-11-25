# 🛍️ E-Commerce Backend API

## ✨ Features
### 🎯 Core Functionality
- **👥 User Management** - Registration, login, JWT authentication, profile management
- **📦 Product Catalog** - Full CRUD operations, categories, featured products, search and filtering
- **🛒 Shopping Cart** - Add, update, remove items, quantity management
- **❤️ Wishlist** - Save favorite products, add/remove functionality
- **📋 Order Management** - Complete order lifecycle from creation to delivery
- **📁 File Upload** - Image and video upload with Cloudinary storage
- **⚙️ Admin Panel** - Comprehensive admin features and analytics

### 🚀 Advanced Features
- **📂 Category Management** - Hierarchical categories with activation/deactivation
- **🏠 Home Content Management** - Dynamic hero sections and advertisements
- **🔔 Notifications System** - Real-time order notifications
- **📮 Address Book** - Multiple shipping addresses with default selection
- **🔍 Product Filtering** - Search by name, category, price range, featured types
- **👑 User Roles** - Admin and customer role-based access control

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

### Development
- **Development**: ts-node-dev for hot reloading
- **Build Tool**: TypeScript Compiler

## 📁 Project Structure
```text
backend/
├── src/
│ ├── config/
│ │ ├── cloudinary.ts # Cloudinary configuration
│ │ ├── db.ts # MongoDB connection
│ │ └── multer.ts # File upload configuration
│ ├── controllers/ # All business logic
│ ├── middleware/ # Authentication & validation
│ ├── models/ # Database models
│ ├── routes/ # API routes
│ └── server.ts # Application entry point
├── package.json
├── tsconfig.json
└── .env.example

```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas or local MongoDB
- Cloudinary account
```bash
### Installation

1.Clone the repository

    git clone <your-repo-url>
    cd backend

2.Install dependencies

    npm install

3.Environment Configuration

    cp .env.example .env

4.Edit .env file:
    env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/ecommerce
    JWT_SECRET=your_jwt_secret_key_here
    CLOUDINARY_CLOUD_NAME=your_cloudinary_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

5.Run the application
                
    npm run dev # Development mode with hot reload
    npm run build  # Production build
    npm start  # Start production server


📚 API Documentation
    🔐 Authentication
        Method	    Endpoint	            Description	Access

        POST	/api/auth/register	        User registration Public
        POST	/api/auth/login	            User login	Public

    📦 Products
        Method	Endpoint	                        Description	Access

        GET	    /api/products	                    Get all products	Public
        GET	    /api/products/:id	                Get single product	Public
        GET	    /api/products/featured/products	    Featured products	Public
        POST	/api/products	                    Create product	Admin
        PATCH	/api/products/:id	                Update product	Admin
        DELETE	/api/products/:id	                Delete product	Admin

🛒 Cart
        Method	Endpoint	        Description	Access

        POST	/api/cart/add	    Add to cart	User
        GET	    /api/cart/:userId	Get user cart User
        PUT	    /api/cart/update	Update cart	User
        DELETE	/api/cart/remove	Remove from cart User

📋 Orders
        Method	Endpoint	                Description	Access
        
        POST	/api/orders	                Create order User
        GET	    /api/orders/:userId	        User orders	User
        GET	    /api/orders	                All orders	Admin
        PUT	    /api/orders/:id	            Update status	Admin

👤 User Management
        Method	    Endpoint	            Description	Access
        
        GET	    /api/users/profile	        User profile User
        PUT	    /api/users/profile	        Update profile User
        POST	/api/users/addresses	    Add address User
        PUT	    /api/users/addresses/:id	Update address User
        DELETE	/api/users/addresses/:id	Delete address User

🔐 Authentication

JWT Token Usage
        // Include in request headers
        Authorization: Bearer your_jwt_token_here


User Roles
👤 User: Manage profile, cart, orders, wishlist
👑 Admin: Full system access and analytics


6.🗄️ Database Models
            Model	Description

            User	User accounts with authentication
            Product	Product catalog with inventory
            Category	Product categorization
            Order	Order management system
            Cart	Shopping cart functionality
            Wishlist	User favorite products
            Notification	System notifications

7.🌐 Environment Variables
    Variable	             Description	       Required

    PORT	                Server port	            ✅ Yes
    MONGODB_URI	            MongoDB connection	    ✅ Yes
    JWT_SECRET	            JWT signing secret	    ✅ Yes
    CLOUDINARY_CLOUD_NAME	Cloudinary name	        ✅ Yes
    CLOUDINARY_API_KEY	    Cloudinary API key	    ✅ Yes
    CLOUDINARY_API_SECRET	Cloudinary API secret	✅ Yes

8/🛠️ Development Scripts

    npm run dev      # Start development server with hot reload
    npm run build    # Build TypeScript to JavaScript
    npm start        # Start production server
    npm test         # Run tests (if available)


9.🔧 Configuration
    Cloudinary Setup
        Create a Cloudinary account
        Get your cloud name, API key, and API secret
        Add credentials to environment variables

10.MongoDB Setup
    Use MongoDB Atlas (recommended) or local installation
    Update MONGODB_URI in your environment variables