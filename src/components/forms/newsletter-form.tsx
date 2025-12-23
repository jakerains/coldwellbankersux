"use client";

import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulate API call - in production, this would submit to a newsletter service
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus("success");
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => setStatus("idle"), 3000);
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-white/10 px-6 py-4">
        <CheckCircle className="h-5 w-5 text-[#C4A35A]" />
        <span className="text-sm font-medium text-white">
          Thank you for subscribing! We&apos;ll be in touch.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="h-12 rounded-lg border-white/20 bg-white/10 pl-12 text-white placeholder:text-white/50 focus:border-[#C4A35A] focus:ring-[#C4A35A]"
        />
      </div>
      <Button
        type="submit"
        disabled={status === "loading"}
        className="h-12 rounded-lg bg-[#C4A35A] px-8 font-semibold text-[#0033A0] transition-all hover:bg-[#d4b36a] disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subscribing...
          </>
        ) : (
          "Subscribe"
        )}
      </Button>
    </form>
  );
}
