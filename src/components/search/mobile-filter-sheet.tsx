"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { FilterPanel } from "./filter-panel";

export function MobileFilterSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Properties</SheetTitle>
        </SheetHeader>
        <FilterPanel className="mt-6" />
      </SheetContent>
    </Sheet>
  );
}
