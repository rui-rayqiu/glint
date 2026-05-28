import { ClaudeCliProvider } from './claudeCliProvider.js';

const providers = {
  'claude-cli': ClaudeCliProvider,
};

let activeProvider = null;

export function getLLMProvider() {
  if (!activeProvider) {
    const providerName = process.env.LLM_PROVIDER || 'claude-cli';
    const ProviderClass = providers[providerName];
    if (!ProviderClass) throw new Error(`Unknown LLM provider: ${providerName}`);
    activeProvider = new ProviderClass();
  }
  return activeProvider;
}
