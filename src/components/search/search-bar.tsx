"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({
  className,
  placeholder = "Search by address, city, or MLS#...",
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(currentQuery);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [query, searchParams, pathname, router]
  );

  const clearSearch = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
}
