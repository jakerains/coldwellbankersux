"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const heroImages = [
  "/hero/hero-1.jpg",
  "/hero/hero-2.jpg",
  "/hero/hero-3.jpg",
];

export function HeroBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {heroImages.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0033A0]/80 via-[#0033A0]/70 to-[#001a52]/90" />
    </div>
  );
}
