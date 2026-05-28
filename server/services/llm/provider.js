export class LLMProvider {
  async polish(text, prompt) {
    throw new Error('polish() must be implemented by subclass');
  }
}
