import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import AuthRoutes from "./routes/auth.routes.js";
import ChatRoutes from "./routes/chat.routes.js";
import { checkAuth } from "./middlewares/auth.middleware.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Auth Routes
app.use("/api/v1/auth", AuthRoutes);
// Chat Routes
app.use("/api/v1/chat", checkAuth, ChatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
