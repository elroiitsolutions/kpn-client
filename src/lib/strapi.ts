import { blogData, BlogPostItem } from '@/data/siteData';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

/**
 * Normalizes an image path from Strapi or local static assets.
 */
export function getStrapiMedia(url: string | null | undefined): string {
  if (!url) return '/images/blog/blog_1.jpg';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/uploads')) {
    return `${STRAPI_URL}${url}`;
  }
  return url;
}

/**
 * Normalizes a Strapi article entry to match BlogPostItem interface.
 */
function normalizeArticle(item: any): BlogPostItem {
  // Support both Strapi v5 (flat data) and Strapi v4 (attributes wrapped)
  const data = item.attributes || item;
  
  // Category extraction
  let categoryName = 'Uncategorized';
  const catObj = data.category?.data?.attributes || data.category?.data || data.category;
  if (catObj && typeof catObj === 'object') {
    categoryName = catObj.name || categoryName;
  } else if (typeof catObj === 'string') {
    categoryName = catObj;
  }

  // Banner image extraction (top hero banner)
  let bannerImageUrl: string | undefined = undefined;
  const bannerObj = data.bannerImage?.data?.attributes || data.bannerImage?.data || data.bannerImage;
  if (bannerObj?.url) {
    bannerImageUrl = getStrapiMedia(bannerObj.url);
  } else if (typeof data.banner === 'string') {
    bannerImageUrl = getStrapiMedia(data.banner);
  }

  // Cover image extraction (cards & body cover)
  let coverImageUrl = '/images/blog/blog_1.jpg';
  const coverObj = data.coverImage?.data?.attributes || data.coverImage?.data || data.coverImage;
  if (coverObj?.url) {
    coverImageUrl = getStrapiMedia(coverObj.url);
  } else if (typeof data.image === 'string') {
    coverImageUrl = getStrapiMedia(data.image);
  }

  // Gallery images extraction
  const galleryList = data.galleryImages?.data || data.galleryImages || [];
  const galleryImages: string[] = Array.isArray(galleryList)
    ? galleryList.map((g: any) => {
        const url = g.attributes?.url || g.url;
        return getStrapiMedia(url);
      }).filter(Boolean)
    : [];

  // Content extraction (string or array or rich text blocks)
  let contentParagraphs: string[] = [];
  if (Array.isArray(data.content)) {
    contentParagraphs = data.content.map((c: any) => {
      if (typeof c === 'string') return c;
      if (c.children) {
        return c.children.map((child: any) => child.text || '').join('');
      }
      return '';
    }).filter(Boolean);
  } else if (typeof data.content === 'string') {
    contentParagraphs = data.content.split('\n\n').filter(Boolean);
  }

  // Date formatting
  let formattedDate = data.date;
  if (!formattedDate && data.publishedAt) {
    try {
      formattedDate = new Date(data.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      formattedDate = 'Recently Added';
    }
  }

  return {
    id: String(item.id || item.documentId || data.id || Math.random()),
    slug: data.slug || '',
    title: data.title || 'Untitled Post',
    category: categoryName,
    date: formattedDate || 'Mar 18, 2025',
    image: coverImageUrl,
    bannerImage: bannerImageUrl || '/images/blog/blog_1.jpg',
    excerpt: data.excerpt || (contentParagraphs[0] ? contentParagraphs[0].slice(0, 160) + '...' : ''),
    content: contentParagraphs.length > 0 ? contentParagraphs : [
      'It’s no secret that access to quality housing and education is vital.',
      'Investing in real estate is more than just acquiring property; it is about establishing a lasting legacy for your family.',
    ],
    galleryImages: galleryImages.length > 0 ? galleryImages : [
      '/images/projects/project_1.jpg',
      '/images/projects/project_2.jpg',
    ],
  };
}

/**
 * Fetches all published articles from Strapi with fallback to local siteData.
 */
export async function getStrapiArticles(): Promise<BlogPostItem[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/articles?populate=*&sort=createdAt:desc`, {
      next: { revalidate: 30 }, // Next.js ISR auto-revalidation
    });

    if (!res.ok) {
      console.warn(`[Strapi] Failed to fetch articles (${res.status}), using fallback data.`);
      return blogData;
    }

    const json = await res.json();
    const items = json.data;

    if (!Array.isArray(items) || items.length === 0) {
      return blogData;
    }

    return items.map(normalizeArticle);
  } catch (error) {
    console.warn('[Strapi] CMS offline or unreachable, using local fallback:', error);
    return blogData;
  }
}

/**
 * Fetches a single article by slug with fallback to local siteData.
 */
export async function getStrapiArticleBySlug(slug: string): Promise<BlogPostItem> {
  const cleanSlug = slug.toLowerCase().trim();
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/articles?filters[slug][$eq]=${encodeURIComponent(cleanSlug)}&populate=*`,
      { next: { revalidate: 30 } }
    );

    if (res.ok) {
      const json = await res.json();
      const items = json.data;
      if (Array.isArray(items) && items.length > 0) {
        return normalizeArticle(items[0]);
      }
    }
  } catch (error) {
    console.warn(`[Strapi] Error fetching slug "${cleanSlug}", falling back to local:`, error);
  }

  // Fallback to local blogData
  const localMatch = blogData.find((p) => p.slug.toLowerCase() === cleanSlug);
  return localMatch || blogData[0];
}

/**
 * Fetches category list from Strapi with fallback.
 */
export async function getStrapiCategories(): Promise<string[]> {
  const defaultCategories = [
    'All Posts',
    'Company',
    'Social Media',
    'Tips & Tricks',
    'Uncategorized',
  ];

  try {
    const res = await fetch(`${STRAPI_URL}/api/categories?sort=name:asc`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        const names: string[] = json.data
          .map((c: any) => {
            const item = c.attributes || c;
            return typeof item.name === 'string' ? item.name : '';
          })
          .filter((name: string) => Boolean(name));
        return ['All Posts', ...Array.from(new Set<string>(names))];
      }
    }
  } catch {
    // fallback
  }

  return defaultCategories;
}
