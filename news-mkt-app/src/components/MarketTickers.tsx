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
        // You could set an error state here
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="py-2 text-sm text-gray-500">Loading market data...</div>;
  }

  if (!data.length) {
    return null; // Don't render anything if there's no data
  }

  return (
    <div className="py-4 overflow-x-auto">
      <div className="flex space-x-6">
        {data.map((item) => (
          <div key={item.name} className="flex-shrink-0 p-3 bg-white rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-600">{item.name}</p>
            <p className="text-xl font-semibold text-gray-900">{item.price}</p>
            <div className={`text-sm font-medium ${item.is_up ? 'text-green-600' : 'text-red-600'}`}>
              <span>{item.change}</span>
              <span className="ml-2">({item.change_percent})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
