import { Suspense } from "react";
import { Metadata } from "next";
import { filterListings, sortListings, SortOption } from "@/lib/data/listings";
import { PropertyType, ListingStatus } from "@/lib/types/listing";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchPageContent } from "./search-content";

export const metadata: Metadata = {
  title: "Property Search | Coldwell Banker Associated Brokers Realty",
  description:
    "Search homes for sale in Sioux City, IA and the greater Siouxland area. Filter by price, bedrooms, bathrooms, and property type.",
};


interface SearchParams {
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  beds?: string;
  baths?: string;
  type?: string;
  status?: string;
  city?: string;
  sort?: string;
}

// Next.js 16: searchParams is now async
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Parse filter values from URL
  const filters = {
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minBeds: params.beds ? parseInt(params.beds.replace("+", "")) : undefined,
    minBaths: params.baths ? parseInt(params.baths.replace("+", "")) : undefined,
    propertyType: params.type as PropertyType | undefined,
    status: params.status as ListingStatus | undefined,
    city: params.city,
    search: params.q,
  };

  const sortOption = (params.sort as SortOption) || "newest";

  // Get filtered and sorted listings
  const filteredListings = filterListings(filters);
  const sortedListings = sortListings(filteredListings, sortOption);

  const hasFilters = Object.values(params).some((value) => value);

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Property Search</h1>
        <p className="mt-2 text-muted-foreground">
          Find your perfect home in Sioux City and the greater Siouxland area
        </p>
      </div>

      {/* Wrap entire interactive content in Suspense for Next.js 16 */}
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchPageContent
          listings={sortedListings}
          hasFilters={hasFilters}
        />
      </Suspense>
    </div>
  );
}

function SearchPageSkeleton() {
  return (
    <div>
      {/* Search bar skeleton */}
      <Skeleton className="h-10 w-full mb-6" />

      <div className="flex gap-8">
        {/* Filter panel skeleton */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="space-y-6">
            <Skeleton className="h-6 w-20" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </aside>

        {/* Main content skeleton */}
        <main className="flex-1 min-w-0">
          <div className="flex justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
