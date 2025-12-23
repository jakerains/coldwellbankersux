import listingsData from "@/data/listings.json";
import {
  type Listing,
  type ListingsData,
  type NormalizedListing,
  type PropertyType,
  normalizeListing,
} from "@/lib/types";

// Cast the imported JSON to our type
const data = listingsData as ListingsData;

/**
 * Get all listings
 */
export function getListings(): Listing[] {
  return data.listings;
}

/**
 * Get all listings normalized (with virtual_tour as string | null)
 */
export function getNormalizedListings(): NormalizedListing[] {
  return data.listings.map(normalizeListing);
}

/**
 * Get a single listing by ID
 */
export function getListingById(id: string): Listing | undefined {
  return data.listings.find((listing) => listing.id === id);
}

/**
 * Get featured listings (first N listings, sorted by price descending)
 */
export function getFeaturedListings(count: number = 6): Listing[] {
  return [...data.listings]
    .sort((a, b) => b.price - a.price)
    .slice(0, count);
}

/**
 * Get listings by status
 */
export function getListingsByStatus(status: "Active" | "Pending"): Listing[] {
  return data.listings.filter((listing) => listing.status === status);
}

/**
 * Get listings by property type
 */
export function getListingsByType(type: PropertyType): Listing[] {
  return data.listings.filter((listing) => listing.property_type === type);
}

/**
 * Get similar listings (same city or property type, excluding current)
 */
export function getSimilarListings(
  listing: Listing,
  count: number = 4
): Listing[] {
  return data.listings
    .filter(
      (l) =>
        l.id !== listing.id &&
        (l.address.city === listing.address.city ||
          l.property_type === listing.property_type)
    )
    .slice(0, count);
}

/**
 * Filter listings based on search criteria
 */
export interface ListingFilters {
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  maxBaths?: number;
  propertyType?: PropertyType;
  status?: "Active" | "Pending";
  city?: string;
  search?: string;
}

export function filterListings(filters: ListingFilters): Listing[] {
  return data.listings.filter((listing) => {
    // Price filter
    if (filters.minPrice && listing.price < filters.minPrice) return false;
    if (filters.maxPrice && listing.price > filters.maxPrice) return false;

    // Beds filter
    if (filters.minBeds && listing.bedrooms < filters.minBeds) return false;
    if (filters.maxBeds && listing.bedrooms > filters.maxBeds) return false;

    // Baths filter
    if (filters.minBaths && listing.bathrooms < filters.minBaths) return false;
    if (filters.maxBaths && listing.bathrooms > filters.maxBaths) return false;

    // Property type filter
    if (filters.propertyType && listing.property_type !== filters.propertyType)
      return false;

    // Status filter
    if (filters.status && listing.status !== filters.status) return false;

    // City filter
    if (
      filters.city &&
      listing.address.city.toLowerCase() !== filters.city.toLowerCase()
    )
      return false;

    // Search filter (searches address, description, features)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const addressString =
        `${listing.address.street} ${listing.address.city} ${listing.address.state}`.toLowerCase();
      const descriptionMatch = listing.description
        .toLowerCase()
        .includes(searchLower);
      const featuresMatch = listing.features.some((f) =>
        f.toLowerCase().includes(searchLower)
      );
      const mlsMatch = listing.mls_number.includes(filters.search);

      if (
        !addressString.includes(searchLower) &&
        !descriptionMatch &&
        !featuresMatch &&
        !mlsMatch
      ) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort listings
 */
export type SortOption =
  | "price-asc"
  | "price-desc"
  | "beds-asc"
  | "beds-desc"
  | "newest";

export function sortListings(listings: Listing[], sort: SortOption): Listing[] {
  const sorted = [...listings];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "beds-asc":
      return sorted.sort((a, b) => a.bedrooms - b.bedrooms);
    case "beds-desc":
      return sorted.sort((a, b) => b.bedrooms - a.bedrooms);
    case "newest":
      return sorted.sort(
        (a, b) => (b.days_on_market ?? 0) - (a.days_on_market ?? 0)
      );
    default:
      return sorted;
  }
}

/**
 * Get unique cities from listings
 */
export function getUniqueCities(): string[] {
  const cities = new Set(data.listings.map((l) => l.address.city));
  return Array.from(cities).sort();
}

/**
 * Get price range from listings
 */
export function getPriceRange(): { min: number; max: number } {
  const prices = data.listings.map((l) => l.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

/**
 * Get brokerage info
 */
export function getBrokerage() {
  return data.brokerage;
}

/**
 * Get total listings count
 */
export function getListingsCount(): number {
  return data.total_listings;
}
