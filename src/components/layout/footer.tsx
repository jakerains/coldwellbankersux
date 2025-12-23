"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NewsletterForm } from "@/components/forms";

const quickLinks = [
  { label: "Property Search", href: "/search" },
  { label: "Our Agents", href: "/agents" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
  { label: "Home Valuation", href: "/home-valuation" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Accessibility Statement", href: "/accessibility" },
  { label: "Fair Housing Notice", href: "/fair-housing" },
];

const serviceAreas = [
  "Sioux City, IA",
  "Dakota Dunes, SD",
  "Sergeant Bluff, IA",
  "Hinton, IA",
  "Greater Siouxland Area",
];

// Static year to avoid Next.js 16 prerender issues with dynamic Date
const CURRENT_YEAR = 2025;

export function Footer() {

  return (
    <footer className="bg-[#0033A0] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#C4A35A]">
              Stay Connected
            </p>
            <h3 className="mb-3 text-2xl font-bold">
              Subscribe to Our Newsletter
            </h3>
            <p className="mb-6 text-white/70">
              Get the latest listings, market updates, and real estate tips delivered to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <Image
              src="/cblight.png"
              alt="Coldwell Banker Global Luxury"
              width={180}
              height={90}
              className="mb-4"
            />
            <p className="text-sm text-white/80">
              Providing a superior level of informed, professional real estate
              services to buyers and sellers in the greater Sioux City area
              since 1980.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/70 transition-colors hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/70 transition-colors hover:text-white"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Service Areas</h3>
            <ul className="space-y-2">
              {serviceAreas.map((area) => (
                <li key={area} className="text-sm text-white/80">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <a
                href="https://maps.google.com/?q=1222+Pierce+Street,+Sioux+City,+IA+51105"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-white/80 transition-colors hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  1222 Pierce Street
                  <br />
                  Sioux City, IA 51105
                </span>
              </a>
              <a
                href="tel:7122557310"
                className="flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4" />
                (712) 255-7310
              </a>
              <a
                href="mailto:coldwellbankerab@gmail.com"
                className="flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4" />
                coldwellbankerab@gmail.com
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <p className="text-sm text-white/70">
            &copy; {CURRENT_YEAR} Coldwell Banker Associated Brokers Realty, Inc.
            All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* MLS Disclaimer */}
        <p className="mt-6 text-center text-xs text-white/50">
          Data provided by Northwest Iowa Board of Realtors MLS. Copyright{" "}
          {CURRENT_YEAR} Northwest Iowa Board of Realtors. All rights reserved.
          This information is deemed reliable, but not guaranteed.
        </p>
      </div>
    </footer>
  );
}
