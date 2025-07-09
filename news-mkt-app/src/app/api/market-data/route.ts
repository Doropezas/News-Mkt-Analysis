import { NextResponse } from 'next/server';

export interface MarketData {
  name: string;
  price: string;
  change: string;
  change_percent: string;
  is_up: boolean;
}

export async function GET() {
  // In a real application, you would fetch this from an external API like Alpha Vantage.
  // For this prototype, we are returning mocked data to avoid API key management.
  const mockData: MarketData[] = [
    {
      name: 'Crude Oil (WTI)',
      price: '81.50',
      change: '+0.75',
      change_percent: '0.93%',
      is_up: true,
    },
    {
      name: 'Gold',
      price: '2350.30',
      change: '-5.40',
      change_percent: '0.23%',
      is_up: false,
    },
    {
      name: 'USD/BRL',
      price: '5.42',
      change: '+0.03',
      change_percent: '0.56%',
      is_up: true,
    },
    {
        name: 'USD/MXN',
        price: '18.35',
        change: '-0.12',
        change_percent: '0.65%',
        is_up: false,
    }
  ];

  try {
    // You can add logic here to switch between mock and real data based on environment variables
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Failed to fetch market data:', error);
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
