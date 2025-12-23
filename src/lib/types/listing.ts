export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  county?: string;
}

export interface Schools {
  elementary: string;
  middle: string;
  high: string;
}

export interface Agent {
  name: string;
  title: string;
  phone?: string;
  email?: string;
  company?: string;
}

export interface PriceHistoryEntry {
  date: string;
  event: string;
  price: number;
  change?: number;
}

export type PropertyType =
  | "Single Family Home"
  | "Multi-Family Home"
  | "Condominium"
  | "Land";

export type ListingStatus = "Active" | "Pending";

export interface Listing {
  id: string;
  mls_number: string;
  address: Address;
  price: number;
  status: ListingStatus;
  days_on_market?: number;
  property_type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  square_feet?: number;
  lot_size?: string;
  year_built?: number;
  style?: string;
  description: string;
  features: string[];
  taxes?: number;
  tax_year?: number;
  heating_cooling?: string;
  basement?: string;
  exterior?: string;
  roof?: string;
  sewer?: string;
  schools?: Schools;
  virtual_tour?: string | boolean;
  images?: string[];
  agent: Agent;
  listing_url: string;
  price_history?: PriceHistoryEntry[];
}

export interface Brokerage {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
}

export interface ListingsData {
  source: string;
  location: string;
  scraped_date: string;
  total_listings: number;
  listings: Listing[];
  brokerage: Brokerage;
  data_source: string;
  notes: string;
}

// Helper type for listings with normalized virtual tour
export interface NormalizedListing extends Omit<Listing, "virtual_tour"> {
  virtual_tour: string | null;
  hasImages: boolean;
}

// Utility function to normalize a listing
export function normalizeListing(listing: Listing): NormalizedListing {
  return {
    ...listing,
    virtual_tour:
      typeof listing.virtual_tour === "string" ? listing.virtual_tour : null,
    hasImages: Array.isArray(listing.images) && listing.images.length > 0,
  };
}
