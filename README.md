# 🛍️ E-Commerce MERN – Full Stack Online Store Platform

This repository contains both the backend API (Node.js + Express + TypeScript) and the frontend web application (React + Vite + TypeScript) for a modern full-featured e-commerce platform with authentication, product management, cart, wishlist, admin dashboard, role-based access, and order processing.
---
📂 Project Structure
```text
/E-Commerce-MERN
│── backend/      → Node.js + Express + TypeScript API
│── frontend/     → React + Vite + TypeScript Client
│── README.md     → (this file)

Each folder includes its own detailed README.

```
## 🚀 Features Overview

### 1. User Features
- Browse products by category
- Product search + advanced filtering
- Shopping cart & wishlist
- Order creation & order history
- Address management
- Authentication with JWT
- Profile management

### 2. Admin Features
- Product CRUD
- Category management
- Order management
- Homepage content management (hero, banners)
- Notifications
- Role-based access system

### 3. Additional System Features
- Cloudinary image upload
- Responsive frontend (mobile-first)
- Modern UI with Bootstrap + custom styles

---
## 🔐 Authentication
- Secure JWT-based authentication
- Role-based access (user, admin)
- Protected routes on frontend + backend

## 🛠 Tech Stack Overview
### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- Cloudinary
- Multer
- JWT Authentication
- bcryptjs
- ts-node-dev

### Frontend
- React 19 + TypeScript
- Vite 7
- React Router 7
- Axios + Interceptors
- Context API
- Bootstrap + React Bootstrap
- Custom CSS

## 🔧 Setup Instructions
### 1. Clone the Repository
    git clone https://github.com/Sagarr315/MERN-Eommerce-App.git
    cd E-Commerce-MERN

###⚙️ Backend Setup (Node.js + Express)

### Inside /backend:
    cd backend
    npm install 
    cp .env.example .env
    npm run dev


### Backend runs at:
    http://localhost:5000
    Configure .env inside /backend:

    PORT=5000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=xxxx
    CLOUDINARY_API_KEY=xxxx
    CLOUDINARY_API_SECRET=xxxx


### Backend details:
    /backend/README.md

##🎨 Frontend Setup (React + Vite)
### Inside /frontend:
    cd frontend
    npm install
    cp .env.example .env
    npm run dev

### Frontend runs at:
    http://localhost:5173
    Configure .env inside /frontend:
    VITE_API_URL=http://localhost:5000/api


### Frontend details:
    /frontend/README.md

##🧪 Testing
### Backend
    npm test

### Frontend
    npm run test
