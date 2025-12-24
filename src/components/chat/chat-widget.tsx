"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle } from "lucide-react";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";

export function ChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Create transport with API endpoint
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  });

  // Derive loading state from status
  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = useCallback(
    (content: string) => {
      // AI SDK 6: sendMessage expects { text: string }, not full message
      sendMessage({ text: content });
    },
    [sendMessage]
  );

  const handlePropertyClick = useCallback(
    (property: unknown) => {
      const prop = property as {
        id?: string;
        address?: string;
        price?: string;
        beds?: number;
        baths?: number;
        sqft?: number;
        imageUrl?: string | null;
        propertyType?: string;
        description?: string;
        title?: string;
        yearBuilt?: number;
        images?: string[];
      };

      // Exit fullscreen mode so user can see the property detail page
      setIsFullscreen(false);

      // Build a detailed message with property info so AI can give specific facts
      const details = [
        prop.beds && `${prop.beds} bedrooms`,
        prop.baths && `${prop.baths} bathrooms`,
        prop.sqft && `${prop.sqft.toLocaleString()} sq ft`,
        prop.propertyType && prop.propertyType,
      ].filter(Boolean).join(", ");

      const followUpMessage = `I'm viewing the property at ${prop.address} - ${prop.price}. Property details: ${details || "not specified"}. ${prop.description ? `Description: ${prop.description}` : ""}`;
      sendMessage({ text: followUpMessage });

      // If it's a local listing (has an ID that's not "ext-"), navigate to listing page
      if (prop.id && !prop.id.startsWith("ext-")) {
        router.push(`/listing/${prop.id}`);
        return;
      }

      // For external listings, encode the data and navigate to the external listing page
      const listingData = {
        address: prop.address || "Property",
        price: prop.price || "Contact for Price",
        bedrooms: prop.beds,
        bathrooms: prop.baths,
        squareFeet: prop.sqft,
        imageUrl: prop.imageUrl,
        propertyType: prop.propertyType,
        description: prop.description,
        title: prop.title,
        yearBuilt: prop.yearBuilt,
        images: prop.images,
      };

      // Encode the data as base64 for URL safety
      const encodedData = btoa(encodeURIComponent(JSON.stringify(listingData)));
      router.push(`/listing/external?data=${encodedData}`);
    },
    [sendMessage, router]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsFullscreen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleReset = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#C4A35A] hover:bg-[#B39349] text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6" />
            {/* Notification dot for first-time visitors */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-[#0033A0] rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold">?</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={`fixed z-40 bg-white shadow-2xl flex flex-col overflow-hidden border border-gray-200 ${
              isFullscreen
                ? "top-[100px] left-0 right-0 bottom-0 rounded-none"
                : "rounded-xl bottom-3 right-3 left-3 h-[calc(100vh-80px)] sm:bottom-6 sm:right-6 sm:left-auto sm:w-[380px] sm:h-[550px] sm:max-h-[calc(100vh-100px)]"
            }`}
          >
            {/* Header */}
            <ChatHeader
              onClose={handleClose}
              onToggleFullscreen={handleToggleFullscreen}
              isFullscreen={isFullscreen}
            />

            {/* Messages */}
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              isFullscreen={isFullscreen}
              onSuggestionClick={handleSubmit}
              onPropertyClick={handlePropertyClick}
            />

            {/* Input */}
            <ChatInput
              onSubmit={handleSubmit}
              isLoading={isLoading}
              placeholder="Ask about homes, neighborhoods..."
            />

            {/* Reset button (hidden but accessible) */}
            {messages.length > 0 && (
              <button
                onClick={handleReset}
                className="absolute bottom-[70px] left-1/2 -translate-x-1/2 text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Start new conversation
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
