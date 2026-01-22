import { Router } from "express";
import {
  deleteForEveryOne,
  deleteForMe,
  getMessage,
  sendMessage,
} from "../controllers/message.controller.js";

const router = Router();

router.post("/send/:chatId", sendMessage);
router.get("/:chatId", getMessage);
router.delete("/:messageId", deleteForMe);
router.delete("/everyone/:messageId", deleteForEveryOne);

export default router;
