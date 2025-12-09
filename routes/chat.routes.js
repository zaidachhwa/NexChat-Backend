import { Router } from "express";
import { createChat } from "../controllers/chat.controller.js";

const router = Router();

router.post("/create", createChat);

export default router;
