import express from 'express'
import { addMessage, getMessage } from '../Controller/messageController.js';
import authMiddlware from "../Middlewares/authMiddlware.js";

const router = express.Router()

router.post('/',authMiddlware, addMessage)
router.get('/:chatId',authMiddlware, getMessage)

export default router;