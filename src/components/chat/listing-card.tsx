"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, Bed, Bath, Square, ExternalLink } from "lucide-react";

interface ListingCardProps {
  listing: {
    id: string;
    address: string;
    price: number;
    priceFormatted: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet?: number;
    propertyType: string;
    status: string;
    mainImage: string | null;
    hasVirtualTour?: boolean;
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-32 bg-gray-100">
        {listing.mainImage ? (
          <Image
            src={listing.mainImage}
            alt={listing.address}
            fill
            className="object-cover"
            sizes="(max-width: 400px) 100vw, 320px"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Home className="w-10 h-10" />
          </div>
        )}
        {/* Status badge */}
        <span
          className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded ${
            listing.status === "Active"
              ? "bg-green-500 text-white"
              : "bg-yellow-500 text-white"
          }`}
        >
          {listing.status}
        </span>
        {listing.hasVirtualTour && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded bg-[#0033A0] text-white">
            3D Tour
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-lg font-bold text-[#0033A0]">{listing.priceFormatted}</p>
        <p className="text-sm text-gray-600 truncate mt-1">{listing.address}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5" />
            {listing.bedrooms} bd
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5" />
            {listing.bathrooms} ba
          </span>
          {listing.squareFeet && (
            <span className="flex items-center gap-1">
              <Square className="w-3.5 h-3.5" />
              {listing.squareFeet.toLocaleString()} sqft
            </span>
          )}
        </div>

        {/* View button */}
        <Link
          href={`/listing/${listing.id}`}
          className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#C4A35A] hover:bg-[#B39349] rounded transition-colors"
        >
          View Details
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

// Compact version for multiple results
export function ListingCardCompact({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="flex gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-[#C4A35A] transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        {listing.mainImage ? (
          <Image
            src={listing.mainImage}
            alt={listing.address}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Home className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#0033A0]">{listing.priceFormatted}</p>
        <p className="text-xs text-gray-600 truncate">{listing.address}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span>{listing.bedrooms} bd</span>
          <span>{listing.bathrooms} ba</span>
          {listing.squareFeet && <span>{listing.squareFeet.toLocaleString()} sqft</span>}
        </div>
      </div>
    </Link>
  );
}
