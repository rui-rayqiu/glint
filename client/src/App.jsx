import { useState } from 'react';
import Editor from './components/Editor.jsx';
import History from './components/History.jsx';

export default function App() {
  const [view, setView] = useState('editor');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/5 px-8 py-5 flex items-center justify-between backdrop-blur-sm">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">✦</span>{' '}
          <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">Glint</span>
        </h1>
        <nav className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
          <button
            onClick={() => setView('editor')}
            className={`px-5 py-2 rounded-lg text-base font-medium transition-all ${
              view === 'editor'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => { setView('history'); setRefreshKey(k => k + 1); }}
            className={`px-5 py-2 rounded-lg text-base font-medium transition-all ${
              view === 'history'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            History
          </button>
        </nav>
      </header>

      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        {view === 'editor' ? <Editor /> : <History key={refreshKey} />}
      </main>
    </div>
  );
}
