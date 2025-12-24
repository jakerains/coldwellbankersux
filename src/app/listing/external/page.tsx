"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Bed, Bath, Square, Home, MapPin, MessageSquare, Phone, Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Type for the external listing data we pass via URL
interface ExternalListingData {
  address: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  yearBuilt?: number;
  propertyType?: string;
  description?: string;
  imageUrl?: string;
  title?: string;
  images?: string[];
}

// Known whitelisted domains for Next.js Image
const WHITELISTED_DOMAINS = [
  "moxi.onl", "coldwellbankerabr.com", "matterport.com", "rdcpix.com",
  "cdn-redfin.com", "zillowstatic.com", "unsplash.com", "homes.com",
  "realtor.com", "trulia.com", "redfin.com",
];

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

// Safe image component for external listings
function SafeListingImage({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);
  const useNextImage = isWhitelistedDomain(src);

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Home className="w-24 h-24 text-muted-foreground/30" />
      </div>
    );
  }

  if (useNextImage) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 66vw"
        priority
        onError={() => setHasError(true)}
      />
    );
  }

  // For non-whitelisted domains, use native img
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
}

// Image Gallery component for multiple photos
function ImageGallery({ images, address }: { images: string[]; address: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Filter out images that failed to load
  const validImages = images.filter((_, index) => !imageErrors.has(index));
  const validCurrentIndex = Math.min(currentIndex, validImages.length - 1);

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") setLightboxOpen(false);
  };

  if (validImages.length === 0) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted flex items-center justify-center">
        <Home className="w-24 h-24 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted group cursor-pointer"
        onClick={() => setLightboxOpen(true)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Open image gallery"
      >
        <SafeListingImage
          src={validImages[validCurrentIndex]}
          alt={`${address} - Photo ${validCurrentIndex + 1}`}
        />

        {/* Navigation arrows (only show if more than 1 image) */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
            {validCurrentIndex + 1} / {validImages.length}
          </div>
        )}

        {/* Click hint */}
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          Click to enlarge
        </div>
      </div>

      {/* Thumbnail strip (show if more than 1 image, up to 6) */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {validImages.slice(0, 6).map((img, index) => {
            const originalIndex = images.indexOf(img);
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden ${
                  index === validCurrentIndex
                    ? "ring-2 ring-primary ring-offset-2"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(originalIndex)}
                />
              </button>
            );
          })}
          {validImages.length > 6 && (
            <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">
              +{validImages.length - 6}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2"
                aria-label="Next image"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          {/* Main lightbox image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={validImages[validCurrentIndex]}
              alt={`${address} - Photo ${validCurrentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>

          {/* Image counter */}
          {validImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg">
              {validCurrentIndex + 1} / {validImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ExternalListingContent() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");

  // Decode the listing data from the URL
  let listing: ExternalListingData | null = null;
  try {
    if (encodedData) {
      listing = JSON.parse(decodeURIComponent(atob(encodedData)));
    }
  } catch (e) {
    console.error("Failed to decode listing data:", e);
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This listing may no longer be available.
          </p>
          <Button asChild>
            <Link href="/search">Browse All Listings</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/search">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Link>
        </Button>
      </div>

      {/* Address Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">{listing.address}</h1>
        {listing.propertyType && (
          <p className="mt-1 text-muted-foreground">{listing.propertyType}</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery or Single Image */}
          {listing.images && listing.images.length > 0 ? (
            <ImageGallery images={listing.images} address={listing.address} />
          ) : listing.imageUrl ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
              <SafeListingImage src={listing.imageUrl} alt={listing.address} />
            </div>
          ) : (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted flex items-center justify-center">
              <Home className="w-24 h-24 text-muted-foreground/30" />
            </div>
          )}

          {/* Description */}
          {listing.description && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">About This Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                {listing.description}
              </p>
            </div>
          )}

          {/* Property Details */}
          <Separator />
          <div>
            <h2 className="mb-4 text-xl font-semibold">Property Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {listing.bedrooms && (
                <DetailRow label="Bedrooms" value={listing.bedrooms.toString()} />
              )}
              {listing.bathrooms && (
                <DetailRow label="Bathrooms" value={listing.bathrooms.toString()} />
              )}
              {listing.squareFeet && (
                <DetailRow
                  label="Square Feet"
                  value={listing.squareFeet.toLocaleString()}
                />
              )}
              {listing.propertyType && (
                <DetailRow label="Property Type" value={listing.propertyType} />
              )}
              {listing.yearBuilt && (
                <DetailRow label="Year Built" value={listing.yearBuilt.toString()} />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Property Stats Card */}
            <Card>
              <CardContent className="p-6">
                {/* Price and Status */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      {listing.price}
                    </p>
                  </div>
                  <Badge className="bg-green-500">Active</Badge>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {listing.bedrooms && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Bed className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{listing.bedrooms}</p>
                        <p className="text-xs text-muted-foreground">Bedrooms</p>
                      </div>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Bath className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{listing.bathrooms}</p>
                        <p className="text-xs text-muted-foreground">Bathrooms</p>
                      </div>
                    </div>
                  )}
                  {listing.squareFeet && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Square className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {listing.squareFeet.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Sq Ft</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Details */}
                <div className="space-y-3 border-t pt-4">
                  {listing.yearBuilt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Built in {listing.yearBuilt}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{listing.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Agent Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Interested in this property?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Connect with one of our experienced agents to learn more about this
                  property and schedule a viewing.
                </p>

                <div className="space-y-2 pt-2">
                  <Button className="w-full" asChild>
                    <a href="tel:+17122555231">
                      <Phone className="mr-2 h-4 w-4" />
                      Call (712) 255-5231
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href={`/contact?property=${encodeURIComponent(
                        listing.address
                      )}&price=${encodeURIComponent(listing.price)}`}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Request More Info
                    </Link>
                  </Button>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    Coldwell Banker Associated Brokers Realty
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function ExternalListingPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 pt-32 pb-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      }
    >
      <ExternalListingContent />
    </Suspense>
  );
}
