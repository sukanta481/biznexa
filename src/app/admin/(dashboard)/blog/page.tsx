import BlogManagementClient from '@/components/admin/BlogManagementClient';
import { getAdminBlogDashboardData } from '@/lib/blog';

export default async function BlogManagementPage() {
  const dashboard = await getAdminBlogDashboardData();

  return <BlogManagementClient dashboard={dashboard} />;
}
