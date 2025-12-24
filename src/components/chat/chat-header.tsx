"use client";

import { X, Minimize2, Maximize2, Home, RotateCcw } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
  onToggleFullscreen?: () => void;
  onReset?: () => void;
  isFullscreen?: boolean;
  hasMessages?: boolean;
}

export function ChatHeader({ onClose, onToggleFullscreen, onReset, isFullscreen, hasMessages }: ChatHeaderProps) {
  return (
    <div className="bg-[#0033A0] text-white px-4 py-3 flex items-center justify-between rounded-t-xl">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
          <Home className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Coldwell Banker Assistant</h3>
          <p className="text-xs text-white/70">Your real estate concierge</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {onReset && hasMessages && (
          <button
            onClick={onReset}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Start new conversation"
            title="Start new conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
