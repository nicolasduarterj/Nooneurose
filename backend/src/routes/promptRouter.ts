import { Router, Request, Response } from 'express';
import { RouteError } from '@src/common/utils/route-errors';
import {
  registerPrompt,
  getLatestPrompt,
  generatePromptFromUnusedMessages,
} from '@src/services/promptService/MainPromptService';

const promptRouter = Router();

// Tipos para as requisições
interface CreatePromptRequest {
  prompt: string;
  parent_id?: number | null;
}

interface GeneratePromptRequest {
  chat_uuid?: string;
}

/**
 * POST /api/prompts
 * Body: { prompt: string, parent_id?: number }
 * Registers a new prompt manually.
 */
promptRouter.post('/', (req: Request<Record<string, never>, Record<string, never>, CreatePromptRequest>, res: Response) => {
  const { prompt, parent_id = null } = req.body;
  
  if (!prompt) {
    throw new RouteError(400, 'Missing required field: prompt');
  }
  
  const newPrompt = registerPrompt(prompt, parent_id);
  res.status(201).json(newPrompt);
});

/**
 * GET /api/prompts/latest
 * Returns the most recently created prompt.
 */
promptRouter.get('/latest', (_req: Request, res: Response) => {
  const latest = getLatestPrompt();
  
  if (!latest) {
    throw new RouteError(404, 'No prompts found');
  }
  
  res.json(latest);
});

/**
 * POST /api/prompts/generate?chat_uuid=xxx
 * Generates a new prompt from unused messages of a chat.
 */
promptRouter.post('/generate', (req: Request<Record<string, never>, Record<string, never>, Record<string, never>, GeneratePromptRequest>, res: Response) => {
  const { chat_uuid } = req.query;
  
  if (!chat_uuid || typeof chat_uuid !== 'string') {
    throw new RouteError(400, 'Missing or invalid query parameter: chat_uuid');
  }
  
  const generated = generatePromptFromUnusedMessages(chat_uuid);
  
  if (!generated) {
    throw new RouteError(404, 'No unused messages found for this chat');
  }
  
  res.status(201).json(generated);
});

export default promptRouter;