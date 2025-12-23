"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw } from "lucide-react";
import { PropertyType, ListingStatus } from "@/lib/types/listing";
import { formatPrice } from "@/lib/utils/formatters";

const propertyTypes: PropertyType[] = [
  "Single Family Home",
  "Multi-Family Home",
  "Condominium",
  "Land",
];

const statusOptions: ListingStatus[] = ["Active", "Pending"];

const bedroomOptions = ["Any", "1+", "2+", "3+", "4+", "5+"];
const bathroomOptions = ["Any", "1+", "2+", "3+", "4+"];

// Price range for the slider (based on actual listings: $59,995 - $739,000)
const MIN_PRICE = 0;
const MAX_PRICE = 800000;
const PRICE_STEP = 10000;

interface FilterPanelProps {
  className?: string;
}

export function FilterPanel({ className }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const currentMinPrice = Number(searchParams.get("minPrice")) || MIN_PRICE;
  const currentMaxPrice = Number(searchParams.get("maxPrice")) || MAX_PRICE;
  const currentBeds = searchParams.get("beds") || "";
  const currentBaths = searchParams.get("baths") || "";
  const currentType = searchParams.get("type") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentQuery = searchParams.get("q") || "";

  // Create a new URLSearchParams with updated values
  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "Any") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      return params.toString();
    },
    [searchParams]
  );

  const updateFilter = (key: string, value: string | null) => {
    const queryString = createQueryString({ [key]: value });
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const updatePriceRange = (values: number[]) => {
    const [min, max] = values;
    const queryString = createQueryString({
      minPrice: min > MIN_PRICE ? min.toString() : null,
      maxPrice: max < MAX_PRICE ? max.toString() : null,
    });
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  // Check if any filters are active
  const hasActiveFilters =
    currentMinPrice > MIN_PRICE ||
    currentMaxPrice < MAX_PRICE ||
    currentBeds ||
    currentBaths ||
    currentType ||
    currentStatus ||
    currentQuery;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="px-2">
            <Slider
              value={[currentMinPrice, currentMaxPrice]}
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={PRICE_STEP}
              onValueCommit={updatePriceRange}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(currentMinPrice)}</span>
            <span>{formatPrice(currentMaxPrice)}</span>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label htmlFor="beds">Bedrooms</Label>
          <Select
            value={currentBeds || "Any"}
            onValueChange={(value) => updateFilter("beds", value)}
          >
            <SelectTrigger id="beds">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              {bedroomOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <Label htmlFor="baths">Bathrooms</Label>
          <Select
            value={currentBaths || "Any"}
            onValueChange={(value) => updateFilter("baths", value)}
          >
            <SelectTrigger id="baths">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              {bathroomOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Property Type</Label>
          <Select
            value={currentType || "all"}
            onValueChange={(value) =>
              updateFilter("type", value === "all" ? null : value)
            }
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={currentStatus || "all"}
            onValueChange={(value) =>
              updateFilter("status", value === "all" ? null : value)
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <Label>Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {currentQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {currentQuery}
                  <button
                    onClick={() => updateFilter("q", null)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(currentMinPrice > MIN_PRICE || currentMaxPrice < MAX_PRICE) && (
                <Badge variant="secondary" className="gap-1">
                  {formatPrice(currentMinPrice)} - {formatPrice(currentMaxPrice)}
                  <button
                    onClick={() =>
                      router.push(
                        `${pathname}?${createQueryString({
                          minPrice: null,
                          maxPrice: null,
                        })}`,
                        { scroll: false }
                      )
                    }
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {currentBeds && (
                <Badge variant="secondary" className="gap-1">
                  {currentBeds} Beds
                  <button
                    onClick={() => updateFilter("beds", null)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {currentBaths && (
                <Badge variant="secondary" className="gap-1">
                  {currentBaths} Baths
                  <button
                    onClick={() => updateFilter("baths", null)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {currentType && (
                <Badge variant="secondary" className="gap-1">
                  {currentType}
                  <button
                    onClick={() => updateFilter("type", null)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {currentStatus && (
                <Badge variant="secondary" className="gap-1">
                  {currentStatus}
                  <button
                    onClick={() => updateFilter("status", null)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
