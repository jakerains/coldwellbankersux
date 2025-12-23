import { Suspense } from "react";
import { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getContactInfo, getSiteName } from "@/lib/data/site-content";
import { ContactForm } from "@/components/forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Contact Us | Coldwell Banker Associated Brokers Realty",
  description:
    "Get in touch with Coldwell Banker Associated Brokers Realty. We're here to help with all your real estate needs in Sioux City and the greater Siouxland area.",
};

export default function ContactPage() {
  const contact = getContactInfo();
  const siteName = getSiteName();

  return (
    <div className="container mx-auto px-4 pt-32 pb-8 md:pb-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold md:text-4xl">Contact Us</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Have questions about buying or selling a home? We&apos;re here to help.
          Reach out to us using any of the methods below.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ContactFormSkeleton />}>
                <ContactForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{siteName}</p>
                  <p className="text-sm text-muted-foreground">
                    {contact.address.street}
                    <br />
                    {contact.address.city}, {contact.address.state}{" "}
                    {contact.address.zip}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${contact.office_phone.replace(/\D/g, "")}`}
                className="flex items-center gap-3 hover:text-primary transition-colors"
              >
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">Office</p>
                  <p className="text-sm text-muted-foreground">
                    {contact.office_phone}
                  </p>
                </div>
              </a>

              {contact.direct_phone && (
                <a
                  href={`tel:${contact.direct_phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-3 hover:text-primary transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">Direct</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.direct_phone}
                    </p>
                  </div>
                </a>
              )}

              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                </div>
              </a>
            </CardContent>
          </Card>

          {/* Office Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Office Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
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

          {/* Quick Response Promise */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Quick Response Promise</h3>
              <p className="text-sm opacity-90">
                We strive to respond to all inquiries within 24 hours during
                business days. For urgent matters, please call us directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ContactFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}
