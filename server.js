import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import AuthRoutes from "./routes/auth.routes.js";
import ChatRoutes from "./routes/chat.routes.js";
import MessageRoutes from "./routes/message.route.js";
import { checkAuth } from "./middlewares/auth.middleware.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const app = express();

// Create a server
const httpServer = createServer(app);

// Pass the server to create a socket connection
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

// Create a middleware to pass down the io to the controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Creating Connection
io.on("connection", (socket) => {
  console.log(`Client connected on socket ID : ${socket.id}`);

  // Socket for joining rooms
  socket.on("join_room", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat : ${chatId}`);
  });

  // socket for typing
  socket.on("typing", (chatId) => {
    socket.to(chatId).emit("typing");
  });

  // socket for stop typing
  socket.on("stop_typing", (chatId) => {
    socket.to(chatId).emit("stop_typing");
  });

  // Socket for disconnecting user
  socket.on("disconnect", () => {
    console.log(`User disconnected`);
  });
});

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Auth Routes
app.use("/api/v1/auth", AuthRoutes);
// Chat Routes
app.use("/api/v1/chat", checkAuth, ChatRoutes);
// Message Routes
app.use("/api/v1/message", checkAuth, MessageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
