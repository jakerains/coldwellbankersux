"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "@ai-sdk/react";
import { User, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PropertyGrid } from "./property-card";

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading?: boolean;
  isFullscreen?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
  onPropertyClick?: (property: unknown) => void;
}

export function ChatMessages({
  messages,
  isLoading,
  isFullscreen,
  onSuggestionClick,
  onPropertyClick
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Welcome message if no messages */}
      {messages.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#0033A0]/10 rounded-full flex items-center justify-center">
            <Bot className="w-8 h-8 text-[#0033A0]" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Welcome to Coldwell Banker!
          </h3>
          <p className="text-sm text-gray-600 max-w-xs mx-auto">
            I&apos;m your real estate assistant. Tell me what you&apos;re looking for
            and I&apos;ll help you find your perfect home.
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-500">Try asking:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "Show me 3-bedroom homes",
                "What's available under $350k?",
                "Homes with a pool",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-[#C4A35A] hover:text-white transition-colors cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isFullscreen={isFullscreen}
          onPropertyClick={onPropertyClick}
        />
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0033A0] flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

function MessageBubble({
  message,
  isFullscreen,
  onPropertyClick
}: {
  message: UIMessage;
  isFullscreen?: boolean;
  onPropertyClick?: (property: unknown) => void;
}) {
  const isUser = message.role === "user";

  // In AI SDK 6, parts can be: text, tool-call, tool-result, or tool-invocation (legacy)
  // We need to render them in order to maintain conversation flow

  // Debug: log message parts to see their structure
  if (process.env.NODE_ENV === "development" && !isUser) {
    const partTypes = message.parts.map(p => p.type);
    console.log("Part types:", partTypes, "Full parts:", message.parts);
  }

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-[#C4A35A]" : "bg-[#0033A0]"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message content - render parts in order */}
      <div className={`max-w-[85%] space-y-3 ${isUser ? "items-end" : "items-start"}`}>
        {message.parts.map((part, index) => {
          // Handle text parts
          if (part.type === "text") {
            const textPart = part as { type: "text"; text: string };
            if (!textPart.text.trim()) return null;

            return (
              <div
                key={index}
                className={`rounded-2xl px-4 py-2 ${
                  isUser
                    ? "bg-[#C4A35A] text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-900 rounded-tl-none"
                }`}
              >
                {isUser ? (
                  <p className="text-sm whitespace-pre-wrap">{textPart.text}</p>
                ) : (
                  <div className="text-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-strong:text-gray-900">
                    <ReactMarkdown>{textPart.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            );
          }

          // Handle tool parts - AI SDK 6 uses "tool-{toolName}" format
          if (part.type.startsWith("tool-")) {
            const toolPart = part as unknown as ToolInvocationPart;
            // Extract tool name from type (e.g., "tool-searchListings" -> "searchListings")
            const toolName = part.type.replace("tool-", "");
            return (
              <ToolResult
                key={toolPart.toolCallId || index}
                toolName={toolName}
                invocation={toolPart}
                isFullscreen={isFullscreen}
                onPropertyClick={onPropertyClick}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

// AI SDK 6 tool part structure
interface ToolInvocationPart {
  type: string; // "tool-{toolName}"
  toolCallId?: string;
  state?: "input-available" | "output-available" | "streaming" | string;
  input?: unknown;
  output?: unknown;
  // Legacy fields
  result?: unknown;
  args?: unknown;
}

function ToolResult({
  toolName,
  invocation,
  isFullscreen,
  onPropertyClick
}: {
  toolName: string;
  invocation: ToolInvocationPart;
  isFullscreen?: boolean;
  onPropertyClick?: (property: unknown) => void;
}) {
  // AI SDK 6: state === "output-available" means result is ready
  const isResultReady = invocation.state === "output-available";

  if (!isResultReady) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>
          {toolName === "searchListings" && "Searching properties..."}
          {toolName === "searchExternalListings" && "Finding more options..."}
          {toolName === "getListingDetails" && "Loading details..."}
          {toolName === "getAgentContact" && "Getting contact info..."}
          {toolName === "getAreaInfo" && "Looking up area info..."}
          {toolName === "initiateContact" && "Preparing contact info..."}
        </span>
      </div>
    );
  }

  // AI SDK 6 uses "output", fallback to "result" for legacy
  const result = (invocation.output || invocation.result) as Record<string, unknown>;

  // Render based on tool type
  switch (toolName) {
    case "searchListings":
      return <LocalSearchResults result={result} isFullscreen={isFullscreen} onPropertyClick={onPropertyClick} />;
    case "searchExternalListings":
      return <ExternalSearchResults result={result} isFullscreen={isFullscreen} onPropertyClick={onPropertyClick} />;
    default:
      // Other tools don't need special rendering - the AI will summarize
      return null;
  }
}

// Local search results (from our inventory)
interface LocalSearchResult {
  totalFound: number;
  showing: number;
  hasMore: boolean;
  listings: Array<{
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
  }>;
}

function LocalSearchResults({
  result,
  isFullscreen,
  onPropertyClick
}: {
  result: Record<string, unknown>;
  isFullscreen?: boolean;
  onPropertyClick?: (property: unknown) => void;
}) {
  const searchResult = result as unknown as LocalSearchResult;

  if (!searchResult.listings || searchResult.listings.length === 0) {
    return null;
  }

  // Transform to unified format
  const properties = searchResult.listings.map((listing) => ({
    id: listing.id,
    imageUrl: listing.mainImage,
    price: listing.priceFormatted,
    address: listing.address,
    beds: listing.bedrooms,
    baths: listing.bathrooms,
    sqft: listing.squareFeet,
  }));

  return (
    <div className="w-full">
      <PropertyGrid
        properties={properties}
        variant={isFullscreen ? "full" : "compact"}
        onPropertyClick={onPropertyClick}
      />
    </div>
  );
}

// External search results (from Firecrawl)
interface ExternalSearchResult {
  success: boolean;
  totalFound: number;
  listings: Array<{
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
    images?: string[]; // Gallery images array
  }>;
}

function ExternalSearchResults({
  result,
  isFullscreen,
  onPropertyClick
}: {
  result: Record<string, unknown>;
  isFullscreen?: boolean;
  onPropertyClick?: (property: unknown) => void;
}) {
  const searchResult = result as unknown as ExternalSearchResult;

  if (!searchResult.success || !searchResult.listings || searchResult.listings.length === 0) {
    return null;
  }

  // Transform to unified format - keep ALL the data for the detail page
  const properties = searchResult.listings.map((listing, index) => ({
    id: `ext-${index}`,
    imageUrl: listing.imageUrl || null,
    price: listing.price,
    address: listing.address,
    beds: listing.bedrooms,
    baths: listing.bathrooms,
    sqft: listing.squareFeet,
    // Additional fields for the external listing detail page
    propertyType: listing.propertyType,
    description: listing.description,
    title: listing.title,
    yearBuilt: listing.yearBuilt,
    images: listing.images, // Gallery images array
  }));

  return (
    <div className="w-full">
      <PropertyGrid
        properties={properties}
        variant={isFullscreen ? "full" : "compact"}
        onPropertyClick={onPropertyClick}
      />
    </div>
  );
}
