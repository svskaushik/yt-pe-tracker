/* global Request, URL, console */
import { NextResponse } from 'next/server';

// Mock data for posts - in a real blog, this would come from a CMS or database
const mockPosts = [
  {
    id: '1',
    title: 'The Rise of Private Equity in Digital Media',
    excerpt: 'How PE firms are reshaping the YouTube content landscape through strategic acquisitions.',
    content: 'Private equity firms have increasingly turned their attention to digital media properties, with YouTube channels becoming a particularly attractive investment target...',
    coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
    category: 'Technology',
    tags: ['private equity', 'youtube', 'digital media'],
    readTime: 5,
    viewCount: 1250,
    commentCount: 23,
    authorId: 'admin',
    author: {
      name: 'YouTube PE Tracker Team',
      image: null,
    },
    createdAt: '2024-03-15T10:00:00.000Z',
    updatedAt: '2024-03-15T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Understanding Channel Valuation Metrics',
    excerpt: 'Key factors that PE firms consider when evaluating YouTube channel acquisitions.',
    content: 'When private equity firms evaluate YouTube channels for acquisition, they consider multiple metrics beyond just subscriber count...',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    category: 'Business',
    tags: ['valuation', 'metrics', 'analysis'],
    readTime: 7,
    viewCount: 890,
    commentCount: 15,
    authorId: 'admin',
    author: {
      name: 'YouTube PE Tracker Team',
      image: null,
    },
    createdAt: '2024-03-10T14:30:00.000Z',
    updatedAt: '2024-03-10T14:30:00.000Z',
  },
  {
    id: '3',
    title: 'Case Study: MrBeast and Creator Economy Evolution',
    excerpt: 'Analyzing how mega-creators are attracting institutional investment and changing the game.',
    content: 'The creator economy has evolved dramatically, with creators like MrBeast demonstrating the potential for YouTube channels to become media empires...',
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop',
    category: 'Design',
    tags: ['creator economy', 'case study', 'investment'],
    readTime: 8,
    viewCount: 2100,
    commentCount: 42,
    authorId: 'admin',
    author: {
      name: 'YouTube PE Tracker Team',
      image: null,
    },
    createdAt: '2024-03-05T09:15:00.000Z',
    updatedAt: '2024-03-05T09:15:00.000Z',
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || undefined;
    const sortBy = searchParams.get('sortBy') || 'newest';

    let filteredPosts = [...mockPosts];

    // Filter by search query
    if (query) {
      const searchLower = query.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (category && category !== 'All') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    // Sort posts
    filteredPosts.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return b.viewCount - a.viewCount;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return NextResponse.json(filteredPosts);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
