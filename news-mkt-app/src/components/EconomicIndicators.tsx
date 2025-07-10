'use client';

import { useState, useEffect } from 'react';
import type { EconomicIndicator } from '../app/api/economic-indicators/route';

const Table = ({ title, data }: { title: string, data: EconomicIndicator[] }) => (
  <div>
    <h3 className="text-gray-300 mb-1">{title}</h3>
    <div className="border-t border-b border-gray-700 divide-y divide-gray-700">
      {data.map(item => (
        <div key={item.country} className="flex justify-between p-1">
          <span className="text-gray-100 w-1/3">{item.country}</span>
          <span className="w-1/3 text-center">{item.value}</span>
          <span className="w-1/3 text-right text-gray-500">{item.period}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function EconomicIndicators() {
  const [data, setData] = useState<EconomicIndicator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/economic-indicators');
        if (!response.ok) {
          throw new Error('Failed to fetch economic indicators');
        }
        const result: EconomicIndicator[] = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const gdpData = data.filter(d => d.indicator.includes('GDP'));
  const inflationData = data.filter(d => d.indicator.includes('Inflation'));

  if (loading) {
    return <p className="text-gray-300">Loading economic indicators...</p>;
  }

  return (
    <div>
      <h2 className="text-gray-400 mb-2">[ECONOMIC_INDICATORS]</h2>
      <div className="space-y-4">
        <Table title=">> GDP Growth Rate (YoY)" data={gdpData} />
        <Table title=">> Inflation Rate (YoY)" data={inflationData} />
      </div>
    </div>
  );
}
