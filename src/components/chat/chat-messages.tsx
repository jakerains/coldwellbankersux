"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "@ai-sdk/react";
import { User, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ListingCardCompact } from "./listing-card";

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

export function ChatMessages({ messages, isLoading, onSuggestionClick }: ChatMessagesProps) {
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
                "Tell me about Sioux City",
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
        <MessageBubble key={message.id} message={message} />
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

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  // Extract text and tool parts from the message parts array
  const textParts = message.parts.filter((part) => part.type === "text");
  const toolParts = message.parts.filter((part) => part.type === "tool-invocation");

  // Get combined text content
  const textContent = textParts
    .map((part) => (part as { type: "text"; text: string }).text)
    .join("");

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

      {/* Message content */}
      <div className={`max-w-[80%] space-y-2 ${isUser ? "items-end" : "items-start"}`}>
        {/* Text content */}
        {textContent && (
          <div
            className={`rounded-2xl px-4 py-2 ${
              isUser
                ? "bg-[#C4A35A] text-white rounded-tr-none"
                : "bg-gray-100 text-gray-900 rounded-tl-none"
            }`}
          >
            {isUser ? (
              <p className="text-sm whitespace-pre-wrap">{textContent}</p>
            ) : (
              <div className="text-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-strong:text-gray-900">
                <ReactMarkdown>{textContent}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Tool results */}
        {toolParts.map((part) => {
          const toolPart = part as unknown as ToolInvocationPart;
          return (
            <ToolResult key={toolPart.toolInvocationId} invocation={toolPart} />
          );
        })}
      </div>
    </div>
  );
}

interface ToolInvocationPart {
  type: "tool-invocation";
  toolInvocationId: string;
  toolName: string;
  state: "call" | "result" | "partial-call";
  result?: unknown;
  args?: unknown;
}

function ToolResult({ invocation }: { invocation: ToolInvocationPart }) {
  if (invocation.state !== "result") {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>
          {invocation.toolName === "searchListings" && "Searching properties..."}
          {invocation.toolName === "getListingDetails" && "Loading details..."}
          {invocation.toolName === "getAgentContact" && "Getting contact info..."}
          {invocation.toolName === "getAreaInfo" && "Looking up area info..."}
          {invocation.toolName === "initiateContact" && "Preparing contact info..."}
        </span>
      </div>
    );
  }

  const result = invocation.result as Record<string, unknown>;

  // Render based on tool type
  switch (invocation.toolName) {
    case "searchListings":
      return <SearchResultsDisplay result={result} />;
    default:
      // Other tools don't need special rendering - the AI will summarize
      return null;
  }
}

interface SearchResult {
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

function SearchResultsDisplay({ result }: { result: Record<string, unknown> }) {
  const searchResult = result as unknown as SearchResult;

  if (!searchResult.listings || searchResult.listings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs text-gray-500">
        Found {searchResult.totalFound} properties
        {searchResult.hasMore && ` (showing ${searchResult.showing})`}
      </p>
      <div className="space-y-2">
        {searchResult.listings.map((listing) => (
          <ListingCardCompact key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
