import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Home, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyGrid } from "@/components/property";
import { HeroBackground } from "@/components/layout";
import {
  StatsSection,
  WorkWithUsCTA,
  NeighborhoodsGrid,
  TestimonialsSection,
  BuySellCTA,
} from "@/components/home";
import { getFeaturedListings } from "@/lib/data/listings";
import { getRecentBlogPosts, getAbout } from "@/lib/data/site-content";

export default function HomePage() {
  const featuredListings = getFeaturedListings(6);
  const blogPosts = getRecentBlogPosts(3);
  const about = getAbout();

  return (
    <div className="flex flex-col">
      {/* Hero Section - Full Bleed */}
      <section className="relative flex min-h-screen items-center justify-center">
        {/* Rotating Background Images */}
        <HeroBackground />

        <div className="container relative z-10 mx-auto px-4 pt-20 text-center text-white">
          {/* Premium Badge */}
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-white/70">
            Siouxland's Premier Real Estate
          </p>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
            Find Your Dream Home
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            Discover exceptional properties in Sioux City and the greater
            Siouxland area. Your perfect home is waiting.
          </p>

          {/* Search Bar - Premium Styling */}
          <div className="mx-auto max-w-2xl">
            <form
              action="/search"
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  name="q"
                  placeholder="Enter address, city, or MLS#"
                  className="h-14 rounded-lg border-white/20 bg-white/95 pl-12 text-foreground shadow-lg backdrop-blur placeholder:text-muted-foreground/70"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 rounded-lg bg-[#0033A0] px-10 text-base font-semibold shadow-lg transition-all hover:bg-[#002580] hover:shadow-xl"
              >
                Search Properties
              </Button>
            </form>
          </div>

          {/* View Properties Link */}
          <div className="mt-8">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Or browse all available properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-10 w-6 rounded-full border-2 border-white/40">
            <div className="mx-auto mt-2 h-2.5 w-1 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Listings */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#C4A35A]">
                Exclusive Listings
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-[#0033A0] md:text-4xl">
                Featured Properties
              </h2>
              <p className="mt-3 text-muted-foreground">
                Explore our handpicked selection of exceptional homes
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="border-[#0033A0] text-[#0033A0] hover:bg-[#0033A0] hover:text-white"
            >
              <Link href="/search">
                View All Listings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <PropertyGrid listings={featuredListings} prioritizeFirst={3} />
        </div>
      </section>

      {/* Buy/Sell CTA Section */}
      <BuySellCTA />

      {/* Neighborhoods Section */}
      <NeighborhoodsGrid />

      {/* About Section */}
      <section className="bg-secondary py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#C4A35A]">
                About Our Agency
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-[#0033A0] md:text-4xl">
                Serving Siouxland Since 1980
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">{about.mission}</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">{about.description}</p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <Card className="border-0 bg-white shadow-sm">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0033A0]/10">
                      <Home className="h-6 w-6 text-[#0033A0]" />
                    </div>
                    <p className="font-semibold text-[#0033A0]">Expert Knowledge</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Local market expertise
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white shadow-sm">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0033A0]/10">
                      <Users className="h-6 w-6 text-[#0033A0]" />
                    </div>
                    <p className="font-semibold text-[#0033A0]">Dedicated Team</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      14 experienced agents
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white shadow-sm">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#0033A0]/10">
                      <TrendingUp className="h-6 w-6 text-[#0033A0]" />
                    </div>
                    <p className="font-semibold text-[#0033A0]">Proven Results</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      45+ years of success
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="bg-[#0033A0] hover:bg-[#002580]">
                  <Link href="/about">Learn More About Us</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-[#0033A0] text-[#0033A0] hover:bg-[#0033A0] hover:text-white"
                >
                  <Link href="/agents">Meet Our Agents</Link>
                </Button>
              </div>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-2xl bg-white shadow-xl lg:aspect-square">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <Image
                  src="/logos/cbblue.png"
                  alt="Coldwell Banker Global Luxury"
                  width={400}
                  height={400}
                  className="h-auto w-full max-w-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Blog Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#C4A35A]">
              In The Press
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#0033A0] md:text-4xl">
              Latest From Our Blog
            </h2>
            <p className="mt-3 text-muted-foreground">
              Stay informed about the Siouxland real estate market
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.title} className="group overflow-hidden border-0 bg-white shadow-sm transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#C4A35A]">
                    {post.date}
                  </p>
                  <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-[#0033A0] transition-colors group-hover:text-[#002580]">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    By {post.author}
                  </p>
                  <Button
                    variant="link"
                    className="mt-4 h-auto p-0 text-[#0033A0] hover:text-[#C4A35A]"
                    asChild
                  >
                    <Link href={post.url}>
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              variant="outline"
              asChild
              className="border-[#0033A0] text-[#0033A0] hover:bg-[#0033A0] hover:text-white"
            >
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Work With Us CTA */}
      <WorkWithUsCTA />

      {/* Home Valuation CTA */}
      <section className="bg-gradient-to-r from-[#C4A35A]/20 via-[#C4A35A]/10 to-[#C4A35A]/20 py-16">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="mb-1 text-sm font-medium uppercase tracking-wider text-[#C4A35A]">
              Free Home Valuation
            </p>
            <h3 className="text-2xl font-bold text-[#0033A0]">
              Wondering What Your Home Is Worth?
            </h3>
            <p className="mt-1 text-muted-foreground">
              Get a complimentary market analysis from our experts
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-[#0033A0] px-8 hover:bg-[#002580]"
          >
            <Link href="/home-valuation">Get Your Free Estimate</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
