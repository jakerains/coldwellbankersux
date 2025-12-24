import { tool } from "ai";
import { z } from "zod";
import {
  filterListings,
  getListingById,
  getUniqueCities,
  getPriceRange,
  getBrokerage,
} from "@/lib/data/listings";
import type { Listing } from "@/lib/types";

// Helper to format a listing for AI response
function formatListingPreview(listing: Listing) {
  return {
    id: listing.id,
    address: `${listing.address.street}, ${listing.address.city}, ${listing.address.state}`,
    price: listing.price,
    priceFormatted: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(listing.price),
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    squareFeet: listing.square_feet,
    propertyType: listing.property_type,
    status: listing.status,
    mainImage: listing.images?.[0] || null,
    hasVirtualTour: !!listing.virtual_tour && typeof listing.virtual_tour === "string",
  };
}

// Helper to format full listing details
function formatListingDetails(listing: Listing) {
  return {
    ...formatListingPreview(listing),
    description: listing.description,
    features: listing.features,
    yearBuilt: listing.year_built,
    lotSize: listing.lot_size,
    style: listing.style,
    basement: listing.basement,
    heatingCooling: listing.heating_cooling,
    schools: listing.schools,
    virtualTourUrl: typeof listing.virtual_tour === "string" ? listing.virtual_tour : null,
    images: listing.images || [],
    agent: {
      name: listing.agent.name,
      title: listing.agent.title,
      phone: listing.agent.phone,
      email: listing.agent.email,
      company: listing.agent.company,
    },
    mlsNumber: listing.mls_number,
    daysOnMarket: listing.days_on_market,
  };
}

// Input schemas
const searchListingsSchema = z.object({
  minPrice: z.number().optional().describe("Minimum price in dollars"),
  maxPrice: z.number().optional().describe("Maximum price in dollars"),
  minBeds: z.number().optional().describe("Minimum number of bedrooms"),
  maxBeds: z.number().optional().describe("Maximum number of bedrooms"),
  minBaths: z.number().optional().describe("Minimum number of bathrooms"),
  maxBaths: z.number().optional().describe("Maximum number of bathrooms"),
  propertyType: z
    .enum(["Single Family Home", "Multi-Family Home", "Condominium", "Land"])
    .optional()
    .describe("Type of property"),
  city: z.string().optional().describe("City name to filter by"),
  search: z
    .string()
    .optional()
    .describe("General search term for address, features, or description"),
});

const listingIdSchema = z.object({
  listingId: z.string().describe("The ID of the listing"),
});

const areaInfoSchema = z.object({
  topic: z
    .enum(["neighborhoods", "schools", "market", "general"])
    .describe("The topic to get information about"),
});

const initiateContactSchema = z.object({
  listingId: z.string().optional().describe("The ID of a specific listing, if applicable"),
  intent: z
    .enum(["viewing", "general_inquiry", "selling", "buying"])
    .describe("What the user wants to do"),
});

export const searchListings = tool({
  description: `Search for property listings based on user criteria. Use this when users describe what they're looking for in a home. Returns up to 5 matching properties with basic info.`,
  inputSchema: searchListingsSchema,
  execute: async (params) => {
    const results = filterListings({
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      minBeds: params.minBeds,
      maxBeds: params.maxBeds,
      minBaths: params.minBaths,
      maxBaths: params.maxBaths,
      propertyType: params.propertyType,
      city: params.city,
      search: params.search,
      status: "Active", // Only show active listings
    });

    // Limit to 5 results
    const limitedResults = results.slice(0, 5);

    return {
      totalFound: results.length,
      showing: limitedResults.length,
      hasMore: results.length > 5,
      listings: limitedResults.map(formatListingPreview),
      availableCities: getUniqueCities(),
      priceRange: getPriceRange(),
    };
  },
});

export const getListingDetails = tool({
  description: `Get detailed information about a specific property listing. Use when a user wants to know more about a particular property.`,
  inputSchema: listingIdSchema,
  execute: async ({ listingId }) => {
    const listing = getListingById(listingId);

    if (!listing) {
      return {
        found: false,
        error: "Listing not found. It may have been sold or removed.",
      };
    }

    return {
      found: true,
      listing: formatListingDetails(listing),
    };
  },
});

export const getAgentContact = tool({
  description: `Get the contact information for a listing's agent. Use when a user wants to schedule a viewing or contact an agent.`,
  inputSchema: listingIdSchema,
  execute: async ({ listingId }) => {
    const listing = getListingById(listingId);

    if (!listing) {
      return {
        found: false,
        error: "Listing not found.",
      };
    }

    const brokerage = getBrokerage();

    return {
      found: true,
      agent: {
        name: listing.agent.name,
        title: listing.agent.title,
        phone: listing.agent.phone,
        email: listing.agent.email,
        company: listing.agent.company || brokerage.name,
      },
      property: {
        address: `${listing.address.street}, ${listing.address.city}`,
        mlsNumber: listing.mls_number,
      },
      brokerage: {
        name: brokerage.name,
        phone: brokerage.phone,
        email: brokerage.email,
      },
      suggestion: `To schedule a viewing, you can call ${listing.agent.name} directly at ${listing.agent.phone || brokerage.phone} or email ${listing.agent.email || brokerage.email}. Mention you're interested in MLS# ${listing.mls_number}.`,
    };
  },
});

