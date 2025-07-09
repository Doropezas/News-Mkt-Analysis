'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { EconomicIndicator } from '../app/api/economic-indicators/route';

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

  const gdpData = data
    .filter(d => d.indicator.includes('GDP'))
    .map(d => ({ country: d.country, value: parseFloat(d.value) }));

  const inflationData = data
    .filter(d => d.indicator.includes('Inflation'))
    .map(d => ({ country: d.country, value: parseFloat(d.value) }));

  if (loading) {
    return <div className="py-4 text-sm text-gray-500">Loading economic indicators...</div>;
  }

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Economic Indicators</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">GDP Growth Rate (YoY)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gdpData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => [`${value}%`, 'GDP Growth']} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="GDP Growth (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Inflation Rate (YoY)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inflationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => [`${value}%`, 'Inflation']} />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name="Inflation (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
