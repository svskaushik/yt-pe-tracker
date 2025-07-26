import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Read the channels data from the data directory
    const dataPath = join(process.cwd(), '..', 'data', 'channels.min.json');
    const jsonData = readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(jsonData);
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return empty data structure as fallback
    const fallbackData = {
      meta: {
        generated_at: new Date().toISOString(),
        version: '1.0.0',
        total_channels: 0,
        description: 'YouTube Channel Private Equity Ownership Database',
        error: 'Failed to load data: ' + errorMessage
      },
      channels: []
    };
    
    return NextResponse.json(fallbackData, { 
      status: 200, // Return 200 to avoid client errors, but include error in meta
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}

export const revalidate = 60; // Revalidate every 60 seconds
