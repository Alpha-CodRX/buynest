import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";


// ===============================
// 1. Dashboard Statistics
// ===============================
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const totalProducts = await Product.countDocuments();

        const totalCategories = await Category.countDocuments();

        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate([
            {
                $match: {
                    status: { $ne: "cancelled" }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalCategories,
                totalOrders,
                totalRevenue
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
};


// ===============================
// 2. Recent Orders
// ===============================
export const getRecentOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error("Recent orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch recent orders",
            error: error.message
        });
    }
};


// ===============================
// 3. Sales Overview
// ===============================
export const getSalesOverview = async (req, res) => {
    try {
        const sales = await Order.aggregate([
            {
                $match: {
                    status: { $ne: "cancelled" }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    totalSales: {
                        $sum: "$totalAmount"
                    },
                    totalOrders: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            sales
        });

    } catch (error) {
        console.error("Sales overview error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch sales overview",
            error: error.message
        });
    }
};


// ===============================
// 4. Get All Users
// ===============================
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get all users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};


// ===============================
// 5. Update User Role
// ===============================
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.role = role;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Update user role error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update user role",
            error: error.message
        });
    }
};


// ===============================
// 6. Delete User
// ===============================
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete user error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message
        });
    }
};


// ===============================
// 7. Get Admin Products
// ===============================
export const getAdminProducts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const products = await Product.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            success: true,
            page,
            limit,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            products
        });

    } catch (error) {
        console.error("Admin products error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
};


// ===============================
// 8. Update Product Status
// ===============================
export const updateProductStatus = async (req, res) => {
    try {
        const { inStock } = req.body;

        if (typeof inStock !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "inStock must be true or false"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.inStock = inStock;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product status updated successfully",
            product
        });

    } catch (error) {
        console.error("Update product status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update product status",
            error: error.message
        });
    }
};


// ===============================
// 9. Get Admin Orders
// ===============================
export const getAdminOrders = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments();

        res.status(200).json({
            success: true,
            page,
            limit,
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
            orders
        });

    } catch (error) {
        console.error("Admin orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};


// ===============================
// 10. Update Order Status
// ===============================
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = status;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.error("Update order status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message
        });
    }
};


// ===============================
// 11. Get Admin Order By ID
// ===============================
export const getAdminOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error("Get admin order error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message
        });
    }
};


// ===============================
// 12. Get Admin Categories
// ===============================
export const getAdminCategories = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const categories = await Category.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalCategories = await Category.countDocuments();

        res.status(200).json({
            success: true,
            page,
            limit,
            totalCategories,
            totalPages: Math.ceil(totalCategories / limit),
            categories
        });

    } catch (error) {
        console.error("Admin categories error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message
        });
    }
};





export const getOrderStatusSummary = async (req, res) => {
    try {
        const summary = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            summary
        });

    } catch (error) {
        console.error("Order status summary error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order status summary",
            error: error.message
        });
    }
};