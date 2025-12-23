import siteContentData from "@/data/site-content.json";
import type {
  SiteContent,
  SiteAgent,
  BlogPost,
  NavigationItem,
  ContactInfo,
  Branding,
} from "@/lib/types";

// Cast the imported JSON to our type
const data = siteContentData as SiteContent;

/**
 * Get full site content
 */
export function getSiteContent(): SiteContent {
  return data;
}

/**
 * Get site name
 */
export function getSiteName(): string {
  return data.site_name;
}

/**
 * Get tagline
 */
export function getTagline(): string {
  return data.tagline;
}

/**
 * Get about section
 */
export function getAbout() {
  return data.about;
}

/**
 * Get contact info
 */
export function getContactInfo(): ContactInfo {
  return data.contact;
}

/**
 * Get main navigation
 */
export function getNavigation(): NavigationItem[] {
  return data.navigation.main_menu;
}

/**
 * Get all agents (Haley Markle first as broker/owner)
 */
export function getAgents(): SiteAgent[] {
  const agents = [...data.agents];
  // Sort to put Haley Markle (broker/owner) first
  agents.sort((a, b) => {
    if (a.name.toLowerCase().includes("haley markle")) return -1;
    if (b.name.toLowerCase().includes("haley markle")) return 1;
    return 0;
  });
  return agents;
}

/**
 * Get agent by name
 */
export function getAgentByName(name: string): SiteAgent | undefined {
  return data.agents.find(
    (agent) => agent.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Generate slug from agent name
 */
export function generateAgentSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Get agent by slug
 */
export function getAgentBySlug(slug: string): SiteAgent | undefined {
  return data.agents.find(
    (agent) => (agent.slug || generateAgentSlug(agent.name)) === slug
  );
}

/**
 * Get recent blog posts
 */
export function getRecentBlogPosts(count?: number): BlogPost[] {
  const posts = data.blog.recent_posts;
  return count ? posts.slice(0, count) : posts;
}

/**
 * Get features
 */
export function getFeatures() {
  return data.features;
}

/**
 * Get service areas
 */
export function getServiceAreas(): string[] {
  return data.service_areas;
}

/**
 * Get branding info
 */
export function getBranding(): Branding {
  return data.branding;
}

/**
 * Get social media config
 */
export function getSocialMedia() {
  return data.social_media;
}

/**
 * Get footer info
 */
export function getFooterInfo() {
  return data.footer;
}

/**
 * Get MLS info
 */
export function getMLSInfo() {
  return data.mls_info;
}

/**
 * Get property types
 */
export function getPropertyTypes(): string[] {
  return data.property_types;
}

/**
 * Get legal page content
 */
export function getLegalPage(key: string) {
  return data.legal_pages[key];
}
