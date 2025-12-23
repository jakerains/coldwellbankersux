import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Coldwell Banker Associated Brokers Realty | Sioux City Real Estate",
  description:
    "Find your dream home in Sioux City, IA and the greater Siouxland area. Coldwell Banker Associated Brokers Realty has been serving buyers and sellers since 1980.",
  keywords: [
    "real estate",
    "Sioux City",
    "Iowa",
    "homes for sale",
    "Coldwell Banker",
    "Siouxland",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Coldwell Banker Associated Brokers Realty",
    description: "Find your dream home in Sioux City and Siouxland",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
