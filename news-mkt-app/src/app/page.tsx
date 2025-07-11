'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Article } from './api/news/route';
import MarketTickers from '@/components/MarketTickers';
import EconomicIndicators from '@/components/EconomicIndicators';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term

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

    // Fetch immediately on component mount
    fetchArticles();

    // Set up interval to fetch every 30 seconds (30000 milliseconds)
    const intervalId = setInterval(fetchArticles, 30000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Filter articles based on search term
  const filteredArticles = useMemo(() => {
    if (!searchTerm) {
      return articles;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return articles.filter(article =>
      article.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      article.summary.toLowerCase().includes(lowerCaseSearchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)) ||
      article.source.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [articles, searchTerm]);

  return (
    <main className="bg-black text-gray-400 min-h-screen w-full p-2 sm:p-4 font-mono">
      <div className="border border-gray-500 w-full h-full min-h-[calc(100vh-2rem)] flex flex-col">
        {/* Header Bar */}
        <div className="bg-gray-500 text-black px-2 py-1 flex justify-between items-center">
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
          <div className="lg:col-span-2 border border-gray-500 p-2 overflow-y-auto">
            <div className="flex items-center">
              <span className="text-gray-300">[user@newshub ~]$</span>
              <input
                type="text"
                className="flex-grow bg-transparent border-none outline-none text-gray-100 ml-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to filter news..."
              />
              <span className="cursor"></span>
            </div>
            <div className="mt-2">
              {loading && <p>Loading news feed...</p>}
              {error && <p className="text-red-400">Error: {error}</p>}
              {!loading && !error && (
                <div className="space-y-2">
                  {filteredArticles.map((article: Article) => (
                    <div key={article.id} className="border-b border-dashed border-gray-700 pb-2">
                      <p>
                        <span className="text-gray-400">{new Date(article.published_at).toLocaleString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })}</span>
                        <span className="text-gray-300 mx-2">[{article.source.toUpperCase()}]</span>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-gray-100 hover:underline">{article.title}</a>
                      </p>
                      <p className="text-gray-500 pl-4">{article.summary}</p>
                      <div className="pl-4 flex space-x-2">
                        {article.tags.map((tag: string) => (
                          <span key={tag} className="text-gray-400">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Economic Indicators Panel */}
          <div className="border border-gray-500 p-2">
            <EconomicIndicators />
          </div>
        </div>

        {/* Footer Bar */}
        <div className="border-t border-gray-500 p-1 text-center text-xs">
          STATUS: OK | 200 OK | Real-time data feeds connected.
        </div>
      </div>
    </main>
  );
}
