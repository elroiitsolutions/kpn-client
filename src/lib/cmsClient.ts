import {
  projectsData,
  blogData,
  awardsData,
  testimonialsData,
  navigationLinks,
  ProjectItem,
  BlogPostItem,
  AwardItem,
} from '@/data/siteData';

export interface TestimonialItem {
  id?: string;
  title: string;
  author: string;
  role: string;
  avatar: string;
  quote: string;
  rating?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all published projects from MongoDB backend API with fallback to local siteData
 */
export async function getProjects(): Promise<ProjectItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          slug: p.slug,
          bhk: p.bhk,
          location: p.location,
          budget: p.budget,
          image: p.image,
          status: p.status,
          propertyType: p.propertyType,
          totalUnits: p.totalUnits,
          availableUnits: p.availableUnits,
          commencementDate: p.commencementDate,
          handoverTimeline: p.handoverTimeline,
          amenities: p.amenities?.map((a: any) => a.name) || [],
          details: {
            propertyType: p.propertyType,
            status: p.status,
            handover: p.handoverTimeline,
            units: p.totalUnits ? `${p.totalUnits} Units` : undefined,
          },
        }));
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Backend projects fetch failed, using fallback static data:', (err as Error).message);
  }

  // Fallback to static siteData
  return projectsData;
}

/**
 * Fetch a single project by slug from MongoDB backend API with fallback
 */
export async function getProjectBySlug(slug: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${slug}`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn(`[cmsClient] Backend fetch for slug "${slug}" failed, checking siteData fallback.`);
  }

  // Fallback to local siteData
  const fallback = projectsData.find((p) => p.slug === slug);
  return fallback || null;
}

/**
 * Fetch project units availability matrix from backend
 */
export async function getProjectUnits(projectIdOrSlug: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects/${projectIdOrSlug}/units`, {
      next: { revalidate: 10 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn(`[cmsClient] Failed to fetch units for ${projectIdOrSlug}`);
  }

  return [];
}

/**
 * Fetch blogs from backend API with fallback
 */
export async function getBlogs(): Promise<BlogPostItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((b: any) => ({
          id: b._id,
          title: b.title,
          slug: b.slug,
          category: b.category,
          date: new Date(b.publishedDate || b.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          excerpt: b.shortDescription,
          image: b.featuredImage || '/images/blog/blog_1.jpg',
          bannerImage: b.bannerImage,
          content: typeof b.content === 'string' ? b.content.split('\n\n') : b.content,
          galleryImages: b.galleryImages || [],
        }));
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Failed to fetch blogs from backend, using fallback:', (err as Error).message);
  }

  return blogData;
}

/**
 * Fetch a single blog post by slug with fallback
 */
export async function getBlogBySlug(slug: string): Promise<BlogPostItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/${slug}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        const b = data.data;
        return {
          id: b._id,
          title: b.title,
          slug: b.slug,
          category: b.category,
          date: new Date(b.publishedDate || b.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          excerpt: b.shortDescription,
          image: b.featuredImage || '/images/blog/blog_1.jpg',
          bannerImage: b.bannerImage,
          content: typeof b.content === 'string' ? b.content.split('\n\n') : b.content,
          galleryImages: b.galleryImages || [],
        };
      }
    }
  } catch (err) {
    console.warn(`[cmsClient] Failed to fetch blog slug "${slug}"`);
  }

  const fallback = blogData.find((b) => b.slug === slug);
  return fallback || null;
}

/**
 * Fetch awards with fallback
 */
export async function getAwards(): Promise<AwardItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/awards`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((a: any) => ({
          id: a._id,
          title: a.title,
          organization: a.organization,
          year: a.year,
          image: a.image,
          description: a.description,
        }));
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Failed to fetch awards from backend, using fallback');
  }

  return awardsData;
}

/**
 * Fetch testimonials with fallback
 */
export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/testimonials`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map((t: any) => ({
          id: t._id,
          title: t.title,
          author: t.author,
          role: t.role,
          avatar: t.avatar,
          quote: t.quote,
          rating: t.rating || 5,
        }));
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Failed to fetch testimonials from backend, using fallback');
  }

  return testimonialsData;
}

/**
 * Submit lead enquiry from public website to backend
 */
export async function submitEnquiry(enquiryData: {
  name: string;
  phone: string;
  email?: string;
  projectName?: string;
  message?: string;
  source?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiryData),
  });

  return res.json();
}

/**
 * Fetch dynamic header navigation menu from backend CMS
 */
export async function getMenu(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/cms/menu`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data?.items) && data.data.items.length > 0) {
        // Filter only visible items (isEnabled !== false) and sort by order
        return data.data.items
          .filter((item: any) => item.isEnabled !== false)
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          .map((item: any) => ({
            ...item,
            children: (item.children || [])
              .filter((c: any) => c.isEnabled !== false)
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
          }));
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Failed to fetch dynamic menu, using siteData navigationLinks');
  }

  return navigationLinks;
}

/**
 * Fetch dynamic footer from backend CMS
 */
export async function getFooter(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/cms/footer`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Failed to fetch dynamic footer');
  }

  return null;
}

/**
 * Fetch dynamic Homepage CMS data
 */
export async function getHomepageCMS(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/cms/home`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('[cmsClient] Failed to fetch homepage CMS');
  }

  return null;
}


