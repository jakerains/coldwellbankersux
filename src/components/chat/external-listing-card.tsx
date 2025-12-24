"use client";

import { useState } from "react";
import { Home, Bed, Bath, Square } from "lucide-react";

// Filter out invalid/placeholder images
function isValidImageUrl(url: string | undefined): url is string {
  if (!url) return false;
  const invalidPatterns = [
    "spacer.gif",
    "pixel.gif",
    "1x1",
    "blank.png",
    "placeholder",
    "no-image",
    "noimage",
  ];
  const lowerUrl = url.toLowerCase();
  return !invalidPatterns.some((pattern) => lowerUrl.includes(pattern));
}

interface ExternalListingProps {
  listing: {
    title: string;
    address: string;
    price: string;
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    propertyType?: string;
    description: string;
    imageUrl?: string;
  };
  onClick?: () => void;
}

// Styled to match ListingCardCompact - same uniform look
export function ExternalListingCard({ listing, onClick }: ExternalListingProps) {
  const [imageError, setImageError] = useState(false);
  const validImageUrl = isValidImageUrl(listing.imageUrl) ? listing.imageUrl : null;
  const showImage = validImageUrl && !imageError;

  return (
    <button
      onClick={onClick}
      className="w-full flex gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-[#C4A35A] transition-colors text-left"
    >
      {/* Thumbnail - using img for external URLs from various real estate sites */}
      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={validImageUrl}
            alt={listing.address || listing.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Home className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#0033A0]">{listing.price || "Contact for Price"}</p>
        <p className="text-xs text-gray-600 truncate">{listing.address || listing.title}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          {listing.bedrooms && (
            <span className="flex items-center gap-0.5">
              <Bed className="w-3 h-3" />
              {listing.bedrooms} bd
            </span>
          )}
          {listing.bathrooms && (
            <span className="flex items-center gap-0.5">
              <Bath className="w-3 h-3" />
              {listing.bathrooms} ba
            </span>
          )}
          {listing.squareFeet && (
            <span className="flex items-center gap-0.5">
              <Square className="w-3 h-3" />
              {listing.squareFeet.toLocaleString()} sqft
            </span>
          )}
          {listing.propertyType && !listing.bedrooms && !listing.bathrooms && (
            <span>{listing.propertyType}</span>
          )}
        </div>
      </div>
    </button>
  );
}

interface ExternalListingsGridProps {
  listings: Array<{
    title: string;
    address: string;
    price: string;
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    propertyType?: string;
    description: string;
    imageUrl?: string;
  }>;
  onListingClick?: (listing: ExternalListingsGridProps["listings"][0]) => void;
}

export function ExternalListingsGrid({ listings, onListingClick }: ExternalListingsGridProps) {
  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs text-gray-500">
        Found {listings.length} {listings.length === 1 ? "property" : "properties"}
      </p>
      <div className="space-y-2">
        {listings.map((listing, index) => (
          <ExternalListingCard
            key={index}
            listing={listing}
            onClick={() => onListingClick?.(listing)}
          />
        ))}
      </div>
    </div>
  );
}
