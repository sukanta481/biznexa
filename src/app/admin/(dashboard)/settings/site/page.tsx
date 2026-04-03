import SiteSettingsClient from '@/components/admin/SiteSettingsClient';
import { createCsrfToken, getSiteSettings } from '@/lib/site-settings';

export default async function SiteSettingsPage() {
  const initialSettings = await getSiteSettings();
  const csrfToken = createCsrfToken();

  return <SiteSettingsClient initialSettings={initialSettings} csrfToken={csrfToken} />;
}