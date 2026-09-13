 
import Category from "../models/Category.js";


// ==========================================
// CREATE CATEGORY
// ==========================================
export const createCategory = async (req, res) => {
  try {
    const { name, slug, image } = req.body;

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const categoryName = name.trim();

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: categoryName,
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Generate slug if frontend doesn't send one
    const categorySlug =
      slug && slug.trim()
        ? slug.trim().toLowerCase()
        : categoryName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-");

    // Check slug
    const existingSlug = await Category.findOne({
      slug: categorySlug,
    });

    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: "Category slug already exists",
      });
    }

    // Create category
    const category = await Category.create({
      name: categoryName,
      slug: categorySlug,
      image: image || "",
    });

    // Response
    return res.status(201).json({
      success: true,
      message: "Category Created Successfully",
      category,
    });

  } catch (error) {
    console.error("Create Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL CATEGORIES
// ==========================================
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      categories,
    });

  } catch (error) {
    console.error("Get Categories Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ONE CATEGORY
// ==========================================
export const getOneCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });

  } catch (error) {
    console.error("Get One Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE CATEGORY
// ==========================================
export const updateCategory = async (req, res) => {
  try {
    const { name, slug, image } = req.body;

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const categoryName = name.trim();

    // Check duplicate name
    const existingCategory = await Category.findOne({
      name: categoryName,
      _id: { $ne: req.params.id },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Generate slug if not provided
    const categorySlug =
      slug && slug.trim()
        ? slug.trim().toLowerCase()
        : categoryName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-");

    // Check duplicate slug
    const existingSlug = await Category.findOne({
      slug: categorySlug,
      _id: { $ne: req.params.id },
    });

    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: "Category slug already exists",
      });
    }

    // Update
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: categoryName,
        slug: categorySlug,
        image: image || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Check category
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category Updated Successfully",
      category,
    });

  } catch (error) {
    console.error("Update Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// DELETE CATEGORY
// ==========================================
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category Deleted Successfully",
    });

  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 