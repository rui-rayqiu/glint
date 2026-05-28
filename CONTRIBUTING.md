# Contributing to Glint

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork the repo on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/glint.git
   cd glint
   ```
3. Install dependencies:
   ```bash
   npm run install:all
   ```
4. Create a branch for your change:
   ```bash
   git checkout -b my-feature
   ```
5. Make your changes and test locally with `npm run dev`

## Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin my-feature
   ```
2. Open a Pull Request against `main` on this repo
3. Describe what your change does and why

## Ideas for Contributions

- New LLM providers (OpenAI, Ollama, Anthropic API direct)
- Database storage backends (SQLite, PostgreSQL)
- UI improvements
- Prompt presets/templates
- Export/import history
- Browser extension integration

## Guidelines

- Keep changes focused. One feature or fix per PR.
- Test your changes locally before submitting.
- Follow the existing code style.
- No new dependencies without a good reason.

## Project Structure

```
glint/
  client/              Frontend (React + Vite + Tailwind)
  server/
    routes/            API endpoints
    services/llm/     LLM provider abstraction
    storage/          Persistence layer
```

### Adding a New LLM Provider

1. Create a new file in `server/services/llm/` (e.g., `openaiProvider.js`)
2. Export a class extending `LLMProvider` with a `polish(text, prompt)` method
3. Register it in `server/services/llm/index.js`

## Questions?

Open an issue if something is unclear or you want to discuss an idea before starting work.
