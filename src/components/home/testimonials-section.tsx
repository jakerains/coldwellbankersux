"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  location: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "The team at Coldwell Banker made our home buying experience seamless and stress-free. Their knowledge of the Siouxland market is unmatched, and they found us our dream home within our budget.",
    author: "John & Sarah M.",
    location: "Dakota Dunes",
    rating: 5,
  },
  {
    quote:
      "Professional, responsive, and genuinely caring. Our agent went above and beyond to ensure we got the best deal on our new home. Highly recommend their services to anyone in the area.",
    author: "Michael R.",
    location: "Morningside",
    rating: 5,
  },
  {
    quote:
      "Selling our family home after 30 years was emotional, but the Coldwell Banker team handled everything with sensitivity and expertise. We couldn't have asked for better representation.",
    author: "The Anderson Family",
    location: "Sioux City",
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-[#C4A35A] text-[#C4A35A]" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  return (
    <section className="relative overflow-hidden bg-[#001a52] py-20 md:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4" ref={containerRef}>
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#C4A35A]">
            Client Testimonials
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            See Why Our Clients Love Us
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              className="group relative"
            >
              <div className="relative rounded-xl bg-white/5 p-8 backdrop-blur-sm transition-colors hover:bg-white/10">
                {/* Quote Icon */}
                <Quote className="mb-4 h-8 w-8 text-[#C4A35A]/60" />

                {/* Stars */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Quote */}
                <blockquote className="mb-6 text-white/80 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="border-t border-white/10 pt-4">
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-white/60">{testimonial.location}</p>
                </div>

                {/* Decorative Corner */}
                <div className="absolute -bottom-px -right-px h-12 w-12 overflow-hidden">
                  <div className="absolute bottom-0 right-0 h-8 w-8 translate-x-1/2 translate-y-1/2 rotate-45 bg-[#C4A35A]/20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
