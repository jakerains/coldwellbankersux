"use client";

import * as React from "react";
import Image from "next/image";
import { MapPin, Bed, Bath, Maximize, Home } from "lucide-react";
import { cn } from "@/lib/utils";

// Known whitelisted domains from next.config.ts
const WHITELISTED_DOMAINS = [
  "moxi.onl",
  "coldwellbankerabr.com",
  "matterport.com",
  "rdcpix.com",
  "cdn-redfin.com",
  "zillowstatic.com",
  "unsplash.com",
  "homes.com",
  "realtor.com",
  "trulia.com",
  "redfin.com",
];

// Check if URL is from a whitelisted domain
function isWhitelistedDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return WHITELISTED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

// Filter out invalid/placeholder images
function isValidImageUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  // Filter out spacer.gif, 1x1 pixels, and other placeholder patterns
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

// Safe image component with error handling
interface SafePropertyImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  fallbackClassName?: string;
}

function SafePropertyImage({
  src,
  alt,
  fill = true,
  sizes,
  className,
  fallbackClassName,
}: SafePropertyImageProps) {
  const [hasError, setHasError] = React.useState(false);
  const validSrc = isValidImageUrl(src) ? src : null;
  const useNextImage = validSrc && isWhitelistedDomain(validSrc);

  // Reset error state when src changes
  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!validSrc || hasError) {
    return (
      <div className={cn("flex items-center justify-center h-full bg-gray-100 text-gray-300", fallbackClassName)}>
        <Home className="w-12 h-12" />
      </div>
    );
  }

  if (useNextImage) {
    return (
      <Image
        src={validSrc}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        onError={() => setHasError(true)}
      />
    );
  }

  // For non-whitelisted domains, use native img to avoid Next.js config errors
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={validSrc}
      alt={alt}
      className={cn("absolute inset-0 w-full h-full object-cover", className)}
      onError={() => setHasError(true)}
    />
  );
}

interface PropertyListingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl?: string | null;
  price: string | number;
  address: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  onLearnMore?: () => void;
}

// Full property card matching 21st.dev design
export const PropertyListingCard = React.forwardRef<HTMLDivElement, PropertyListingCardProps>(
  (
    {
      className,
      imageUrl,
      price,
      address,
      beds,
      baths,
      sqft,
      onLearnMore,
      ...props
    },
    ref
  ) => {
    const formattedPrice = typeof price === "number"
      ? `$${price.toLocaleString()}`
      : price;

    return (
      <div
        ref={ref}
        className={cn(
          "w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow",
          className
        )}
        {...props}
      >
        {/* Property Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <SafePropertyImage
            src={imageUrl}
            alt={address}
            sizes="(max-width: 400px) 100vw, 384px"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Card Content */}
        <div className="flex flex-col gap-3 p-4">
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#0033A0]">
              {formattedPrice}
            </span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
            <p className="text-sm text-gray-600 line-clamp-2">{address}</p>
          </div>

          {/* Property Details */}
          {(beds || baths || sqft) && (
            <div className="flex items-center gap-4 text-sm">
              {beds && (
                <div className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{beds}</span>
                  <span className="text-gray-500">Beds</span>
                </div>
              )}
              {baths && (
                <div className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{baths}</span>
                  <span className="text-gray-500">Baths</span>
                </div>
              )}
              {sqft && (
                <div className="flex items-center gap-1.5">
                  <Maximize className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{sqft.toLocaleString()}</span>
                  <span className="text-gray-500">sqft</span>
                </div>
              )}
            </div>
          )}

          {/* More Info Button */}
          <button
            onClick={onLearnMore}
            className="mt-2 w-full rounded-md px-4 py-2.5 text-sm font-medium text-white bg-[#0033A0] hover:bg-[#002780] transition-colors"
          >
            More Info
          </button>
        </div>
      </div>
    );
  }
);

PropertyListingCard.displayName = "PropertyListingCard";

// Compact inline version for smaller displays
interface PropertyCardCompactProps {
  imageUrl?: string | null;
  price: string | number;
  address: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  onLearnMore?: () => void;
}

export function PropertyCardCompact({
  imageUrl,
  price,
  address,
  beds,
  baths,
  sqft,
  onLearnMore,
}: PropertyCardCompactProps) {
  const formattedPrice = typeof price === "number"
    ? `$${price.toLocaleString()}`
    : price;

  return (
    <button
      onClick={onLearnMore}
      className="w-full flex gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-[#0033A0] hover:shadow-sm transition-all text-left"
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        <SafePropertyImage
          src={imageUrl}
          alt={address}
          sizes="80px"
          className="object-cover"
          fallbackClassName="!w-8 !h-8"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-0.5">
        <p className="text-base font-bold text-[#0033A0]">{formattedPrice}</p>
        <p className="text-xs text-gray-600 truncate mt-0.5">{address}</p>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
          {beds && (
            <span className="flex items-center gap-0.5">
              <Bed className="w-3 h-3" />
              {beds} bd
            </span>
          )}
          {baths && (
            <span className="flex items-center gap-0.5">
              <Bath className="w-3 h-3" />
              {baths} ba
            </span>
          )}
          {sqft && (
            <span className="flex items-center gap-0.5">
              <Maximize className="w-3 h-3" />
              {sqft.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// Grid of property cards - uses full cards for better display
interface PropertyGridProps {
  properties: Array<{
    id?: string;
    imageUrl?: string | null;
    mainImage?: string | null;
    price: string | number;
    priceFormatted?: string;
    address: string;
    beds?: number;
    bedrooms?: number;
    baths?: number;
    bathrooms?: number;
    sqft?: number;
    squareFeet?: number;
    propertyType?: string;
    description?: string;
    title?: string;
  }>;
  onPropertyClick?: (property: PropertyGridProps["properties"][0]) => void;
  variant?: "full" | "compact";
}

export function PropertyGrid({ properties, onPropertyClick, variant = "full" }: PropertyGridProps) {
  if (!properties || properties.length === 0) {
    return null;
  }

  // Use full cards in responsive grid for fullscreen mode
  if (variant === "full") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {properties.map((property, index) => (
          <PropertyListingCard
            key={property.id || index}
            imageUrl={property.imageUrl || property.mainImage}
            price={property.priceFormatted || property.price}
            address={property.address}
            beds={property.beds || property.bedrooms}
            baths={property.baths || property.bathrooms}
            sqft={property.sqft || property.squareFeet}
            onLearnMore={() => onPropertyClick?.(property)}
          />
        ))}
      </div>
    );
  }

  // Compact variant for very constrained spaces
  return (
    <div className="space-y-2">
      {properties.map((property, index) => (
        <PropertyCardCompact
          key={property.id || index}
          imageUrl={property.imageUrl || property.mainImage}
          price={property.priceFormatted || property.price}
          address={property.address}
          beds={property.beds || property.bedrooms}
          baths={property.baths || property.bathrooms}
          sqft={property.sqft || property.squareFeet}
          onLearnMore={() => onPropertyClick?.(property)}
        />
      ))}
    </div>
  );
}

// Legacy export for backwards compatibility
export const PropertyCard = PropertyListingCard;
