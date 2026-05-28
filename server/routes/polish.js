import { Router } from 'express';
import { getLLMProvider } from '../services/llm/index.js';
import { messageStore } from '../storage/messageStore.js';

export const polishRouter = Router();

polishRouter.post('/', async (req, res) => {
  const { text, prompt } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const originalText = text;
  const effectivePrompt = prompt?.trim() ||
    'Role: Professional technical editor for a software engineer. Refine the provided text for clarity, conciseness, and professional impact while preserving the original intent and format. No fluff, no alternatives, single output only. Rewrite the following text:';

  try {
    const provider = getLLMProvider();
    const polished = await provider.polish(originalText, effectivePrompt);
    const message = messageStore.create(originalText, polished, effectivePrompt);
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
