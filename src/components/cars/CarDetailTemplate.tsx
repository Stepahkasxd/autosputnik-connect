import { Car } from "@/data/cars";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Battery, Car as CarIcon, Gauge, Timer, Zap, CheckCircle2, Sparkles } from "lucide-react";

interface CarDetailTemplateProps {
  car: Car;
}

const CarDetailTemplate = ({ car }: CarDetailTemplateProps) => {
  const [selectedColor, setSelectedColor] = useState(car?.colors[0]);
  const [selectedInterior, setSelectedInterior] = useState(car?.interiors[0]?.name);
  const [selectedTrim, setSelectedTrim] = useState(car?.trims[0]);
  const [currentImage, setCurrentImage] = useState(car?.image);

  useEffect(() => {
    // Update the displayed image when color changes
    if (selectedColor?.image_url) {
      setCurrentImage(selectedColor.image_url);
    } else {
      setCurrentImage(car.image);
    }
  }, [selectedColor, car.image]);

  // Helper function to check if a spec exists and has a value
  const hasSpec = (spec: string | undefined | null): boolean => {
    return spec !== undefined && spec !== null && spec !== '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-up">
      {/* Left Column - Image and Colors */}
      <div className="space-y-8">
        <Card className="overflow-hidden bg-gradient-to-b from-gray-50 to-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <AspectRatio ratio={16 / 9}>
            {currentImage ? (
              <img
                src={currentImage}
                alt={car.name}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <CarIcon className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </AspectRatio>
        </Card>

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
      <div className="space-y-8">
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-transparent shadow-lg">
          <h1 className="text-3xl font-bold mb-2 animate-fade-up">{car.name}</h1>
          <p className="text-2xl font-semibold text-primary animate-fade-up delay-100">{car.basePrice}</p>
        </Card>

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

        {/* Dynamic Specifications Section */}
        <Card className="p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Характеристики</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {hasSpec(car.specs.power) && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                <Zap className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Мощность</p>
                  <p className="font-semibold">{car.specs.power}</p>
                </div>
              </div>
            )}
            {hasSpec(car.specs.acceleration) && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                <Timer className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Разгон</p>
                  <p className="font-semibold">{car.specs.acceleration}</p>
                </div>
              </div>
            )}
            {hasSpec(car.specs.batteryCapacity) && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                <Battery className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Батарея</p>
                  <p className="font-semibold">{car.specs.batteryCapacity}</p>
                </div>
              </div>
            )}
            {hasSpec(car.specs.range) && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                <Gauge className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Запас хода</p>
                  <p className="font-semibold">{car.specs.range}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

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
                  "flex items-center justify-between p-4 rounded-lg border transition-all duration-300",
                  selectedTrim?.name === trim.name
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                )}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={trim.name} id={trim.name} />
                  <Label htmlFor={trim.name} className="font-medium">{trim.name}</Label>
                </div>
                <span className="font-semibold text-primary">{trim.price}</span>
              </div>
            ))}
          </RadioGroup>
        </Card>
      </div>
    </div>
  );
};

export default CarDetailTemplate;