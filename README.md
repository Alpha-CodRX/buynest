# 🛒 BuyNest

**BuyNest** is a full-stack e-commerce web application that provides a complete shopping experience for customers along with an admin dashboard for managing products, categories, orders, and the store.

---

## 🚀 Features

### 👤 User Features

* User registration and login
* JWT-based authentication
* Browse products
* Product details page
* Category-based product filtering
* Product search
* Product options/variants
* Add products to cart
* Update cart quantities
* Remove products from cart
* Persistent cart using backend API
* Checkout
* Shipping address
* Cash on Delivery (COD)
* Order placement
* View personal orders

### 🔐 Admin Features

* Admin authentication and authorization
* Admin dashboard
* Dashboard statistics
* Product management

  * Add products
  * Edit products
  * Delete products
  * Upload product images
  * Manage product options/variants
  * Manage stock
* Category management

  * Add categories
  * Edit categories
  * Delete categories
* Order management
* Protected admin routes

### ☁️ Image Management

* Product image uploads using Multer
* Cloudinary integration
* Multiple product images
* Optimized remote image loading with Next.js

---

## 🛠️ Tech Stack

### Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Axios
* React Context API
* Sonner

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* Cloudinary

### Development Tools

* Git
* GitHub
* Postman
* VS Code

---

## 🏗️ Project Architecture

BuyNest follows a separate frontend and backend architecture.

```text
Next.js Frontend
       │
       │ Axios / REST API
       ▼
Express.js Backend
       │
       ▼
MongoDB
```

### Request Flow

```text
User
 │
 ▼
Next.js UI
 │
 ▼
Axios
 │
 ▼
Express API
 │
 ├── Authentication
 ├── Products
 ├── Categories
 ├── Cart
 ├── Orders
 └── Admin
 │
 ▼
MongoDB
```

---

## 📁 Project Structure

```text
buynest/
│
├── app/
│   ├── admin/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   ├── login/
│   └── ...
│
├── components/
│   ├── Navbar/
│   ├── Footer/
│   ├── ProductCard/
│   ├── CategoryCard/
│   └── ...
│
├── lib/
│   └── axios.ts
│
├── data/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   └── server.js
│
├── public/
│
├── .gitignore
├── next.config.ts
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Go to the Project Directory

```bash
cd buynest
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Install Backend Dependencies

```bash
cd server
npm install
```

### 5. Configure Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Important:** Never commit your `.env` file or secret credentials to GitHub.

---

## ▶️ Run the Application

### Start the Backend

From the `server` directory:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api/v1
```

### Start the Frontend

Open another terminal in the project root:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

## 🔑 Authentication

BuyNest uses JWT-based authentication.

### Authentication Flow

```text
Register
   │
   ▼
User Account
   │
   ▼
Login
   │
   ▼
JWT Token
   │
   ▼
Frontend Storage
   │
   ▼
Axios Authorization Header
   │
   ▼
Protected API
```

Admin routes are protected using role-based authorization.

```text
User
 └── Normal shopping access

Admin
 ├── Dashboard
 ├── Products
 ├── Categories
 └── Orders
```

---

## 🛍️ Main API Modules

The backend API is organized under:

```text
/api/v1
```

Main modules include:

```text
/auth
/categories
/products
/cart
/orders
/admin
```

---

## 💳 Payment

Currently, BuyNest supports:

* **Cash on Delivery (COD)**

Online payment integration can be added in the future.

---

## 🖼️ Product Images

Product images are uploaded through the backend using:

```text
Multer → Cloudinary → MongoDB
```

The database stores the Cloudinary image URLs rather than the actual image files.

---

## 🔒 Security

The project includes:

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Admin role authorization
* Environment variables for secrets
* `.gitignore` protection for environment files

---

## 📌 Current Status

### Completed

* [x] Authentication
* [x] JWT protection
* [x] Admin authorization
* [x] Category CRUD
* [x] Product CRUD
* [x] Product image upload
* [x] Cloudinary integration
* [x] Product options/variants
* [x] Cart system
* [x] Order system
* [x] COD checkout
* [x] Admin dashboard
* [x] Admin product management
* [x] Admin category management
* [x] Admin order management
* [x] Frontend product listing
* [x] Product details
* [x] Category filtering
* [x] Cart synchronization
* [x] Checkout flow

---

## 🔮 Future Improvements

* [ ] Online payments with Razorpay/Stripe
* [ ] Product reviews and ratings
* [ ] Wishlist
* [ ] Advanced product search
* [ ] Pagination
* [ ] Coupon/discount system
* [ ] Email notifications
* [ ] OTP-based authentication
* [ ] Order tracking
* [ ] Inventory alerts
* [ ] Advanced admin analytics
* [ ] User profile management

---

## 🎯 Project Goal

The goal of BuyNest is to build a **production-oriented full-stack e-commerce application** while demonstrating practical knowledge of:

* Next.js
* React
* TypeScript
* REST APIs
* Node.js
* Express.js
* MongoDB
* Mongoose
* Authentication
* Authorization
* Cloudinary
* State management
* Admin dashboards
* Full-stack application architecture

---

## 👨‍💻 Developer

**Sumit Rathore**

Full-Stack Web Developer

### Technologies

```text
Next.js • React • TypeScript • JavaScript
Node.js • Express.js • MongoDB
Tailwind CSS • Git • REST APIs
```

---

## 📄 License

This project is created for learning, portfolio, and development purposes.
