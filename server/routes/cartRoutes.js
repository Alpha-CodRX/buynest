import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToCart);

router.get("/", protect, getCart);

router.put("/:itemId", protect, updateCartItem);

router.delete("/:itemId", protect, removeCartItem);

router.delete("/", protect, clearCart);

export default router;
