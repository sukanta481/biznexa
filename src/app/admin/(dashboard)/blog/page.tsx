import BlogManagementClient from '@/components/admin/BlogManagementClient';
import { getAdminBlogDashboardData } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export default async function BlogManagementPage() {
  const dashboard = await getAdminBlogDashboardData();

  return <BlogManagementClient dashboard={dashboard} />;
}
