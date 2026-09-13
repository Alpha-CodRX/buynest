import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// ==========================================
// CLOUDINARY UPLOAD
// ==========================================
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream =
            cloudinary.uploader.upload_stream(
                {
                    folder: "nextcart/products",
                },
                (error, result) => {
                    if (error) {
                        console.log(
                            "CLOUDINARY ERROR:",
                            error
                        );

                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

        uploadStream.end(fileBuffer);
    });
};


// ==========================================
// CREATE PRODUCT
// ==========================================
export const createProduct = async (req, res) => {
    try {
        const {
            title,
            slug,
            description,
            brand,
            price,
            originalPrice,
            discount,
            category,
            rating,
            reviews,
            stock,
            inStock,
            specifications,
            options,
        } = req.body;

        // ------------------------------------------
        // Validate title
        // ------------------------------------------

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Product title is required",
            });
        }

        const productTitle = title.trim();

        // ------------------------------------------
        // Generate slug
        // ------------------------------------------

        const productSlug =
            slug && slug.trim()
                ? slug.trim().toLowerCase()
                : productTitle
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^\w-]+/g, "")
                      .replace(/--+/g, "-");

        // ------------------------------------------
        // Check duplicate slug
        // ------------------------------------------

        const existingProduct =
            await Product.findOne({
                slug: productSlug,
            });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message:
                    "Product with this slug already exists",
            });
        }

        // ------------------------------------------
        // Upload images
        // ------------------------------------------

        const imageUrls = [];

        if (
            req.files &&
            req.files.length > 0
        ) {
            for (const file of req.files) {
                const result =
                    await uploadToCloudinary(
                        file.buffer
                    );

                imageUrls.push(
                    result.secure_url
                );
            }
        }

        // ------------------------------------------
        // Parse options if required
        // ------------------------------------------

        let parsedOptions = options;

        if (typeof options === "string") {
            try {
                parsedOptions =
                    JSON.parse(options);
            } catch {
                parsedOptions = [];
            }
        }

        // ------------------------------------------
        // Parse specifications if required
        // ------------------------------------------

        let parsedSpecifications =
            specifications;

        if (
            typeof specifications ===
            "string"
        ) {
            try {
                parsedSpecifications =
                    JSON.parse(
                        specifications
                    );
            } catch {
                parsedSpecifications =
                    specifications;
            }
        }

        // ------------------------------------------
        // Create product
        // ------------------------------------------

        const product =
            await Product.create({
                title: productTitle,
                slug: productSlug,
                description,
                brand,
                price,
                originalPrice,
                discount,
                category,
                rating,
                reviews,
                stock,
                inStock,
                specifications,
                options:
                    parsedOptions || [],
                image: imageUrls,
            });

        return res.status(201).json({
            success: true,
            message:
                "Product created successfully",
            product,
        });
    } catch (error) {
        console.error(
            "Create Product Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// GET ALL PRODUCTS
// ==========================================
export const getProducts = async (
    req,
    res
) => {
    try {
        const products =
            await Product.find()
                .populate("category")
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error(
            "Get Products Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// GET ONE PRODUCT
// ==========================================
export const getProductById = async (
    req,
    res
) => {
    try {
        const product =
            await Product.findById(
                req.params.id
            ).populate("category");

        if (!product) {
            return res.status(404).json({
                success: false,
                message:
                    "Product Not Found",
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error(
            "Get Product Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// UPDATE PRODUCT
// ==========================================
export const updateProduct = async (
    req,
    res
) => {
    try {
        const {
            title,
            slug,
            description,
            brand,
            price,
            originalPrice,
            discount,
            category,
            rating,
            reviews,
            stock,
            inStock,
            specifications,
            options,
            existingImages,
        } = req.body;

        // ------------------------------------------
        // Find product
        // ------------------------------------------

        const existingProduct =
            await Product.findById(
                req.params.id
            );

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message:
                    "Product Not Found",
            });
        }

        // ------------------------------------------
        // Title
        // ------------------------------------------

        const productTitle =
            title !== undefined
                ? title.trim()
                : existingProduct.title;

        if (!productTitle) {
            return res.status(400).json({
                success: false,
                message:
                    "Product title is required",
            });
        }

        // ------------------------------------------
        // Slug
        // ------------------------------------------

        const productSlug =
            slug && slug.trim()
                ? slug.trim().toLowerCase()
                : productTitle
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^\w-]+/g, "")
                      .replace(/--+/g, "-");

        // ------------------------------------------
        // Duplicate slug
        // ------------------------------------------

        const duplicateProduct =
            await Product.findOne({
                slug: productSlug,
                _id: {
                    $ne: req.params.id,
                },
            });

        if (duplicateProduct) {
            return res.status(400).json({
                success: false,
                message:
                    "Product with this slug already exists",
            });
        }

        // ==========================================
        // HANDLE EXISTING IMAGES
        // ==========================================

        let imageUrls =
            existingProduct.image || [];

        if (
            existingImages !== undefined
        ) {
            try {
                imageUrls =
                    typeof existingImages ===
                    "string"
                        ? JSON.parse(
                              existingImages
                          )
                        : existingImages;

                if (
                    !Array.isArray(
                        imageUrls
                    )
                ) {
                    imageUrls = [];
                }
            } catch (error) {
                console.error(
                    "Existing Images Parse Error:",
                    error
                );

                imageUrls =
                    existingProduct.image ||
                    [];
            }
        }

        // ==========================================
        // UPLOAD NEW IMAGES
        // ==========================================

        if (
            req.files &&
            req.files.length > 0
        ) {
            const newImages = [];

            for (const file of req.files) {
                const result =
                    await uploadToCloudinary(
                        file.buffer
                    );

                newImages.push(
                    result.secure_url
                );
            }

            imageUrls = [
                ...imageUrls,
                ...newImages,
            ];
        }

        // ==========================================
        // PARSE OPTIONS
        // ==========================================

        let parsedOptions =
            existingProduct.options || [];

        if (options !== undefined) {
            try {
                parsedOptions =
                    typeof options ===
                    "string"
                        ? JSON.parse(options)
                        : options;

                if (
                    !Array.isArray(
                        parsedOptions
                    )
                ) {
                    parsedOptions = [];
                }
            } catch (error) {
                console.error(
                    "Options Parse Error:",
                    error
                );

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid product options",
                });
            }
        }

        // ==========================================
        // PARSE SPECIFICATIONS
        // ==========================================

        let parsedSpecifications =
            existingProduct.specifications;

        if (
            specifications !== undefined
        ) {
            try {
                parsedSpecifications =
                    typeof specifications ===
                    "string"
                        ? JSON.parse(
                              specifications
                          )
                        : specifications;
            } catch {
                parsedSpecifications =
                    specifications;
            }
        }

        // ==========================================
        // UPDATE PRODUCT
        // ==========================================

        existingProduct.title =
            productTitle;

        existingProduct.slug =
            productSlug;

        if (
            description !== undefined
        ) {
            existingProduct.description =
                description;
        }

        if (brand !== undefined) {
            existingProduct.brand =
                brand;
        }

        if (price !== undefined) {
            existingProduct.price =
                price;
        }

        if (
            originalPrice !==
            undefined
        ) {
            existingProduct.originalPrice =
                originalPrice;
        }

        if (discount !== undefined) {
            existingProduct.discount =
                discount;
        }

        if (category !== undefined) {
            existingProduct.category =
                category;
        }

        if (rating !== undefined) {
            existingProduct.rating =
                rating;
        }

        if (reviews !== undefined) {
            existingProduct.reviews =
                reviews;
        }

        if (stock !== undefined) {
            existingProduct.stock =
                stock;
        }

        if (inStock !== undefined) {
            existingProduct.inStock =
                inStock;
        }

        if (
            specifications !==
            undefined
        ) {
            existingProduct.specifications =
                parsedSpecifications;
        }

        if (options !== undefined) {
            existingProduct.options =
                parsedOptions;
        }

        // ------------------------------------------
        // Save images
        // ------------------------------------------

        existingProduct.image =
            imageUrls;

        await existingProduct.save();

        return res.status(200).json({
            success: true,
            message:
                "Product Updated Successfully",
            product: existingProduct,
        });
    } catch (error) {
        console.error(
            "Update Product Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// DELETE PRODUCT
// ==========================================
export const deleteProduct = async (
    req,
    res
) => {
    try {
        const product =
            await Product.findById(
                req.params.id
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message:
                    "Product Not Found",
            });
        }

        await Product.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Product Deleted Successfully",
        });
    } catch (error) {
        console.error(
            "Delete Product Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};