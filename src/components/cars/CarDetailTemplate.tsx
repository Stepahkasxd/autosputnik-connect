import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  Battery, 
  Car as CarIcon, 
  Gauge, 
  Timer, 
  Zap, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Car } from "@/data/cars";

interface CarDetailTemplateProps {
  car: Car;
}

const CarDetailTemplate = ({ car }: CarDetailTemplateProps) => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(car?.colors[0]);
  const [selectedInterior, setSelectedInterior] = useState(car?.interiors[0]?.name);
  const [selectedTrim, setSelectedTrim] = useState(car?.trims[0]);
  const [currentImage, setCurrentImage] = useState(car?.image);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleBack = () => {
    navigate(-1);
  };

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

  // Helper function to check if specs exist and have values
  const hasSpecs = (specs: Record<string, string | undefined> | undefined): boolean => {
    return specs !== undefined && Object.keys(specs).length > 0;
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
        {/* Left Column - Image and Colors */}
        <div className="space-y-8">
          <Card className="overflow-hidden bg-gradient-to-b from-gray-50 to-white shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
            <AspectRatio ratio={16 / 9}>
              {currentImage ? (
                <>
                  <img
                    src={currentImage}
                    alt={car.name}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105 cursor-pointer"
                    onClick={() => setIsImageModalOpen(true)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsImageModalOpen(true)}
                  >
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                  {allImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={previousImage}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={nextImage}
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

          {/* Image Modal */}
          <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
            <DialogContent className="max-w-[90vw] h-[90vh] p-0">
              <div className="relative w-full h-full">
                <TransformWrapper>
                  <TransformComponent>
                    <img
                      src={allImages[currentImageIndex]}
                      alt={car.name}
                      className="w-full h-full object-contain"
                    />
                  </TransformComponent>
                </TransformWrapper>
                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2"
                      onClick={previousImage}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Card className="p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Цвет кузова</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {car.colors.map((color) => (
                <button
                  key={color.code}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "relative p-4 rounded-lg border transition-all duration-300",
                    selectedColor?.code === color.code
                      ? "border-primary shadow-lg scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:scale-102"
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full border shadow-inner transition-transform duration-300 hover:scale-110"
                      style={{ backgroundColor: color.code }}
                    />
                    <span className="text-sm text-center font-medium">{color.name}</span>
                  </div>
                  {selectedColor?.code === color.code && (
                    <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary animate-fade-in" />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Details */}
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-8 pr-4">
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-transparent shadow-lg">
              <h1 className="text-3xl font-bold mb-2 animate-fade-up">{car.name}</h1>
              <p className="text-2xl font-semibold text-primary animate-fade-up delay-100">
                {selectedTrim ? selectedTrim.price : car.basePrice}
              </p>
            </Card>

            {/* Interior Selection */}
            <Card className="p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Интерьер</h3>
              </div>
              <RadioGroup value={selectedInterior} onValueChange={setSelectedInterior}>
                {car.interiors.map((interior) => (
                  <div key={interior.name} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={interior.name} id={interior.name} />
                    <Label htmlFor={interior.name} className="font-medium">{interior.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </Card>

            {/* Base Specifications */}
            {hasSpecs(car.specs) && (
              <Card className="p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Базовые характеристики</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(car.specs).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">{key}</p>
                          <p className="font-semibold">{value}</p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </Card>
            )}

            {/* Trims */}
            <Card className="p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Комплектации</h3>
              </div>
              <RadioGroup
                value={selectedTrim?.name}
                onValueChange={(value) => {
                  const trim = car.trims.find((t) => t.name === value);
                  if (trim) setSelectedTrim(trim);
                }}
                className="space-y-4"
              >
                {car.trims.map((trim) => (
                  <div
                    key={trim.name}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-300",
                      selectedTrim?.name === trim.name
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={trim.name} id={trim.name} />
                        <Label htmlFor={trim.name} className="font-medium">{trim.name}</Label>
                      </div>
                      <span className="font-semibold text-primary">{trim.price}</span>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CarDetailTemplate;
