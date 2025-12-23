import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Award, Users, Home, TrendingUp, Heart, Shield } from "lucide-react";
import { getAbout, getServiceAreas, getSiteName } from "@/lib/data/site-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | Coldwell Banker Associated Brokers Realty",
  description:
    "Learn about Coldwell Banker Associated Brokers Realty, serving Sioux City and the greater Siouxland area since 1980.",
};

const values = [
  {
    icon: Heart,
    title: "Client-Focused",
    description:
      "Your needs come first. We listen, understand, and deliver personalized solutions.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "Honest, transparent dealings in every transaction. Your trust is our priority.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Committed to the highest standards of professionalism and service quality.",
  },
  {
    icon: TrendingUp,
    title: "Results",
    description:
      "Proven track record of success helping clients achieve their real estate goals.",
  },
];

export default function AboutPage() {
  const about = getAbout();
  const serviceAreas = getServiceAreas();
  const siteName = getSiteName();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#0033A0] text-white pt-32 pb-16 md:pt-36 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                Serving Siouxland Since 1980
              </h1>
              <p className="mt-4 text-lg text-white/80">{about.mission}</p>
            </div>
            <div className="relative aspect-video lg:aspect-square">
              <Image
                src="/logos/Blue-CB-logo-vertical-1.png"
                alt="Coldwell Banker Logo"
                fill
                className="object-contain bg-white rounded-lg p-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {about.history}
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mt-4">
              {about.description}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <p className="text-4xl font-bold text-primary">45+</p>
              <p className="text-muted-foreground mt-1">Years of Experience</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <p className="text-4xl font-bold text-primary">14</p>
              <p className="text-muted-foreground mt-1">Expert Agents</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <p className="text-4xl font-bold text-primary">1000+</p>
              <p className="text-muted-foreground mt-1">Homes Sold</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <p className="text-4xl font-bold text-primary">98%</p>
              <p className="text-muted-foreground mt-1">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Values</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and define who we are as a
              company.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Areas We Serve</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Our team has deep knowledge of the local market across the entire
              Siouxland region.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {serviceAreas.map((area) => (
              <div
                key={area}
                className="px-6 py-3 bg-background rounded-full shadow-sm"
              >
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Whether you&apos;re buying, selling, or just have questions about the
            local market, our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/agents">Meet Our Team</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
