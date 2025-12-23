"use client";

import { motion } from "motion/react";
import { PropertyCard } from "./property-card";
import type { Listing } from "@/lib/types";

interface PropertyGridProps {
  listings: Listing[];
  prioritizeFirst?: number;
}

export function PropertyGrid({
  listings,
  prioritizeFirst = 2,
}: PropertyGridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {listings.map((listing, index) => (
        <motion.div
          key={listing.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <PropertyCard listing={listing} priority={index < prioritizeFirst} />
        </motion.div>
      ))}
    </motion.div>
  );
}
