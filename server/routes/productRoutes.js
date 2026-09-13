 
import express from "express";

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";

import upload from "../middlewares/upload.js";

import {
    admin,
    protect,
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// ==========================================
// GET ALL PRODUCTS
// ==========================================
router.get(
    "/",
    getProducts
);


// ==========================================
// GET ONE PRODUCT
// ==========================================
router.get(
    "/:id",
    getProductById
);


// ==========================================
// CREATE PRODUCT
// ==========================================
router.post(
    "/",
    protect,
    admin,
    upload.array("images", 5),
    createProduct
);


// ==========================================
// UPDATE PRODUCT
// ==========================================
router.put(
    "/:id",
    protect,
    admin,
    upload.array("images", 5),
    updateProduct
);


// ==========================================
// DELETE PRODUCT
// ==========================================
router.delete(
    "/:id",
    protect,
    admin,
    deleteProduct
);


export default router; 