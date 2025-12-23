"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Bed, Bath, Square, MapPin, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Listing } from "@/lib/types";
import {
  formatPrice,
  formatSquareFeet,
  formatShortAddress,
  getStatusColor,
} from "@/lib/utils/formatters";

interface PropertyCardProps {
  listing: Listing;
  priority?: boolean;
}

export function PropertyCard({ listing, priority = false }: PropertyCardProps) {
  const hasImages = listing.images && listing.images.length > 0;
  const imageUrl = hasImages
    ? listing.images![0]
    : "/placeholder-property.jpg";

  return (
    <Link href={`/listing/${listing.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="group"
      >
        <Card className="overflow-hidden border-0 shadow-md transition-shadow duration-300 hover:shadow-xl">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {hasImages ? (
              <Image
                src={imageUrl}
                alt={`${listing.address.street} - ${listing.property_type}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={priority}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium text-gray-500">
                    Image Coming Soon
                  </p>
                </div>
              </div>
            )}

            {/* Status Badge */}
            <Badge
              className={`absolute left-3 top-3 ${getStatusColor(listing.status)} text-white`}
            >
              {listing.status}
            </Badge>

            {/* Image Count */}
            {hasImages && listing.images!.length > 1 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                <Camera className="h-3 w-3" />
                {listing.images!.length}
              </div>
            )}

            {/* Price Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
              <p className="text-2xl font-bold text-white">
                {formatPrice(listing.price)}
              </p>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4">
            {/* Address */}
            <div className="flex items-start gap-1.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium leading-tight">
                  {listing.address.street}
                </p>
                <p className="text-sm text-muted-foreground">
                  {listing.address.city}, {listing.address.state}{" "}
                  {listing.address.zip}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              {listing.bedrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>
                    {listing.bedrooms} bed{listing.bedrooms !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {listing.bathrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>
                    {listing.bathrooms} bath{listing.bathrooms !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {listing.square_feet && (
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  <span>{formatSquareFeet(listing.square_feet)}</span>
                </div>
              )}
            </div>

            {/* Property Type & MLS */}
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{listing.property_type}</span>
              <span>MLS# {listing.mls_number}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
