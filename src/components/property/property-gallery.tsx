"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X, Expand, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface PropertyGalleryProps {
  images?: string[];
  address: string;
}

export function PropertyGallery({ images, address }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const hasImages = images && images.length > 0;
  const displayImages = hasImages ? images : ["/placeholder-property.jpg"];

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <div className="relative">
        {/* Main Image */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image
                src={displayImages[currentIndex]}
                alt={`${address} - Image ${currentIndex + 1}`}
                fill
                className="object-cover"
                priority={currentIndex === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Image Coming Soon Overlay */}
          {!hasImages && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
              <Camera className="h-16 w-16 text-white/80 mb-2" />
              <span className="text-white font-medium text-lg">
                Image Coming Soon
              </span>
            </div>
          )}

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white"
                onClick={goToNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Expand Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-4 rounded-full bg-white/90 hover:bg-white"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Expand className="h-4 w-4" />
          </Button>

          {/* Image Counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
              {currentIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {displayImages.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md transition-all ${
                  index === currentIndex
                    ? "ring-2 ring-primary ring-offset-2"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none">
          <VisuallyHidden>
            <DialogTitle>Property Image Gallery</DialogTitle>
          </VisuallyHidden>
          <div className="relative h-[90vh] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Image
                  src={displayImages[currentIndex]}
                  alt={`${address} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Navigation Arrows */}
            {displayImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-white">
              {currentIndex + 1} / {displayImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
