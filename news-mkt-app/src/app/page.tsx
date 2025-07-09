'use client';

import { useState, useEffect } from 'react';
import type { Article } from './api/news/route';
import MarketTickers from '@/components/MarketTickers';
import EconomicIndicators from '@/components/EconomicIndicators'; // Import the new component

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="py-8 border-b border-gray-200 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">News Market Hub</h1>
          <p className="mt-2 text-lg text-gray-600">Real-time updates on emerging markets, commodities, and economic indicators.</p>
          <MarketTickers />
        </header>

        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Latest News</h2>

          {loading && <p className="text-center text-gray-500">Loading articles...</p>}
          {error && <p className="text-center text-red-500">Error: {error}</p>}

          {!loading && !error && (
            <div className="space-y-6">
              {articles.map((article) => (
                <article key={article.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
                    <h2 className="text-2xl font-semibold text-gray-800 hover:text-blue-600">{article.title}</h2>
                  </a>
                  <p className="mt-3 text-gray-600">{article.summary}</p>
                  <footer className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Source: <span className="font-medium">{article.source}</span> | Published: {new Date(article.published_at).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      {article.tags.map((tag) => (
                        <span key={tag} className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>

        <EconomicIndicators />

      </div>
    </main>
  );
}
