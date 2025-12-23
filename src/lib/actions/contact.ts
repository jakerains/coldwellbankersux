"use server";

import { z } from "zod";

// Contact form schema
const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  property: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitContactForm(
  prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  // Parse form data
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    subject: formData.get("subject") as string,
    property: formData.get("property") as string,
    message: formData.get("message") as string,
  };

  // Validate
  const result = ContactSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: "Please fix the errors below",
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, you would send an email here
  // For this POC, we just return success
  console.log("Contact form submitted:", result.data);

  return {
    success: true,
    message: "Thank you for your message! We'll get back to you within 24 hours.",
  };
}
