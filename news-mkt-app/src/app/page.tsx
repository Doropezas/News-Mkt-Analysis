'use client';

import { useState, useEffect } from 'react';
import type { Article } from './api/news/route';
import MarketTickers from '@/components/MarketTickers';
import EconomicIndicators from '@/components/EconomicIndicators';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [command, setCommand] = useState('cat /var/log/news.log');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data: Article[] = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <main className="bg-black text-green-400 min-h-screen w-full p-2 sm:p-4 font-mono">
      <div className="border border-green-400 w-full h-full min-h-[calc(100vh-2rem)] flex flex-col">
        {/* Header Bar */}
        <div className="bg-green-400 text-black px-2 py-1 flex justify-between items-center">
          <span>[NEWS-MKT-HUB] - /home/user - zsh</span>
          <span>[ davidoropezasalazar ]</span>
        </div>

        {/* Tickers Panel */}
        <div className="p-2">
          <MarketTickers />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow p-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* News Feed Panel */}
          <div className="lg:col-span-2 border border-green-400 p-2 overflow-y-auto">
            <div className="flex items-center">
              <span className="text-yellow-400">[user@newshub ~]$</span>
              <span className="text-white ml-2">{command}</span>
              <span className="cursor"></span>
            </div>
            <div className="mt-2">
              {loading && <p>Loading news feed...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}
              {!loading && !error && (
                <div className="space-y-2">
                  {articles.map((article) => (
                    <div key={article.id} className="border-b border-dashed border-green-800 pb-2">
                      <p>
                        <span className="text-cyan-400">{new Date(article.published_at).toISOString()}</span>
                        <span className="text-yellow-400 mx-2">[{article.source.toUpperCase()}]</span>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">{article.title}</a>
                      </p>
                      <p className="text-gray-400 pl-4">{article.summary}</p>
                      <div className="pl-4 flex space-x-2">
                        {article.tags.map((tag) => (
                          <span key={tag} className="text-purple-400">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Economic Indicators Panel */}
          <div className="border border-green-400 p-2">
            <EconomicIndicators />
          </div>
        </div>

        {/* Footer Bar */}
        <div className="border-t border-green-400 p-1 text-center text-xs">
          STATUS: OK | 200 OK | Real-time data feeds connected.
        </div>
      </div>
    </main>
  );
}
