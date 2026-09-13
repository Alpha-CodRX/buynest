import express from "express";

import {
    getDashboardStats,
    getRecentOrders,
    getSalesOverview,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAdminProducts,
    updateProductStatus,
    getAdminOrders,
    updateOrderStatus,
    getAdminOrderById,
    getAdminCategories,
    getOrderStatusSummary
} from "../controllers/adminController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";

import {
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController.js";

const router = express.Router();


// Dashboard
router.get("/dashboard", protect, admin, getDashboardStats);


// Orders
router.get("/orders/recent", protect, admin, getRecentOrders);

router.get("/orders", protect, admin, getAdminOrders);

router.get("/orders/:id", protect, admin, getAdminOrderById);

router.patch(
    "/orders/:id/status",
    protect,
    admin,
    updateOrderStatus
);


// Sales
router.get("/sales", protect, admin, getSalesOverview);


// Users
router.get("/users", protect, admin, getAllUsers);

router.patch(
    "/users/:id",
    protect,
    admin,
    updateUserRole
);

router.delete(
    "/users/:id",
    protect,
    admin,
    deleteUser
);


// Products
router.get("/products", protect, admin, getAdminProducts);

router.patch(
    "/products/:id/status",
    protect,
    admin,
    updateProductStatus
);


// Categories
router.get(
    "/categories",
    protect,
    admin,
    getAdminCategories
);

router.get(
    "/orders/status-summary",
    protect,
    admin,
    getOrderStatusSummary
);



router.post(
    "/categories",
    protect,
    admin,
    createCategory
);

router.put(
    "/categories/:id",
    protect,
    admin,
    updateCategory
);

router.delete(
    "/categories/:id",
    protect,
    admin,
    deleteCategory
);


export default router;