import { notFound } from 'next/navigation';
import { getBlogBySlug, getBlogs } from '@/lib/cmsClient';
import BlogDetailClient from './BlogDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function BlogDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();

  const [post, allPosts] = await Promise.all([
    getBlogBySlug(slug),
    getBlogs(),
  ]);

  if (!post) {
    notFound();
  }

  return <BlogDetailClient post={post} allPosts={allPosts} />;
}
