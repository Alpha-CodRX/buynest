import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  protect,
  admin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
=====================================================
USER ROUTES
=====================================================
*/

// Create Order
router.post("/", protect, createOrder);

// Get My Orders
router.get("/my-orders", protect, getMyOrders);

// Cancel My Order
router.put("/:id/cancel", protect, cancelOrder);

// Get My Single Order
router.get("/:id", protect, getOrderById);


/*
=====================================================
ADMIN ROUTES
=====================================================
*/

// Get All Orders
router.get("/admin/all", protect, admin, getAllOrders);

// Update Order Status
router.put(
  "/admin/:id/status",
  protect,
  admin,
  updateOrderStatus
);

export default router;