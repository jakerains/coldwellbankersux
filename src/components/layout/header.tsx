"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useSyncExternalStore } from "react";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Home", href: "/" },
  {
    label: "Properties",
    href: "/search",
    submenu: [
      { label: "Property Search", href: "/search" },
      { label: "Featured Listings", href: "/search?featured=true" },
    ],
  },
  { label: "Agents", href: "/agents" },
  {
    label: "About",
    href: "/about",
    submenu: [
      { label: "Our Story", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "Home Valuation", href: "/home-valuation" },
];

// Hydration-safe mount detection using useSyncExternalStore
const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
  const pathname = usePathname();

  // Only use transparent header on home page (which has a dark hero)
  const isHomePage = pathname === "/";

  // Scroll-aware header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Header should be solid (non-transparent) unless we're on home page AND not scrolled
  const useTransparentHeader = isHomePage && !isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        useTransparentHeader
          ? "bg-transparent border-transparent"
          : "bg-background/95 backdrop-blur border-b supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="container mx-auto flex h-24 items-center justify-between px-4">
        {/* Logo - Global Luxury branding with filter for transparency */}
        <Link href="/" className="flex items-center space-x-2">
          {/* Light logo for transparent header on dark hero */}
          <Image
            src="/cblight.png"
            alt="Coldwell Banker Global Luxury"
            width={200}
            height={100}
            className={cn(
              "h-20 w-auto transition-all duration-300",
              !useTransparentHeader && "hidden"
            )}
            priority
          />
          {/* Dark logo for solid header on light background */}
          <Image
            src="/logos/logo1.png"
            alt="Coldwell Banker Global Luxury"
            width={200}
            height={100}
            className={cn(
              "h-20 w-auto transition-all duration-300",
              useTransparentHeader && "hidden"
            )}
            priority
          />
        </Link>

        {/* Desktop Navigation - only render after mount to prevent Radix hydration mismatch */}
        {isMounted && (
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigation.map((item) =>
                item.submenu ? (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger
                      className={cn(
                        "bg-transparent transition-colors duration-300",
                        useTransparentHeader && "text-white hover:text-white/80 data-[state=open]:text-white"
                      )}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-1 p-2">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.label}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={subItem.href}
                                className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                {subItem.label}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent transition-colors duration-300",
                          useTransparentHeader && "text-white hover:text-white/80"
                        )}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Right side: Phone & CTA */}
        <div className="hidden items-center gap-6 lg:flex">
          <a
            href="tel:7122557310"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors duration-300",
              useTransparentHeader
                ? "text-white/90 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Phone className="h-4 w-4" />
            (712) 255-7310
          </a>
          <Button
            asChild
            variant={useTransparentHeader ? "outline" : "default"}
            className={cn(
              "transition-all duration-300",
              useTransparentHeader && "border-2 border-white bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-[#0033A0]"
            )}
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Mobile Menu - only render after mount to prevent Radix hydration mismatch */}
        {isMounted && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors duration-300",
                  useTransparentHeader && "text-white hover:text-white hover:bg-white/10"
                )}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-4 pt-8">
                {navigation.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      className="text-lg font-medium hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.submenu && (
                      <div className="ml-4 mt-2 flex flex-col gap-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="mt-6 border-t pt-6">
                  <a
                    href="tel:7122557310"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    (712) 255-7310
                  </a>
                  <Button asChild className="mt-4 w-full">
                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
