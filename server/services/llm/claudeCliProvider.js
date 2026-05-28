import { execFile } from 'child_process';
import { LLMProvider } from './provider.js';

export class ClaudeCliProvider extends LLMProvider {
  async polish(text, prompt) {
    const fullPrompt = `${prompt}\n\nHere is the text to improve:\n\n${text}\n\nRespond with ONLY the improved text, no explanations or preamble.`;

    return new Promise((resolve, reject) => {
      execFile(
        'claude',
        ['-p', fullPrompt],
        { maxBuffer: 1024 * 1024, timeout: 60000 },
        (error, stdout, stderr) => {
          if (error) {
            reject(new Error(`Claude CLI failed: ${error.message}`));
            return;
          }
          resolve(stdout.trim());
        }
      );
    });
  }
}
