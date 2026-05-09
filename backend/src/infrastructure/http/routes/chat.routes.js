import { Router } from 'express';
import { ChatController } from '../controllers/ChatController.js';

const router = Router();
const chatController = new ChatController();

// POST /api/chat — gửi tin nhắn, nhận phản hồi AI
router.post('/', (req, res, next) => chatController.chat(req, res, next));

export default router;
