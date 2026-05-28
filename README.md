# Glint

Polish your writing with AI. A local-first tool for refining Slack messages, PR descriptions, technical docs, and any other writing before you send it.

## Features

- Edit your writing in a clean, modern dark UI
- One-click polish via local Claude Code CLI
- Inline diff view showing what changed (word-level)
- Accept polished text into the editor for iterative refinement
- Customizable system prompt (edit the instructions that guide the refinement)
- Auto-detects format context (Slack, Markdown, plain text)
- History view to browse, copy, and delete past polished messages
- Keyboard shortcut: Cmd+Enter to polish
- System-wide hotkey via Alfred (clipboard mode or browser mode)

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated

Verify Claude CLI works:

```bash
claude -p "Hello"
```

## Setup

```bash
git clone https://github.com/rui-rayqiu/glint.git
cd glint
npm run install:all
```

## Usage

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## How it works

1. Type or paste your text in the editor
2. Optionally click "Edit prompt" to customize the refinement instructions
3. Press Cmd+Enter or click "Polish"
4. Copy the result to your clipboard

## System-wide Hotkey (macOS + Alfred)

Polish text from any app with a hotkey. See [alfred/SETUP.md](alfred/SETUP.md) for full instructions.

## Architecture

```
glint/
  client/          React + Vite + Tailwind (dark themed UI)
  server/          Express API
    routes/        REST endpoints
    services/llm/  LLM provider abstraction
    storage/       Message persistence (JSON file at ~/.glint/messages.json)
```

### LLM Provider

The LLM layer uses a provider pattern. The default provider calls `claude -p` locally. To add a new provider:

1. Create a class extending `LLMProvider` in `server/services/llm/`
2. Implement the `polish(text, prompt)` method
3. Register it in `server/services/llm/index.js`
4. Set `LLM_PROVIDER=your-provider` environment variable

### Storage

Messages are stored in `~/.glint/messages.json`. The storage layer uses a repository pattern, making it straightforward to swap in a database later.

## License

MIT
