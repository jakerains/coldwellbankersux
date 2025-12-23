"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Award,
  ArrowRight,
  ArrowLeft,
  Bed,
  Bath,
  Square,
  TreePine,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SiteAgent } from "@/lib/types/site";
import { formatPhone } from "@/lib/utils/formatters";

interface AgentProfileProps {
  agent: SiteAgent;
}

export function AgentProfile({ agent }: AgentProfileProps) {
  const initials = agent.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0033A0] via-[#001a52] to-[#0033A0] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 pt-32 pb-16 md:pt-36 md:pb-24">
          {/* Back Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              asChild
              className="text-white/80 hover:text-white hover:bg-white/10 gap-2"
            >
              <Link href="/agents">
                <ArrowLeft className="h-4 w-4" />
                Our Team
              </Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center"
          >
            {/* Photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Gold accent ring */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-[#C4A35A] to-[#8B7355] opacity-60" />
                <div className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-full border-4 border-white/20">
                  {agent.photo ? (
                    <Image
                      src={agent.photo}
                      alt={agent.name}
                      fill
                      sizes="(max-width: 768px) 256px, 320px"
                      className="object-cover object-top"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/10">
                      <span className="text-6xl font-bold text-white/80">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-[#C4A35A] text-white hover:bg-[#C4A35A]/90">
                {agent.title}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {agent.name}
              </h1>
              {agent.licenses && (
                <p className="text-white/70 text-sm mb-6">
                  <Award className="inline h-4 w-4 mr-2" />
                  Licensed: {agent.licenses}
                </p>
              )}

              {/* Quick Contact */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {(agent.cell_phone || agent.phone) && (
                  <Button
                    asChild
                    className="bg-[#C4A35A] hover:bg-[#C4A35A]/90 text-white"
                  >
                    <a href={`tel:${(agent.cell_phone || agent.phone)?.replace(/\D/g, "")}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </a>
                  </Button>
                )}
                {agent.email && (
                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#0033A0]"
                  >
                    <a href={`mailto:${agent.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            {agent.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-4">About {agent.name.split(" ")[0]}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {agent.bio}
                </p>
              </motion.div>
            )}

            {/* Active Listings */}
            {agent.active_listings && agent.active_listings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Separator className="my-8" />
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Active Listings</h2>
                  <Badge variant="secondary" className="bg-[#0033A0]/10 text-[#0033A0]">
                    {agent.active_listings.length} {agent.active_listings.length === 1 ? "Property" : "Properties"}
                  </Badge>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {agent.active_listings.map((listing, index) => (
                    <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                      {listing.image && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={listing.image}
                            alt={listing.address}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Badge className="bg-[#0033A0] text-white">
                              {listing.price}
                            </Badge>
                            {listing.property_type && (
                              <Badge variant="secondary" className="bg-white/90 text-gray-700">
                                {listing.property_type}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{listing.address}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {listing.city}, {listing.state} {listing.zip}
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                          {listing.beds && (
                            <span className="flex items-center gap-1">
                              <Bed className="h-4 w-4" />
                              {listing.beds} Beds
                            </span>
                          )}
                          {listing.baths && (
                            <span className="flex items-center gap-1">
                              <Bath className="h-4 w-4" />
                              {listing.baths} Baths
                            </span>
                          )}
                          {listing.sqft && (
                            <span className="flex items-center gap-1">
                              <Square className="h-4 w-4" />
                              {listing.sqft.toLocaleString()} sqft
                            </span>
                          )}
                          {listing.acres && (
                            <span className="flex items-center gap-1">
                              <TreePine className="h-4 w-4" />
                              {listing.acres} Acres
                            </span>
                          )}
                          {listing.year_built && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Built {listing.year_built}
                            </span>
                          )}
                        </div>
                        {listing.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {listing.description}
                          </p>
                        )}
                        {listing.url && (
                          <Button asChild variant="outline" className="w-full" size="sm">
                            <Link href={listing.url}>
                              View Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Sold Listings */}
            {agent.sold_listings && agent.sold_listings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Separator className="my-8" />
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Recently Sold</h2>
                  <Badge variant="secondary" className="bg-[#C4A35A]/10 text-[#8B7355]">
                    {agent.sold_listings.length} {agent.sold_listings.length === 1 ? "Property" : "Properties"}
                  </Badge>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {agent.sold_listings.slice(0, 6).map((listing, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-[#C4A35A] text-white">
                            SOLD
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {listing.sold_date}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-1">{listing.address}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {listing.city}, {listing.state} {listing.zip}
                        </p>
                        <p className="text-lg font-bold text-[#0033A0] mb-2">
                          {listing.price}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          {listing.beds && (
                            <span className="flex items-center gap-1">
                              <Bed className="h-3 w-3" />
                              {listing.beds} Beds
                            </span>
                          )}
                          {listing.baths && (
                            <span className="flex items-center gap-1">
                              <Bath className="h-3 w-3" />
                              {listing.baths} Baths
                            </span>
                          )}
                          {listing.sqft && (
                            <span className="flex items-center gap-1">
                              <Square className="h-3 w-3" />
                              {listing.sqft.toLocaleString()} sqft
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {agent.sold_listings.length > 6 && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    + {agent.sold_listings.length - 6} more sold properties
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-24"
            >
              {/* Contact Card */}
              <Card className="overflow-hidden">
                <div className="bg-[#0033A0] p-4">
                  <h3 className="text-white font-semibold text-lg">Contact Information</h3>
                </div>
                <CardContent className="p-6 space-y-4">
                  {agent.cell_phone && (
                    <a
                      href={`tel:${agent.cell_phone.replace(/\D/g, "")}`}
                      className="flex items-center gap-3 text-sm hover:text-[#0033A0] transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0033A0]/10">
                        <Phone className="h-4 w-4 text-[#0033A0]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cell</p>
                        <p className="font-medium">{formatPhone(agent.cell_phone)}</p>
                      </div>
                    </a>
                  )}
                  {agent.office_phone && (
                    <a
                      href={`tel:${agent.office_phone.replace(/\D/g, "")}`}
                      className="flex items-center gap-3 text-sm hover:text-[#0033A0] transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0033A0]/10">
                        <Phone className="h-4 w-4 text-[#0033A0]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Office</p>
                        <p className="font-medium">{formatPhone(agent.office_phone)}</p>
                      </div>
                    </a>
                  )}
                  {agent.email && (
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-3 text-sm hover:text-[#0033A0] transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0033A0]/10">
                        <Mail className="h-4 w-4 text-[#0033A0]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium break-all">{agent.email}</p>
                      </div>
                    </a>
                  )}
                  {agent.website && (
                    <a
                      href={agent.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm hover:text-[#0033A0] transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0033A0]/10">
                        <Globe className="h-4 w-4 text-[#0033A0]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Website</p>
                        <p className="font-medium">Visit Website</p>
                      </div>
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Office Card */}
              {agent.office && (
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C4A35A]/10 shrink-0">
                        <MapPin className="h-4 w-4 text-[#C4A35A]" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{agent.office.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {agent.office.address}
                          <br />
                          {agent.office.city}, {agent.office.state} {agent.office.zip}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Social Links */}
              {agent.social && Object.values(agent.social).some(Boolean) && (
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4">Connect</h4>
                    <div className="flex gap-3">
                      {agent.social.facebook && (
                        <a
                          href={agent.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {agent.social.instagram && (
                        <a
                          href={agent.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-colors"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                      {agent.social.linkedin && (
                        <a
                          href={agent.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {agent.social.twitter && (
                        <a
                          href={agent.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-colors"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Languages */}
              {agent.languages && agent.languages.length > 0 && (
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.languages.map((lang) => (
                        <Badge key={lang} variant="secondary">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-[#0033A0] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Whether you&apos;re buying or selling, {agent.name.split(" ")[0]} is here to
            guide you through every step of the process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(agent.cell_phone || agent.phone) && (
              <Button
                asChild
                size="lg"
                className="bg-[#C4A35A] hover:bg-[#C4A35A]/90 text-white"
              >
                <a href={`tel:${(agent.cell_phone || agent.phone)?.replace(/\D/g, "")}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call {agent.name.split(" ")[0]}
                </a>
              </Button>
            )}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#0033A0]"
            >
              <Link href="/search">
                Browse Properties
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
