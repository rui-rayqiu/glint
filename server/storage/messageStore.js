import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { homedir } from 'os';
import { join } from 'path';

const STORE_DIR = join(homedir(), '.glint');
const STORE_PATH = join(STORE_DIR, 'messages.json');

if (!existsSync(STORE_DIR)) {
  mkdirSync(STORE_DIR, { recursive: true });
}

function readStore() {
  if (!existsSync(STORE_PATH)) return [];
  const raw = readFileSync(STORE_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeStore(messages) {
  writeFileSync(STORE_PATH, JSON.stringify(messages, null, 2));
}

export const messageStore = {
  getAll() {
    return readStore().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById(id) {
    return readStore().find(m => m.id === id) || null;
  },

  create(original, polished, prompt) {
    const messages = readStore();
    const message = {
      id: randomUUID(),
      original,
      polished,
      prompt,
      createdAt: new Date().toISOString(),
    };
    messages.push(message);
    writeStore(messages);
    return message;
  },

  delete(id) {
    const messages = readStore();
    const filtered = messages.filter(m => m.id !== id);
    if (filtered.length === messages.length) return false;
    writeStore(filtered);
    return true;
  },
};
