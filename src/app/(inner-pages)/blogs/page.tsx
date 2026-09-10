import { getBlogs } from '@/lib/cmsClient';
import BlogsClient from './BlogsClient';

export const revalidate = 60;

export default async function BlogsPage() {
  const posts = await getBlogs();

  return <BlogsClient initialPosts={posts} />;
}
