import { Router } from 'express';
import { messageStore } from '../storage/messageStore.js';

export const messagesRouter = Router();

messagesRouter.get('/', (req, res) => {
  res.json(messageStore.getAll());
});

messagesRouter.get('/:id', (req, res) => {
  const message = messageStore.getById(req.params.id);
  if (!message) return res.status(404).json({ error: 'Not found' });
  res.json(message);
});

messagesRouter.delete('/:id', (req, res) => {
  const deleted = messageStore.delete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});
