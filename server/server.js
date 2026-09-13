import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


import logger from "./middlewares/logger.js";
import connectDB from "./config/db.js";



dotenv.config();

connectDB();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);

// Cart Route
app.use("/api/v1/cart", cartRoutes)

app.use("/api/v1/orders", orderRoutes);

app.use("/api/v1/admin", adminRoutes);

// Logger
app.use(logger);


// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NextCart API is running successfully!",
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});