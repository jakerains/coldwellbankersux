import { tool } from "ai";
import { z } from "zod";
import Firecrawl from "@mendable/firecrawl-js";
import {
  filterListings,
  getListingById,
  getUniqueCities,
  getPriceRange,
  getBrokerage,
} from "@/lib/data/listings";
import type { Listing } from "@/lib/types";

// Lazy initialization of Firecrawl client
let firecrawlClient: Firecrawl | null = null;

function getFirecrawl(): Firecrawl | null {
  if (!firecrawlClient && process.env.FIRECRAWL_API_KEY) {
    firecrawlClient = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
    console.log("[Firecrawl] Client initialized");
  }
  return firecrawlClient;
}

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
  description: `Get information about the Sioux City, Iowa area including neighborhoods, schools, market trends, cost of living, and local amenities. Use when users ask about the area, schools, or community features.`,
  inputSchema: areaInfoSchema,
  execute: async ({ topic }) => {
    const cities = getUniqueCities();
    const priceRange = getPriceRange();
    const brokerage = getBrokerage();

    const info: Record<string, object> = {
      neighborhoods: {
        overview:
          "Sioux City offers diverse neighborhoods catering to different lifestyles and budgets, from established historic areas to newer developments.",
        coveredAreas: cities,
        highlights: [
          "**Morningside & Leeds** - Mix of single-family homes and townhouses, attracting families and professionals seeking community-oriented environments",
          "**West Side & Riverside** - Established homes with mature landscaping and convenient access to local amenities",
          "**The Heights & Indian Hills** - Higher-end properties with proximity to newer developments and recreation facilities",
          "**Country Club area** - Upscale neighborhood with golf course access",
          "**Dakota Dunes** - Upscale development with golf course and Missouri River views",
          "**South Sioux City** - Growing Nebraska community with new construction options",
          "**Le Mars** - The Ice Cream Capital of the World, quiet small-town living 25 minutes away",
        ],
      },
      schools: {
        overview:
          "Sioux City offers quality K-12 education with schools rated between 6/10 and 8/10 on GreatSchools.",
        publicDistricts: [
          "Sioux City Community School District",
          "South Sioux City Community Schools",
          "Le Mars Community School District",
          "Sergeant Bluff-Luton CSD",
        ],
        topRatedSchools: [
          "Dakota City Elementary - 8/10 rating",
          "Perry Creek Elementary - 7/10 rating",
        ],
        note: "Each listing includes information about nearby schools. Ask about a specific property to see its assigned schools.",
      },
      market: {
        overview:
          "The Sioux City housing market is competitive yet affordable, with median prices 52% below the national average.",
        stats: {
          medianSalePrice: "$209,000",
          pricePerSqFt: "$135 (up 8% year-over-year)",
          daysOnMarket: "22-24 days average",
          saleToListRatio: "96.5% (some homes sell above list)",
        },
        currentPriceRange: {
          min: priceRange.min,
          max: priceRange.max,
          formatted: `$${(priceRange.min / 1000).toFixed(0)}K - $${(priceRange.max / 1000).toFixed(0)}K`,
        },
        areasServed: cities,
        marketTrends: [
          "Steady 2.5% year-over-year price appreciation",
          "High demand with homes selling in under a month",
          "New construction in suburban areas",
          "Strong rental market near colleges",
          "Growing demand for homes with acreage",
        ],
        outlook:
          "Market expected to continue gradual appreciation through 2025 due to steady demand, economic stability, and lower cost of living.",
      },
      general: {
        overview:
          "Sioux City is a tri-state metro area where Iowa, Nebraska, and South Dakota meet along the Missouri River. Known for affordability, diverse economy, and quality of life.",
        population: "Approximately 85,000 in Sioux City, 145,000 in metro area",
        costOfLiving:
          "13% lower than the national average - housing, transportation, groceries, and healthcare are all more affordable here.",
        economy:
          "Diversified economy with major employers in healthcare (MercyOne Siouxland Medical Center, UnityPoint), manufacturing, agriculture (Tyson Foods), and energy (MidAmerican Energy).",
        recreation: [
          "Missouri River riverfront trails, boating, and fishing",
          "Stone State Park and numerous city parks",
          "Orpheum Theatre and downtown entertainment district",
          "Sioux City Art Center and local museums",
          "Dorothy Pecaut Nature Center",
          "Annual festivals, farmers markets, and community events",
          "Local dining scene with locally-owned restaurants",
        ],
        climate: {
          highlights: "Four seasons with minimal natural disaster risk",
          wildfireRisk: "Less than 1%",
          severeWindRisk: "Low",
        },
        transportation: {
          note: "Car-dependent community with good road infrastructure",
          walkScore: 23,
          transitScore: 36,
          bikeScore: 36,
        },
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

// Schema for external listings search
const searchExternalListingsSchema = z.object({
  query: z
    .string()
    .describe(
      "Search query for real estate listings, e.g. 'waterfront homes Sioux City Iowa' or '3 bedroom house under 300k'"
    ),
  location: z
    .string()
    .optional()
    .describe("City or area to focus the search on, defaults to Sioux City area"),
});

// JSON Schema for property extraction (used with Firecrawl scrape)
const propertyExtractionSchema = {
  type: "object",
  properties: {
    listings: {
      type: "array",
      description: "Array of real estate property listings found on the page",
      items: {
        type: "object",
        properties: {
          address: {
            type: "string",
            description: "Full street address including city and state (e.g., '123 Main St, Sioux City, IA 51104')",
          },
          price: {
            type: "string",
            description: "Listing price with dollar sign (e.g., '$350,000')",
          },
          bedrooms: {
            type: "number",
            description: "Number of bedrooms",
          },
          bathrooms: {
            type: "number",
            description: "Number of bathrooms (can include .5 for half baths)",
          },
          squareFeet: {
            type: "number",
            description: "Total square footage of the property",
          },
          yearBuilt: {
            type: "number",
            description: "Year the property was built (e.g., 1985)",
          },
          description: {
            type: "string",
            description: "Brief description of the property features and amenities",
          },
          imageUrl: {
            type: "string",
            description: "URL of the main property photo",
          },
          images: {
            type: "array",
            description: "Array of all property photo URLs found on the page (gallery images, thumbnails, etc.)",
            items: {
              type: "string",
              description: "URL of a property photo",
            },
          },
        },
        required: ["address"],
      },
    },
  },
  required: ["listings"],
};

// Type for structured listing from external search
interface StructuredListing {
  title: string;
  address: string;
  price: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  yearBuilt?: number;
  propertyType?: string;
  description: string;
  imageUrl?: string;
  images?: string[]; // Array of gallery image URLs
  _sourceUrl?: string; // Internal use only - for agent handoff
}

// Sanitize and validate listing data to catch extraction errors
function sanitizeListingData(data: StructuredListing): StructuredListing {
  const result = { ...data };

  // Validate bedrooms (should be 1-15, anything else is likely an extraction error)
  if (result.bedrooms !== undefined) {
    if (result.bedrooms < 1 || result.bedrooms > 15) {
      result.bedrooms = undefined;
    }
  }

  // Validate bathrooms (should be 0.5-10)
  if (result.bathrooms !== undefined) {
    if (result.bathrooms < 0.5 || result.bathrooms > 10) {
      result.bathrooms = undefined;
    }
  }

  // Validate square feet (should be 100-50000)
  if (result.squareFeet !== undefined) {
    if (result.squareFeet < 100 || result.squareFeet > 50000) {
      result.squareFeet = undefined;
    }
  }

  // Validate year built (should be 1800-current year)
  if (result.yearBuilt !== undefined) {
    const currentYear = new Date().getFullYear();
    if (result.yearBuilt < 1800 || result.yearBuilt > currentYear + 2) {
      result.yearBuilt = undefined;
    }
  }

  // Clean up description
  if (result.description) {
    result.description = result.description
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/https?:\/\/[^\s)]+/g, "")
      .replace(/[*_#`]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 500);

    if (result.description.length < 20 || /^[^a-zA-Z]*$/.test(result.description)) {
      result.description = "";
    }
  }

  // Clean up address
  if (result.address) {
    result.address = result.address
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/https?:\/\/[^\s]+/g, "")
      .replace(/[*_#`]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Validate image URL
  if (result.imageUrl) {
    const invalidPatterns = ["spacer.gif", "pixel.gif", "1x1", "blank.png", "placeholder", "no-image"];
    if (invalidPatterns.some((p) => result.imageUrl?.toLowerCase().includes(p))) {
      result.imageUrl = undefined;
    }
    if (result.imageUrl && !result.imageUrl.startsWith("http")) {
      result.imageUrl = undefined;
    }
  }

  // Validate and clean images array
  if (result.images && Array.isArray(result.images)) {
    const invalidPatterns = ["spacer.gif", "pixel.gif", "1x1", "blank.png", "placeholder", "no-image", "icon", "logo", "avatar"];
    result.images = result.images
      .filter((url): url is string => typeof url === "string" && url.startsWith("http"))
      .filter((url) => !invalidPatterns.some((p) => url.toLowerCase().includes(p)))
      .filter((url, index, arr) => arr.indexOf(url) === index)
      .slice(0, 20);

    if (!result.imageUrl && result.images.length > 0) {
      result.imageUrl = result.images[0];
    }
  }

  return result;
}

// Helper: scrape a single URL with timeout
async function scrapeWithTimeout(
  firecrawl: Firecrawl,
  url: string,
  timeoutMs: number = 15000
): Promise<StructuredListing[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log("[Firecrawl] Scraping:", url);

    // Use scrape with JSON format for LLM extraction
    // Add maxAge for caching (5 minutes) to speed up repeat queries
    const scrapeResult = await firecrawl.scrape(url, {
      formats: [
        {
          type: "json",
          prompt:
            "Extract all real estate property listings visible on this page. For each listing, get the full address, price, bedrooms, bathrooms, square footage, year built if available, a brief description, and the main image URL. Only include actual property listings.",
          schema: propertyExtractionSchema,
        },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    clearTimeout(timeout);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scrapeData = scrapeResult as any;
    const jsonData = (scrapeData?.json || scrapeData?.data?.json || scrapeData?.extract) as { listings?: unknown[] } | undefined;
    const pageListings = jsonData?.listings || [];

    console.log("[Firecrawl] Found", pageListings.length, "listings on page");

    const listings: StructuredListing[] = [];
    for (const item of pageListings) {
      if (!item || typeof item !== "object") continue;
      const data = item as Record<string, unknown>;

      const extractedImages = Array.isArray(data.images)
        ? data.images.filter((img): img is string => typeof img === "string")
        : [];

      const listing = sanitizeListingData({
        title: typeof data.address === "string" ? data.address : "Property Listing",
        address: typeof data.address === "string" ? data.address : "",
        price: typeof data.price === "string" ? data.price : "Contact for Price",
        bedrooms: typeof data.bedrooms === "number" ? data.bedrooms : undefined,
        bathrooms: typeof data.bathrooms === "number" ? data.bathrooms : undefined,
        squareFeet: typeof data.squareFeet === "number" ? data.squareFeet : undefined,
        yearBuilt: typeof data.yearBuilt === "number" ? data.yearBuilt : undefined,
        propertyType: "Single Family Home",
        description: typeof data.description === "string" ? data.description : "",
        imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : undefined,
        images: extractedImages.length > 0 ? extractedImages : undefined,
      });

      if (listing.address && listing.address.length > 10 && /\d/.test(listing.address)) {
        listings.push(listing);
        console.log("[Firecrawl] Added:", listing.address, "-", listing.price);
      }
    }

    return listings;
  } catch (error) {
    clearTimeout(timeout);
    if ((error as Error).name === "AbortError") {
      console.log("[Firecrawl] Scrape timed out for:", url);
    } else {
      console.error("[Firecrawl] Scrape error:", url, error);
    }
    return [];
  }
}

export const searchExternalListings = tool({
  description: `Search for additional property listings when local inventory doesn't have what the user wants. Use this when:
- Local search returned 0 or very few results
- User asks for specific property types we don't have (waterfront, luxury, acreage, historic, hot tub, pool)
- User wants to see more options on the market
- User is looking in areas outside our typical coverage

Returns listings in the same format as local listings for uniform display.`,
  inputSchema: searchExternalListingsSchema,
  execute: async ({ query, location }) => {
    const searchLocation = location || "Sioux City Iowa";
    const fullQuery = `${query} ${searchLocation} home for sale`;

    const firecrawl = getFirecrawl();
    if (!firecrawl) {
      return { success: false, totalFound: 0, listings: [] };
    }

    try {
      console.log("[Firecrawl] Starting search for:", fullQuery);

      // Step 1: Search to find relevant listing URLs
      const searchResults = await firecrawl.search(fullQuery, {
        limit: 5,
        scrapeOptions: {
          formats: ["markdown"],
          onlyMainContent: true,
        },
      });

      const webResults = searchResults?.web || [];
      console.log("[Firecrawl] Found", webResults.length, "search results");

      if (webResults.length === 0) {
        return { success: true, totalFound: 0, listings: [] };
      }

      // Step 2: Get URLs to scrape (limit to 2 for speed)
      const urlsToScrape: string[] = [];
      for (const result of webResults.slice(0, 2)) {
        const url = "url" in result && typeof result.url === "string" ? result.url : null;
        if (url) urlsToScrape.push(url);
      }

      // Step 3: Scrape URLs IN PARALLEL with timeout (much faster!)
      console.log("[Firecrawl] Scraping", urlsToScrape.length, "URLs in parallel");
      const scrapePromises = urlsToScrape.map((url) => scrapeWithTimeout(firecrawl, url, 20000));
      const results = await Promise.all(scrapePromises);

      // Flatten and dedupe by address
      const allListings = results.flat();
      const seen = new Set<string>();
      const listings = allListings.filter((listing) => {
        const key = listing.address.toLowerCase().replace(/\s+/g, "");
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      console.log("[Firecrawl] Returning", listings.length, "unique listings");
      return {
        success: true,
        totalFound: listings.length,
        listings,
      };
    } catch (error) {
      console.error("[Firecrawl] Error:", error);
      return { success: false, totalFound: 0, listings: [] };
    }
  },
});

// Schema for local area research
const researchLocalAreaSchema = z.object({
  query: z
    .string()
    .describe(
      "What to research about the Sioux City area, e.g. 'best restaurants near Morningside', 'parks and recreation', 'upcoming events'"
    ),
  topic: z
    .enum(["dining", "recreation", "events", "shopping", "healthcare", "education", "transportation", "other"])
    .describe("Category of the research query"),
});

export const researchLocalArea = tool({
  description: `Research information about the Sioux City, Iowa area that isn't in our hardcoded knowledge base. Use this when users ask about:
- Local restaurants, cafes, bars
- Parks, trails, outdoor activities
- Community events, festivals
- Shopping centers, stores
- Healthcare facilities, gyms
- Transportation options
- Other local amenities

IMPORTANT: Only use this for Sioux City/Siouxland area questions. Do NOT use for general knowledge questions unrelated to the local area.`,
  inputSchema: researchLocalAreaSchema,
  execute: async ({ query, topic }) => {
    const firecrawl = getFirecrawl();
    if (!firecrawl) {
      return {
        success: false,
        message: "Research service unavailable. Please contact our office for local recommendations.",
        results: [],
      };
    }

    try {
      // Build a focused search query for the Sioux City area
      const searchQuery = `${query} Sioux City Iowa ${topic !== "other" ? topic : ""}`.trim();
      console.log("[Firecrawl] Area research query:", searchQuery);

      const searchResults = await firecrawl.search(searchQuery, {
        limit: 5,
        scrapeOptions: {
          formats: ["markdown"],
          onlyMainContent: true,
        },
      });

      const webResults = searchResults?.web || [];
      console.log("[Firecrawl] Area research found", webResults.length, "results");

      if (webResults.length === 0) {
        return {
          success: true,
          message: "I couldn't find specific information about that. Our agents are locals and can provide personalized recommendations when you connect with them!",
          results: [],
        };
      }

      // Extract relevant snippets from results
      const results: { title: string; snippet: string; url?: string }[] = [];

      for (const result of webResults.slice(0, 3)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = result as any;
        if (r.title && r.description) {
          results.push({
            title: r.title,
            snippet: r.description?.slice(0, 300) || "",
            url: r.url,
          });
        } else if (r.markdown) {
          // Extract a summary from markdown content
          const content = r.markdown.slice(0, 500).replace(/[#*_\[\]()]/g, "").trim();
          if (content.length > 50) {
            results.push({
              title: r.title || "Local Information",
              snippet: content,
            });
          }
        }
      }

      return {
        success: true,
        topic,
        query,
        message: results.length > 0
          ? "Here's what I found about the Sioux City area:"
          : "I found some general information but nothing specific. Our local agents can help with personalized recommendations!",
        results,
        note: "This information is sourced from web search and may not be exhaustive. Our agents live in the area and can provide personal recommendations!",
      };
    } catch (error) {
      console.error("[Firecrawl] Area research error:", error);
      return {
        success: false,
        message: "I had trouble researching that. Feel free to ask our agents - they know the area well!",
        results: [],
      };
    }
  },
});

// Export all tools as an object for use in the API route
export const aiTools = {
  searchListings,
  getListingDetails,
  getAgentContact,
  getAreaInfo,
  initiateContact,
  searchExternalListings,
  researchLocalArea,
};
