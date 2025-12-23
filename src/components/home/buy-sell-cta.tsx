"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useRef } from "react";
import { useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BuySellCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  return (
    <section className="py-0" ref={containerRef}>
      <div className="grid md:grid-cols-2">
        {/* Selling a Home */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="group relative min-h-[400px] overflow-hidden md:min-h-[500px]"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('/hero/hero-1.jpg')`,
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center text-white">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#C4A35A]">
              List With Us
            </p>
            <h3 className="mb-4 text-3xl font-bold md:text-4xl">
              Selling a Home?
            </h3>
            <p className="mb-6 max-w-sm text-white/80">
              Get the best price for your property with our expert marketing and negotiation skills.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#0033A0]"
            >
              <Link href="/home-valuation">
                Get Your Free Estimate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Buying a Home */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="group relative min-h-[400px] overflow-hidden md:min-h-[500px]"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('/hero/hero-2.jpg')`,
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center text-white">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#C4A35A]">
              Find Your Dream Home
            </p>
            <h3 className="mb-4 text-3xl font-bold md:text-4xl">
              Buying a Home?
            </h3>
            <p className="mb-6 max-w-sm text-white/80">
              Discover exceptional properties with our dedicated team by your side every step of the way.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#0033A0]"
            >
              <Link href="/search">
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
