export interface NavigationItem {
  label: string;
  url: string;
  submenu?: NavigationItem[];
  external?: boolean;
}

export interface Navigation {
  main_menu: NavigationItem[];
}

export interface AgentListing {
  address: string;
  city: string;
  state: string;
  zip: string;
  price: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  acres?: number;
  year_built?: number;
  property_type?: string;
  description?: string;
  image?: string;
  images?: string[];
  url?: string;
  mls_id?: string;
  status?: "active" | "sold" | "pending";
  sold_date?: string;
  sold_price?: string;
}

export interface SiteAgent {
  name: string;
  title: string;
  licenses?: string;
  phone?: string;
  cell_phone?: string;
  office_phone?: string;
  email?: string;
  website?: string;
  photo?: string;
  profile_url: string;
  slug?: string;
  bio?: string;
  languages?: string[];
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  office?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  active_listings?: AgentListing[];
  sold_listings?: AgentListing[];
  specialties?: string[];
}

export interface BlogPost {
  title: string;
  author: string;
  date: string;
  url: string;
}

export interface SiteFeature {
  name: string;
  description: string;
  url: string;
}

export interface ContactInfo {
  office_phone: string;
  direct_phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface Branding {
  logo_url: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  tagline: string;
}

export interface SocialMedia {
  facebook: boolean;
  twitter: boolean;
  linkedin: boolean;
  instagram: boolean;
  youtube: boolean;
}

export interface FooterInfo {
  copyright: string;
  legal_links: string[];
  mls_disclaimer: string;
}

export interface MLSInfo {
  source: string;
  disclaimer: string;
}

export interface LegalPage {
  title: string;
  url: string;
  content?: string;
  note?: string;
}

export interface SiteContent {
  site_name: string;
  tagline: string;
  about: {
    mission: string;
    history: string;
    description: string;
  };
  contact: ContactInfo;
  navigation: Navigation;
  agents: SiteAgent[];
  blog: {
    title: string;
    url: string;
    recent_posts: BlogPost[];
  };
  features: SiteFeature[];
  service_areas: string[];
  branding: Branding;
  social_media: SocialMedia;
  footer: FooterInfo;
  mls_info: MLSInfo;
  search_features: string[];
  property_types: string[];
  legal_pages: Record<string, LegalPage>;
}
