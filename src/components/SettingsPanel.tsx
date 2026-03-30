import { useState, useEffect } from 'react';
import { Key, Save, Trash2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import type { AIProvider } from '../types';

export function SettingsPanel() {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load saved settings
    chrome.storage.local.get(['apiKey', 'aiProvider']).then((result) => {
      if (result.apiKey) setApiKey(result.apiKey as string);
      if (result.aiProvider) setProvider(result.aiProvider as AIProvider);
    });
  }, []);

  const handleSave = async () => {
    await chrome.storage.local.set({ 
      apiKey: apiKey.trim(),
      aiProvider: provider 
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClear = async () => {
    await chrome.storage.local.remove(['apiKey', 'aiProvider']);
    setApiKey('');
    setProvider('gemini');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Key className="text-purple-400" size={20} />
          API Configuration
        </h2>
        <p className="text-sm text-slate-400">
          To enable AI fix suggestions, you need to provide an API key. 
          Your key is stored securely in your browser's local storage and is never sent to any server other than the AI provider.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">AI Provider</label>
          <select 
            value={provider}
            onChange={(e) => setProvider(e.target.value as AIProvider)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none"
          >
            <option value="gemini">Google Gemini (Free Tier available)</option>
            <option value="claude" disabled>Anthropic Claude (Coming soon)</option>
            <option value="groq" disabled>Groq (Coming soon)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-300">API Key</label>
            {provider === 'gemini' && (
              <a 
                href="https://aistudio.google.com/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Get a free key
              </a>
            )}
          </div>
          <div className="relative">
            <input
              type={isVisible ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key..."
              className="w-full bg-slate-800 border border-slate-700 rounded-md pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-300"
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={!apiKey.trim()}
          className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          {isSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {isSaved ? 'Saved!' : 'Save Key'}
        </button>
        <button
          onClick={handleClear}
          disabled={!apiKey}
          className="px-4 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 hover:border-red-500/30 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Clear
        </button>
      </div>
    </div>
  );
}
