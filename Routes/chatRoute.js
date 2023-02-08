import express from "express";
import { createChat, findChat, userChats } from "../Controller/chatControllers.js";
import authMiddlware from "../Middlewares/authMiddlware.js";

const router = express.Router();

router.post("/create/:id",authMiddlware, createChat);
router.get("/:userId",authMiddlware,  userChats);
router.get("/find/:firstId/:secondId",authMiddlware, findChat);

export default router;
