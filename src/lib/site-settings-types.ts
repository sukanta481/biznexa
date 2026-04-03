export interface SitePhoneEntry {
  label: string;
  number: string;
}

export interface SiteEmailEntry {
  department: string;
  email: string;
}

export interface SiteSocialLinks {
  whatsapp: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  github: string;
  telegram: string;
}

export type SiteSettingKey =
  | "site_name"
  | "site_email"
  | "site_phone"
  | "site_address"
  | "facebook_url"
  | "twitter_url"
  | "linkedin_url"
  | "instagram_url"
  | "stat_years"
  | "stat_projects"
  | "stat_clients"
  | "stat_countries"
  | "hero_title"
  | "hero_subtitle"
  | "hero_image";

export interface SiteSettings {
  siteName: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  social: SiteSocialLinks;
  stats: {
    years: string;
    projects: string;
    clients: string;
    countries: string;
  };
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  contactPhones: SitePhoneEntry[];
  contactEmails: SiteEmailEntry[];
  flat: Record<SiteSettingKey, string>;
}

export interface SiteSettingsUpdateInput {
  settings: Record<SiteSettingKey, string>;
  contactPhones: SitePhoneEntry[];
  contactEmails: SiteEmailEntry[];
  updatedBy?: number | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export const PHONE_LABEL_OPTIONS = ["Sales", "Support", "WhatsApp", "Office", "HR", "General"] as const;
export const EMAIL_DEPARTMENT_OPTIONS = ["Sales", "Support", "Billing", "HR", "Careers", "General"] as const;
