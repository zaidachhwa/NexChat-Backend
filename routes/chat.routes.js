import { Router } from "express";
import {
  createChat,
  getChatByPhone,
  myChats,
} from "../controllers/chat.controller.js";

const router = Router();

router.post("/create", createChat);
router.get("/my", myChats);
router.get("/:otherUserPhone", getChatByPhone);

export default router;
