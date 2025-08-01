import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

// Helper to extract hostname for fallback title
function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export async function GET() {
  // Read the full dataset from the root-level data folder
  // data folder is one level above web directory
  const dataPath = path.join(process.cwd(), '..', 'data', 'channels.json');
  let file: string;
  try {
    file = await fs.readFile(dataPath, 'utf-8');
  } catch (err) {
    // Use proper logging instead of console.error
    return NextResponse.json({ error: 'channels.json not found', path: dataPath }, { status: 500 });
  }
  try {
    const { channels } = JSON.parse(file);

    type NewsArticle = {
      url: string;
      type: 'primary' | 'secondary';
      channel_name: string;
      channel_handle: string;
      pe_firm: string;
      headline: string;
    };
    const articles: NewsArticle[] = [];
    for (const channel of channels) {
      if (channel.source_url) {
        articles.push({
          url: channel.source_url,
          type: 'primary',
          channel_name: channel.channel_name,
          channel_handle: channel.channel_handle,
          pe_firm: channel.pe_firm,
          headline: channel.source_url,
        });
      }
      if (Array.isArray(channel.additional_sources)) {
        for (const src of channel.additional_sources) {
          articles.push({
            url: src,
            type: 'secondary',
            channel_name: channel.channel_name,
            channel_handle: channel.channel_handle,
            pe_firm: channel.pe_firm,
            headline: src,
          });
        }
      }
    }

  // Keep each channel's source entry (avoid dedupe to preserve channel context)
  const unique = articles; // NewsArticle[]

    // Try to prettify the headline (use hostname if no title)
    for (const art of unique) {
      if (!art.headline || art.headline === art.url) {
        art.headline = getHostname(art.url);
      }
    }

    // Sort by channel name, then primary first
    unique.sort((a, b) => {
      if (a.channel_name !== b.channel_name) {
        return a.channel_name.localeCompare(b.channel_name);
      }
      return a.type === 'primary' ? -1 : 1;
    });

    return NextResponse.json(unique);
  } catch (error) {
    // Safely log error
    let details = '';
    if (error instanceof Error) {
      details = error.stack || error.message || String(error);
    } else {
      details = JSON.stringify(error);
    }
    // Use proper logging instead of console.error
    return NextResponse.json({ error: 'Failed to build news feed', details }, { status: 500 });
  }
}