export const getAreaInfo = tool({
  description: `Get information about the Sioux City, Iowa area including neighborhoods, schools, and local amenities. Use when users ask about the area, schools, or community features.`,
  inputSchema: areaInfoSchema,
  execute: async ({ topic }) => {
    const cities = getUniqueCities();
    const priceRange = getPriceRange();
    const brokerage = getBrokerage();

    const info: Record<string, object> = {
      neighborhoods: {
        overview:
          "Sioux City and the surrounding Siouxland area offers diverse neighborhoods from historic districts to new developments.",
        coveredAreas: cities,
        highlights: [
          "Morningside - Historic charm with mature trees and walkable streets",
          "Northside - Family-friendly with excellent schools",
          "South Sioux City - Growing community in Nebraska with new construction",
          "Dakota Dunes - Upscale development with golf course and river views",
          "Le Mars - The Ice Cream Capital of the World, quiet small-town living",
        ],
      },
      schools: {
        overview:
          "The area is served by several school districts including Sioux City Community School District, South Sioux City Community Schools, and several private schools.",
        publicDistricts: [
          "Sioux City Community School District",
          "South Sioux City Community Schools",
          "Le Mars Community School District",
          "Sergeant Bluff-Luton CSD",
        ],
        note: "Each listing includes information about nearby schools. Ask about a specific property to see its assigned schools.",
      },
      market: {
        overview: "The Siouxland real estate market offers excellent value compared to national averages.",
        currentPriceRange: {
          min: priceRange.min,
          max: priceRange.max,
          formatted: `$${(priceRange.min / 1000).toFixed(0)}K - $${(priceRange.max / 1000).toFixed(0)}K`,
        },
        areasServed: cities,
        marketTrends: [
          "Steady appreciation in established neighborhoods",
          "New construction in suburban areas",
          "Strong rental market near colleges",
          "Growing demand for homes with acreage",
        ],
      },
      general: {
        overview:
          "Sioux City is a tri-state metro area where Iowa, Nebraska, and South Dakota meet along the Missouri River.",
        population: "Approximately 85,000 in Sioux City, 145,000 in metro area",
        economy:
          "Major employers include Tyson Foods, MercyOne, UnityPoint Health, and various manufacturing companies.",
        recreation: [
          "Missouri River access for boating and fishing",
          "Stone State Park and multiple city parks",
          "Orpheum Theatre and entertainment district",
          "Sioux City Art Center",
          "Dorothy Pecaut Nature Center",
        ],
        brokerage: {
          name: brokerage.name,
          contact: brokerage.phone,
        },
      },
    };

    return info[topic] || info.general;
  },
});

export const initiateContact = tool({
  description: `Generate contact information and next steps for scheduling a property viewing. Use when users express they want to see a property or contact someone about it.`,
  inputSchema: initiateContactSchema,
  execute: async ({ listingId, intent }) => {
    const brokerage = getBrokerage();
    let listing = null;

    if (listingId) {
      listing = getListingById(listingId);
    }

    const response: {
      intent: string;
      nextSteps: string[];
      contacts: {
        type: string;
        name: string;
        phone?: string;
        email?: string;
      }[];
      listingInfo?: {
        address: string;
        mlsNumber: string;
      };
    } = {
      intent,
      nextSteps: [],
      contacts: [],
    };

    if (listing) {
      response.listingInfo = {
        address: `${listing.address.street}, ${listing.address.city}`,
        mlsNumber: listing.mls_number,
      };

      response.contacts.push({
        type: "Listing Agent",
        name: listing.agent.name,
        phone: listing.agent.phone,
        email: listing.agent.email,
      });
    }

    response.contacts.push({
      type: "Brokerage Office",
      name: brokerage.name,
      phone: brokerage.phone,
      email: brokerage.email,
    });

    switch (intent) {
      case "viewing":
        response.nextSteps = [
          `Call the listing agent${listing ? ` (${listing.agent.name})` : ""} to schedule a showing`,
          `Have MLS# ${listing?.mls_number || "ready"} when you call`,
          "Prepare any questions about the property",
          "Consider getting pre-approved for financing before viewing",
        ];
        break;
      case "selling":
        response.nextSteps = [
          "Contact our office for a free home valuation",
          "We'll discuss your timeline and goals",
          "Get tips on preparing your home for sale",
          "Review our marketing strategy",
        ];
        break;
      case "buying":
        response.nextSteps = [
          "Get pre-approved for a mortgage to know your budget",
          "Make a list of must-haves vs nice-to-haves",
          "Contact an agent to start your home search",
          "We can set up alerts for new listings matching your criteria",
        ];
        break;
      default:
        response.nextSteps = [
          "Call or email us with your questions",
          "We're happy to help with any real estate needs",
          "No obligation - just friendly, expert advice",
        ];
    }

    return response;
  },
});

// Export all tools as an object for use in the API route
export const aiTools = {
  searchListings,
  getListingDetails,
  getAgentContact,
  getAreaInfo,
  initiateContact,
};
