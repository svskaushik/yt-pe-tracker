"use client";
import { useEffect, useState } from 'react';

interface NewsArticle {
  url: string;
  type: 'primary' | 'secondary';
  channel_name: string;
  channel_handle: string;
  pe_firm: string;
  headline: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then((data: any) => {
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          setError(data.error || 'Unexpected response');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load news feed');
        setLoading(false);
      });
  }, []);

  return (
    <div className='bg-[var(--background)] min-h-screen'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-4xl font-bold text-[var(--foreground)] mb-8 text-center'>
          News Feed (Beta)
        </h1>
        {loading ? (
          <div className='text-center text-lg text-[var(--muted-foreground)]'>Loading...</div>
        ) : error ? (
          <div className='text-center text-lg text-[var(--destructive)]'>{error}</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {articles.map(article => (
              <div
                key={article.url + article.channel_name}
                className='bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow duration-200'
              >
                <a
                  href={article.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-semibold text-[var(--primary)] hover:underline text-lg mb-1'
                >
                  {article.headline}
                </a>
                <div className='text-sm text-[var(--muted-foreground)]'>
                  <span className='font-medium text-[var(--foreground)]'>{article.channel_name}</span>
                  {' '}(<span className='text-xs'>{article.channel_handle}</span>)<br />
                  <span className='italic'>{article.pe_firm}</span>
                </div>
                <div className='mt-2'>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${article.type === 'primary' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                    {article.type === 'primary' ? 'Primary Source' : 'Secondary Source'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
