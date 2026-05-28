import { useState } from 'react';
import { useToast } from './Toast.jsx';
import Diff from './Diff.jsx';

const DEFAULT_PROMPT = `Role: Professional technical editor for a software engineer.

Objective: Refine the provided text for clarity, conciseness, and professional impact while preserving the original intent, format, and level of formality.

Rules:
- No fluff: Do not add pleasantries, filler words, or new information not present in the original.
- Single output: Provide only one definitive rewritten version. No options, alternatives, or meta-commentary.
- Tone: Professional, direct, and grounded. First-person for individual statements, "we" when speaking for a group.
- Remove passive voice where it obscures accountability or action.
- Ensure the logic flows clearly from one point to the next. The reader should never have to re-read a sentence to understand the reasoning.
- Ensure the text reads smoothly and is easy to scan.
- Never use em dashes. Use commas, periods, or semicolons instead.
- Format: Match the output format to the input context. If it reads like a short Slack message, keep it plain and conversational. If it looks like a GitHub PR description, commit message, or technical doc, use standard Markdown with headers, bullet points, and code blocks. If it's a formal document or email, keep it structured but without markup. When in doubt, output plain text with no markup.

Rewrite the following text according to these rules:`;

export default function Editor() {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showDiff, setShowDiff] = useState(true);
  const [previousText, setPreviousText] = useState(null);
  const toast = useToast();

  async function handlePolish() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setPreviousText(null);

    try {
      const res = await fetch('/api/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, prompt }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAccept() {
    if (result?.polished) {
      setPreviousText(text);
      setText(result.polished);
      setResult(null);
      toast('Accepted polished version');
    }
  }

  function handleUndo() {
    if (previousText !== null) {
      setText(previousText);
      setPreviousText(null);
      toast('Reverted to original');
    }
  }

  function handleCopy() {
    if (result?.polished) {
      navigator.clipboard.writeText(result.polished);
      toast('Copied to clipboard');
    }
  }

  function handleReset() {
    setText('');
    setResult(null);
    setError(null);
    setPreviousText(null);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-base font-medium text-gray-200">Your writing</label>
          <div className="flex items-center gap-3">
            {previousText !== null && (
              <button
                onClick={handleUndo}
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
                </svg>
                Undo
              </button>
            )}
            <button
              onClick={() => setShowPrompt(!showPrompt)}
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              {showPrompt ? 'Hide prompt' : 'Edit prompt'}
            </button>
          </div>
        </div>

        {showPrompt && (
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="w-full bg-white/5 border border-violet-500/20 rounded-xl px-5 py-4 text-base text-gray-200 resize-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all"
            rows={10}
            placeholder="Instructions for how to improve your writing..."
          />
        )}

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              handlePolish();
            }
          }}
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-xl leading-relaxed text-gray-100 resize-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all placeholder:text-gray-600"
          rows={8}
          placeholder="Paste or type your message here... (⌘+Enter to polish)"
          disabled={loading}
        />

        <div className="flex gap-3">
          <button
            onClick={handlePolish}
            disabled={loading || !text.trim()}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 rounded-xl font-semibold text-base transition-all shadow-lg shadow-violet-600/20 hover:shadow-violet-500/30 disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Polishing...
              </span>
            ) : (
              'Polish ✦'
            )}
          </button>
          {(text || result) && (
            <button
              onClick={handleReset}
              className="px-5 py-3 text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl text-base transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-6 py-5 text-red-300 text-base">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-base font-medium text-gray-200">Result</label>
              <button
                onClick={() => setShowDiff(!showDiff)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  showDiff
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-gray-500 border border-white/10 hover:text-gray-300'
                }`}
              >
                Diff
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAccept}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Accept
              </button>
              <button
                onClick={handleCopy}
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2" />
                </svg>
                Copy
              </button>
            </div>
          </div>

          <div className="bg-violet-500/[0.04] border border-violet-500/15 rounded-2xl px-6 py-5">
            {showDiff ? (
              <Diff original={result.original} polished={result.polished} />
            ) : (
              <div className="text-xl leading-relaxed text-gray-100 whitespace-pre-wrap">
                {result.polished}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
