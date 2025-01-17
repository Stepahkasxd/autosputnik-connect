import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarIcon, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface CarImageProps {
  currentImage: string | undefined;
  allImages: string[];
  currentImageIndex: number;
  onImageClick: () => void;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

export const CarImage = ({
  currentImage,
  allImages,
  currentImageIndex,
  onImageClick,
  onPreviousClick,
  onNextClick
}: CarImageProps) => {
  return (
    <Card className="overflow-hidden bg-gradient-to-b from-gray-50 to-white shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
      <AspectRatio ratio={16 / 9}>
        {currentImage ? (
          <>
            <img
              src={currentImage}
              alt="Car"
              className="w-full h-full object-cover transition-all duration-500 hover:scale-105 cursor-pointer"
              onClick={onImageClick}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onImageClick}
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={onPreviousClick}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={onNextClick}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <CarIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </AspectRatio>
    </Card>
  );
};