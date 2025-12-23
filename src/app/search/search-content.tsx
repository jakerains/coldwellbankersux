"use client";

import { PropertyGrid } from "@/components/property";
import { FilterPanel, SearchBar, SortDropdown, MobileFilterSheet } from "@/components/search";
import { Listing } from "@/lib/types/listing";

interface SearchPageContentProps {
  listings: Listing[];
  hasFilters: boolean;
}

export function SearchPageContent({ listings, hasFilters }: SearchPageContentProps) {
  return (
    <>
      {/* Search Bar */}
      <SearchBar className="mb-6" />

      <div className="flex gap-8">
        {/* Desktop Filter Panel */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterPanel />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Results Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <MobileFilterSheet />
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {listings.length}
                </span>{" "}
                {listings.length === 1 ? "property" : "properties"} found
                {hasFilters && " matching your criteria"}
              </p>
            </div>
            <SortDropdown />
          </div>

          {/* Property Grid */}
          {listings.length > 0 ? (
            <PropertyGrid listings={listings} />
          ) : (
            <NoResultsMessage hasFilters={hasFilters} />
          )}
        </main>
      </div>
    </>
  );
}

function NoResultsMessage({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
        <svg
          className="h-8 w-8 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold mb-2">No properties found</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        {hasFilters
          ? "Try adjusting your filters or search criteria to see more results."
          : "There are no properties available at this time. Please check back later."}
      </p>
    </div>
  );
}
