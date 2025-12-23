"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutBrokerage() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="grid lg:grid-cols-2">
        {/* Text Content - Left Side */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 md:py-20 lg:py-28 lg:pl-16 xl:pl-24">
          <div className="max-w-xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#C4A35A]">
              Since 1980
            </p>
            <h2 className="text-3xl font-light tracking-tight text-[#0033A0] sm:text-4xl lg:text-5xl">
              Meet Coldwell Banker
              <br />
              <span className="font-semibold">Associated Brokers</span>
            </h2>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                For over four decades, Coldwell Banker Associated Brokers Realty has been
                the trusted name in Siouxland real estate. Our commitment to excellence
                and personalized service has made us leaders in the greater Sioux City
                area market.
              </p>
              <p>
                Our team of 14 expert agents brings together decades of combined experience,
                local market expertise, and a genuine passion for helping families find
                their perfect home. We take great care in working with each client to
                custom fit their unique needs.
              </p>
              <p>
                Backed by the global reach and resources of Coldwell Banker, we combine
                small-town values with world-class marketing and technology to deliver
                exceptional results for buyers and sellers alike.
              </p>
            </div>

            <div className="mt-10">
              <Button
                asChild
                variant="outline"
                className="group h-12 rounded-none border-[#0033A0] px-8 text-sm font-medium uppercase tracking-wider text-[#0033A0] transition-all hover:bg-[#0033A0] hover:text-white"
              >
                <Link href="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Image - Right Side */}
        <div className="relative min-h-[400px] lg:min-h-[600px]">
          {/* Use a high-end listing photo */}
          <Image
            src="https://i12.moxi.onl/img-pr-002190/nwi/05ec7fa501b40a484f6453a7be4bb97c8c0942e5/1_10_full.jpg"
            alt="Luxury home in Siouxland - Coldwell Banker Associated Brokers"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Subtle gradient overlay on left edge for text contrast */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/20 to-transparent lg:hidden" />

          {/* Bottom accent bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C4A35A]" />
        </div>
      </div>
    </section>
  );
}
