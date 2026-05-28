import express from 'express';
import cors from 'cors';
import { messagesRouter } from './routes/messages.js';
import { polishRouter } from './routes/polish.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/messages', messagesRouter);
app.use('/api/polish', polishRouter);

app.listen(PORT, () => {
  console.log(`Glint server running on http://localhost:${PORT}`);
});
