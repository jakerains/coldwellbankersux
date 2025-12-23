"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";

interface Neighborhood {
  name: string;
  description: string;
  slug: string;
  gradient: string;
}

const neighborhoods: Neighborhood[] = [
  {
    name: "Dakota Dunes",
    description: "Premier planned community",
    slug: "dakota-dunes",
    gradient: "from-[#1a365d] to-[#2d5a87]",
  },
  {
    name: "Morningside",
    description: "Historic charm meets modern living",
    slug: "morningside",
    gradient: "from-[#2d3748] to-[#4a5568]",
  },
  {
    name: "Downtown Sioux City",
    description: "Urban lifestyle and convenience",
    slug: "sioux-city",
    gradient: "from-[#1a202c] to-[#2d3748]",
  },
  {
    name: "Sergeant Bluff",
    description: "Family-friendly suburban living",
    slug: "sergeant-bluff",
    gradient: "from-[#234e52] to-[#2c7a7b]",
  },
  {
    name: "Hinton",
    description: "Peaceful rural community",
    slug: "hinton",
    gradient: "from-[#3c366b] to-[#5a67d8]",
  },
  {
    name: "Greater Siouxland",
    description: "Explore all available properties",
    slug: "",
    gradient: "from-[#744210] to-[#c4a35a]",
  },
];

export function NeighborhoodsGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  return (
    <section className="bg-secondary/50 py-20 md:py-28">
      <div className="container mx-auto px-4" ref={containerRef}>
        {/* Section Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#C4A35A]">
            Explore Our Communities
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[#0033A0] md:text-4xl">
            Find Your Perfect Neighborhood
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Discover the unique character and charm of each community in the greater Siouxland area
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {neighborhoods.map((neighborhood, index) => (
            <motion.div
              key={neighborhood.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <Link
                href={neighborhood.slug ? `/search?city=${neighborhood.slug}` : "/search"}
                className="group relative block aspect-[4/3] overflow-hidden rounded-xl"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${neighborhood.gradient} transition-transform duration-500 group-hover:scale-105`}
                />

                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                  />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-6">
                  <h3 className="text-xl font-bold text-white md:text-2xl">
                    {neighborhood.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    {neighborhood.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="mt-3 flex items-center gap-2 text-sm font-medium text-[#C4A35A] opacity-0 transition-opacity group-hover:opacity-100">
                    Explore Properties
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Hover Border */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent transition-colors group-hover:border-[#C4A35A]/50" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
