import { Router, Request, Response } from 'express';
import { RouteError } from '@src/common/utils/route-errors';
import {
  registerMessage as registerMessageService,
  getMessagesByChat,
  markMessageAsIncluded,
} from '@src/services/messageService/MainMessageService';

const messageRouter = Router();

// Tipos para as requisições
interface CreateMessageRequest {
  content: string;
  chat_uuid: string;
}

interface GetMessagesRequest {
  chat_uuid?: string;
}

/**
 * POST /api/messages
 * Body: { content: string, chat_uuid: string }
 * Registers a new message in a chat.
 */
messageRouter.post('/', (req: Request<Record<string, never>, Record<string, never>, CreateMessageRequest>, res: Response) => {
  const { content, chat_uuid } = req.body;
  
  if (!content || !chat_uuid) {
    throw new RouteError(400, 'Missing required fields: content and chat_uuid');
  }
  
  const message = registerMessageService(content, chat_uuid);
  res.status(201).json(message);
});

/**
 * GET /api/messages?chat_uuid=xxx
 * Returns all messages for a given chat.
 */
messageRouter.get('/', (req: Request<Record<string, never>, Record<string, never>, Record<string, never>, GetMessagesRequest>, res: Response) => {
  const { chat_uuid } = req.query;
  
  if (!chat_uuid || typeof chat_uuid !== 'string') {
    throw new RouteError(400, 'Missing or invalid query parameter: chat_uuid');
  }
  
  const messages = getMessagesByChat(chat_uuid);
  res.json(messages);
});

/**
 * PATCH /api/messages/:id/include
 * Marks a message as included in a prompt.
 */
messageRouter.patch('/:id/include', (req: Request<{ id: string }>, res: Response) => {
  const msgId = parseInt(req.params.id, 10);
  
  if (isNaN(msgId)) {
    throw new RouteError(400, 'Invalid message ID');
  }
  
  const updated = markMessageAsIncluded(msgId);
  
  if (!updated) {
    throw new RouteError(404, 'Message not found');
  }
  
  res.json(updated);
});

export default messageRouter;