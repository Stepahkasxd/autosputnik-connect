import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Car } from "@/data/cars";
import { CarImage } from "./CarImage";
import { OrderForm } from "./OrderForm";
import { CarSpecsDisplay } from "./CarSpecs";
import { TrimSelector } from "./TrimSelector";

interface CarDetailTemplateProps {
  car: Car;
}

const CarDetailTemplate = ({ car }: CarDetailTemplateProps) => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(car?.colors[0]);
  const [selectedTrim, setSelectedTrim] = useState(car?.trims[0]);
  const [currentImage, setCurrentImage] = useState(car?.image);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const allImages = [
    car.image,
    ...car.colors
      .map(color => color.image_url)
      .filter((url): url is string => url !== undefined && url !== null)
  ];

  useEffect(() => {
    if (selectedColor?.image_url) {
      setCurrentImage(selectedColor.image_url);
      const newIndex = allImages.findIndex(img => img === selectedColor.image_url);
      if (newIndex !== -1) {
        setCurrentImageIndex(newIndex);
      }
    } else {
      setCurrentImage(car.image);
      setCurrentImageIndex(0);
    }
  }, [selectedColor, car.image, allImages]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === allImages.length - 1 ? 0 : prev + 1;
      setCurrentImage(allImages[newIndex]);
      return newIndex;
    });
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === 0 ? allImages.length - 1 : prev - 1;
      setCurrentImage(allImages[newIndex]);
      return newIndex;
    });
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 hover:bg-secondary"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <CarImage
            currentImage={currentImage}
            allImages={allImages}
            currentImageIndex={currentImageIndex}
            onImageClick={() => setIsImageModalOpen(true)}
            onPreviousClick={previousImage}
            onNextClick={nextImage}
          />

          <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Заказать {car.name}</DialogTitle>
              </DialogHeader>
              <OrderForm
                carName={car.name}
                selectedTrim={selectedTrim}
                onClose={() => setIsOrderModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-8 pr-4">
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-transparent shadow-lg">
              <h1 className="text-3xl font-bold mb-2 animate-fade-up">{car.name}</h1>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold text-primary animate-fade-up delay-100">
                  {selectedTrim ? selectedTrim.price : car.basePrice}
                </p>
                <Button 
                  onClick={() => setIsOrderModalOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Заказать
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            <CarSpecsDisplay specs={car.specs} />

            <TrimSelector
              trims={car.trims}
              selectedTrim={selectedTrim}
              onTrimChange={(trimName) => {
                const trim = car.trims.find((t) => t.name === trimName);
                if (trim) setSelectedTrim(trim);
              }}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CarDetailTemplate;