"use client";

import { useState, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle } from "lucide-react";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";

export function ChatWidget() {
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
                ? "inset-0 rounded-none"
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
            <ChatMessages messages={messages} isLoading={isLoading} />

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
