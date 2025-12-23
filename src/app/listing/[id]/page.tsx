import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Share2 } from "lucide-react";
import { getListingById, getListings } from "@/lib/data/listings";
import { formatAddress, formatPrice } from "@/lib/utils/formatters";
import {
  PropertyGallery,
  PropertyStats,
  PropertyFeatures,
  AgentContactCard,
  PropertyGrid,
} from "@/components/property";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all listings
export async function generateStaticParams() {
  const listings = getListings();
  return listings.map((listing) => ({
    id: listing.id,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    return {
      title: "Property Not Found | Coldwell Banker Associated Brokers Realty",
    };
  }

  const address = formatAddress(listing.address);

  return {
    title: `${address} | Coldwell Banker Associated Brokers Realty`,
    description: listing.description?.slice(0, 160) || `${listing.property_type} for sale in ${listing.address.city}, ${listing.address.state}. ${listing.bedrooms} beds, ${listing.bathrooms} baths. Listed at ${formatPrice(listing.price)}.`,
    openGraph: {
      title: address,
      description: `${listing.property_type} - ${formatPrice(listing.price)}`,
      images: listing.images?.[0] ? [listing.images[0]] : [],
    },
  };
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    notFound();
  }

  const address = formatAddress(listing.address);

  // Get similar listings (same city, different listing)
  const allListings = getListings();
  const similarListings = allListings
    .filter(
      (l) =>
        l.id !== listing.id &&
        l.address.city === listing.address.city
    )
    .slice(0, 3);

  // Normalize virtual tour URL
  const virtualTourUrl = typeof listing.virtual_tour === "string" ? listing.virtual_tour : null;

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      {/* Back Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/search">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Address Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">{address}</h1>
        <p className="mt-1 text-muted-foreground">
          {listing.address.city}, {listing.address.state} {listing.address.zip}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <PropertyGallery images={listing.images} address={address} />

          {/* Description */}
          {listing.description && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">About This Property</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          )}

          {/* Features */}
          {listing.features && listing.features.length > 0 && (
            <>
              <Separator />
              <PropertyFeatures features={listing.features} />
            </>
          )}

          {/* Virtual Tour */}
          {virtualTourUrl && (
            <>
              <Separator />
              <div>
                <h2 className="mb-4 text-xl font-semibold">Virtual Tour</h2>
                <Button asChild>
                  <a
                    href={virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View 3D Tour
                  </a>
                </Button>
              </div>
            </>
          )}

          {/* Property Details Table */}
          <Separator />
          <div>
            <h2 className="mb-4 text-xl font-semibold">Property Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailRow label="Property Type" value={listing.property_type} />
              <DetailRow label="MLS Number" value={listing.mls_number} />
              <DetailRow label="Bedrooms" value={listing.bedrooms.toString()} />
              <DetailRow label="Bathrooms" value={listing.bathrooms.toString()} />
              {listing.square_feet && (
                <DetailRow
                  label="Square Feet"
                  value={listing.square_feet.toLocaleString()}
                />
              )}
              {listing.lot_size && (
                <DetailRow label="Lot Size" value={listing.lot_size} />
              )}
              {listing.year_built && (
                <DetailRow label="Year Built" value={listing.year_built.toString()} />
              )}
              {listing.heating_cooling && (
                <DetailRow label="Heating/Cooling" value={listing.heating_cooling} />
              )}
              {listing.basement && (
                <DetailRow label="Basement" value={listing.basement} />
              )}
              <DetailRow label="Status" value={listing.status} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Property Stats Card */}
            <PropertyStats listing={listing} />

            {/* Agent Contact Card */}
            <AgentContactCard
              agent={listing.agent}
              listingAddress={address}
            />
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarListings.length > 0 && (
        <section className="mt-16">
          <Separator className="mb-8" />
          <h2 className="mb-6 text-2xl font-bold">Similar Properties</h2>
          <PropertyGrid listings={similarListings} />
        </section>
      )}
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
