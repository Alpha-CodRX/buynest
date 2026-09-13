import express from "express";
import {
  getCategories,
  createCategory,
  getOneCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/", protect, admin, createCategory);
router.get("/", getCategories);
router.get("/:id", getOneCategory);
router.put("/:id",protect, admin,  updateCategory);
router.delete("/:id", protect, admin, deleteCategory)


export default router;
