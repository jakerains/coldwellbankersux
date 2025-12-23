"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { submitContactForm, ContactFormState } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";

const subjects = [
  "General Inquiry",
  "Buying a Home",
  "Selling a Home",
  "Property Information",
  "Schedule a Showing",
  "Home Valuation",
  "Other",
];

export function ContactForm() {
  const searchParams = useSearchParams();
  const propertyFromUrl = searchParams.get("property") || "";

  const initialState: ContactFormState = {
    success: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    initialState
  );

  if (state.success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
        <p className="text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.message && !state.success && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {state.message}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            disabled={isPending}
          />
          {state.errors?.name && (
            <p className="text-sm text-destructive">{state.errors.name[0]}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            disabled={isPending}
          />
          {state.errors?.email && (
            <p className="text-sm text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(555) 555-5555"
            disabled={isPending}
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">
            Subject <span className="text-destructive">*</span>
          </Label>
          <Select name="subject" required disabled={isPending} defaultValue={propertyFromUrl ? "Property Information" : ""}>
            <SelectTrigger id="subject">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.subject && (
            <p className="text-sm text-destructive">{state.errors.subject[0]}</p>
          )}
        </div>
      </div>

      {/* Property (hidden if not from URL) */}
      {propertyFromUrl && (
        <div className="space-y-2">
          <Label htmlFor="property">Property of Interest</Label>
          <Input
            id="property"
            name="property"
            defaultValue={propertyFromUrl}
            readOnly
            className="bg-muted"
          />
        </div>
      )}
      <input type="hidden" name="property" value={propertyFromUrl} />

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="How can we help you?"
          rows={5}
          required
          disabled={isPending}
        />
        {state.errors?.message && (
          <p className="text-sm text-destructive">{state.errors.message[0]}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
