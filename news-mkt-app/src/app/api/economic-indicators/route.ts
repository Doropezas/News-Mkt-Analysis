import { NextResponse } from 'next/server';

export interface EconomicIndicator {
  country: string;
  indicator: string;
  value: string;
  period: string;
}

export async function GET() {
  // Mock data for economic indicators
  const mockData: EconomicIndicator[] = [
    {
      country: 'Brazil',
      indicator: 'GDP Growth Rate (YoY)',
      value: '2.5%',
      period: 'Q1 2025',
    },
    {
      country: 'Brazil',
      indicator: 'Inflation Rate (YoY)',
      value: '4.1%',
      period: 'June 2025',
    },
    {
      country: 'Mexico',
      indicator: 'GDP Growth Rate (YoY)',
      value: '2.8%',
      period: 'Q1 2025',
    },
    {
      country: 'Mexico',
      indicator: 'Inflation Rate (YoY)',
      value: '4.5%',
      period: 'June 2025',
    },
    {
        country: 'Argentina',
        indicator: 'GDP Growth Rate (YoY)',
        value: '-3.2%',
        period: 'Q1 2025',
    },
    {
        country: 'Argentina',
        indicator: 'Inflation Rate (YoY)',
        value: '150.7%',
        period: 'June 2025',
    }
  ];

  try {
    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Failed to fetch economic indicators:', error);
    return NextResponse.json({ error: 'Failed to fetch economic indicators' }, { status: 500 });
  }
}
