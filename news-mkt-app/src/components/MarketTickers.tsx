'use client';

import { useState, useEffect } from 'react';
import type { MarketData } from '../app/api/market-data/route';

export default function MarketTickers() {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/market-data');
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }
        const result: MarketData[] = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-yellow-400">Loading market data...</div>;
  }

  if (!data.length) {
    return null;
  }

  return (
    <div className="border-y border-dashed border-green-800 py-1 whitespace-nowrap overflow-x-auto">
      <span className="text-cyan-400 mr-4">[MARKET_DATA]</span>
      {data.map((item, index) => (
        <span key={item.name} className="mr-6">
          <span className="text-white">{item.name}:</span>
          <span className="ml-2 font-bold">{item.price}</span>
          <span className={`ml-2 ${item.is_up ? 'text-green-500' : 'text-red-500'}`}>
            ({item.change} / {item.change_percent})
          </span>
        </span>
      ))}
    </div>
  );
}
