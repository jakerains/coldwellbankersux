"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Award, Users, Home, Star, DollarSign, Percent } from "lucide-react";

interface Stat {
  value: string;
  label: string;
  icon: React.ElementType;
  suffix?: string;
  prefix?: string;
}

const stats: Stat[] = [
  {
    value: "45",
    suffix: "+",
    label: "Years in Business",
    icon: Award,
  },
  {
    value: "14",
    suffix: "",
    label: "Expert Agents",
    icon: Users,
  },
  {
    value: "200",
    prefix: "$",
    suffix: "M+",
    label: "Total Sales Volume",
    icon: DollarSign,
  },
  {
    value: "1000",
    suffix: "+",
    label: "Homes Sold",
    icon: Home,
  },
  {
    value: "98",
    suffix: "%",
    label: "Client Satisfaction",
    icon: Star,
  },
  {
    value: "3",
    suffix: "%",
    label: "List to Sold Average",
    icon: Percent,
  },
];

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: string; suffix?: string; prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const targetValue = parseInt(value, 10);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setDisplayValue(targetValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, targetValue]);

  return (
    <span ref={ref}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          // 919 28th Street - Fully updated 2-story home
          backgroundImage: `url('https://i5.moxi.onl/img-pr-002181/nwi/b8e6698883ec0bb41f74b0e29bbc699804e541b8/1_5_full.jpg')`,
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/75" />

      <div className="container relative z-10 mx-auto px-4 py-20 md:py-28" ref={containerRef}>
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-[#C4A35A]">
            Team Accolades
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Trusted Excellence in Siouxland
          </h2>
        </div>

        {/* Stats Grid - 3x2 layout */}
        <div className="mx-auto grid max-w-5xl gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="group text-center"
            >
              {/* Value */}
              <p className="mb-2 text-4xl font-light tracking-tight text-white md:text-5xl">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </p>

              {/* Label */}
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
