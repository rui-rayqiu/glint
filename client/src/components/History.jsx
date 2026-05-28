import { useState, useEffect } from 'react';
import { useToast } from './Toast.jsx';

export default function History() {
  const [messages, setMessages] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(setMessages)
      .catch(console.error);
  }, []);

  async function handleDelete(id) {
    await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    setMessages(msgs => msgs.filter(m => m.id !== id));
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    toast('Copied to clipboard');
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-24 text-gray-500">
        <p className="text-xl">No polished messages yet</p>
        <p className="text-base mt-2">Switch to the Editor to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map(msg => (
        <div
          key={msg.id}
          className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-violet-500/20"
        >
          <div
            className="px-6 py-5 cursor-pointer flex items-start justify-between gap-4"
            onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-base text-gray-100 truncate">{msg.polished}</p>
              <p className="text-sm text-gray-500 mt-1.5">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={e => { e.stopPropagation(); handleCopy(msg.polished); }}
                className="p-2 text-gray-500 hover:text-violet-400 transition-colors rounded-lg hover:bg-violet-500/10"
                title="Copy polished"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2" />
                </svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); handleDelete(msg.id); }}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {expanded === msg.id && (
            <div className="border-t border-white/5 px-6 py-5 space-y-5 bg-white/[0.01]">
              <div>
                <p className="text-xs font-semibold text-violet-400/70 uppercase tracking-wider mb-2">Original</p>
                <p className="text-base text-gray-300 whitespace-pre-wrap leading-relaxed">{msg.original}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-400/70 uppercase tracking-wider mb-2">Polished</p>
                <p className="text-base text-gray-100 whitespace-pre-wrap leading-relaxed">{msg.polished}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-400/70 uppercase tracking-wider mb-2">Prompt used</p>
                <p className="text-sm text-gray-500 italic leading-relaxed">{msg.prompt}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
