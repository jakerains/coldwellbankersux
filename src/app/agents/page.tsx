import { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { getAgents, getContactInfo, getSiteName } from "@/lib/data/site-content";
import { AgentCard } from "@/components/agents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Our Agents | Coldwell Banker Associated Brokers Realty",
  description:
    "Meet our team of experienced real estate professionals serving Sioux City, IA and the greater Siouxland area.",
};

export default function AgentsPage() {
  const agents = getAgents();
  const contact = getContactInfo();
  const siteName = getSiteName();

  return (
    <div className="container mx-auto px-4 pt-32 pb-8 md:pb-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold md:text-4xl">Our Team</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Our experienced agents are dedicated to providing exceptional service
          and helping you find your perfect home in Sioux City and the greater
          Siouxland area.
        </p>
      </div>

      {/* Agents Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-16">
        {agents.map((agent) => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>

      {/* Office Info */}
      <section className="bg-secondary rounded-lg p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Visit Our Office</h2>
            <p className="text-muted-foreground mb-6">
              Stop by our office to meet our team in person. We&apos;re here to
              answer your questions and help you with all your real estate needs.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{siteName}</p>
                  <p className="text-sm text-muted-foreground">
                    {contact.address.street}
                    <br />
                    {contact.address.city}, {contact.address.state} {contact.address.zip}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${contact.office_phone.replace(/\D/g, "")}`}
                className="flex items-center gap-3 hover:text-primary"
              >
                <Phone className="h-5 w-5 text-primary" />
                <span>{contact.office_phone}</span>
              </a>

              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 hover:text-primary"
              >
                <Mail className="h-5 w-5 text-primary" />
                <span>{contact.email}</span>
              </a>
            </div>

            <div className="mt-6">
              <Button asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Office Hours Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Office Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Appointments available outside regular hours upon request.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Whether you&apos;re buying or selling, our team is here to guide you
          through every step of the process.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/search">Browse Properties</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/home-valuation">Get a Home Valuation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
