"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Actual listing photos from current inventory
const heroImages = [
  // 33154 Hickory Avenue - $739k luxury home on 3.5 acres
  "https://i12.moxi.onl/img-pr-002190/nwi/05ec7fa501b40a484f6453a7be4bb97c8c0942e5/1_10_full.jpg",
  // 905 Willow Circle, Dakota Dunes - $445k luxury home
  "https://i9.moxi.onl/img-pr-002188/nwi/53450ad0ceda7685f9315485e1c388785698da3f/1_5_full.jpg",
  // 514 Ascot Street - $329k Woodbury Heights Ranch
  "https://i16.moxi.onl/img-pr-002154/nwi/dc173afc7c2590e0def64c6078992d7291d749c0/1_5_full.jpg",
  // 1304 46th St - $299,900 family home
  "https://i7.moxi.onl/img-pr-002206/nwi/29813731aa0b71feca9b671d427ea8cb63f9990e/1_4_full.jpg",
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
