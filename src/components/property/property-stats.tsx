import { Bed, Bath, Square, Calendar, Home, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Listing } from "@/lib/types/listing";
import { formatPrice, formatSquareFeet, getStatusColor } from "@/lib/utils/formatters";

interface PropertyStatsProps {
  listing: Listing;
}

export function PropertyStats({ listing }: PropertyStatsProps) {
  const statusColor = getStatusColor(listing.status);

  return (
    <Card>
      <CardContent className="p-6">
        {/* Price and Status */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(listing.price)}
            </p>
            {listing.square_feet && listing.square_feet > 0 && (
              <p className="text-sm text-muted-foreground">
                ${Math.round(listing.price / listing.square_feet)}/sqft
              </p>
            )}
          </div>
          <Badge className={statusColor}>{listing.status}</Badge>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Bed className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">{listing.bedrooms}</p>
              <p className="text-xs text-muted-foreground">Bedrooms</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Bath className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">{listing.bathrooms}</p>
              <p className="text-xs text-muted-foreground">Bathrooms</p>
            </div>
          </div>
          {listing.square_feet && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Square className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">
                  {formatSquareFeet(listing.square_feet)}
                </p>
                <p className="text-xs text-muted-foreground">Sq Ft</p>
              </div>
            </div>
          )}
          {listing.year_built && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">{listing.year_built}</p>
                <p className="text-xs text-muted-foreground">Year Built</p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Details */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Home className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium">{listing.property_type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">MLS#:</span>
            <span className="font-medium">{listing.mls_number}</span>
          </div>
          {listing.lot_size && (
            <div className="flex items-center gap-2 text-sm">
              <Square className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Lot Size:</span>
              <span className="font-medium">{listing.lot_size}</span>
            </div>
          )}
          {listing.heating_cooling && (
            <div className="flex items-center gap-2 text-sm">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">HVAC:</span>
              <span className="font-medium">{listing.heating_cooling}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
