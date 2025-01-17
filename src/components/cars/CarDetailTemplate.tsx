import { Car } from "@/data/cars";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Battery, Car as CarIcon, Gauge, Timer, Zap, CheckCircle2 } from "lucide-react";

interface CarDetailTemplateProps {
  car: Car;
}

const CarDetailTemplate = ({ car }: CarDetailTemplateProps) => {
  const [selectedColor, setSelectedColor] = useState(car?.colors[0]);
  const [selectedInterior, setSelectedInterior] = useState(car?.interiors[0]?.name);
  const [selectedTrim, setSelectedTrim] = useState(car?.trims[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-up">
      {/* Left Column - Image and Colors */}
      <div className="space-y-8">
        <Card className="overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <AspectRatio ratio={16 / 9}>
            {car.image ? (
              <img
                src={car.image}
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

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Цвет кузова</h3>
          <div className="grid grid-cols-3 gap-4">
            {car.colors.map((color) => (
              <button
                key={color.code}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "relative p-4 rounded-lg border transition-all duration-200",
                  selectedColor?.code === color.code
                    ? "border-primary shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border shadow-inner"
                    style={{ backgroundColor: color.code }}
                  />
                  <span className="text-sm text-center">{color.name}</span>
                </div>
                {selectedColor?.code === color.code && (
                  <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Right Column - Details */}
      <div className="space-y-8">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
          <p className="text-2xl font-semibold text-primary">{car.basePrice}</p>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Интерьер</h3>
          <RadioGroup value={selectedInterior} onValueChange={setSelectedInterior}>
            {car.interiors.map((interior) => (
              <div key={interior.name} className="flex items-center space-x-2">
                <RadioGroupItem value={interior.name} id={interior.name} />
                <Label htmlFor={interior.name}>{interior.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Характеристики</h3>
          <div className="grid grid-cols-2 gap-4">
            {car.specs.power && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                <Zap className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Мощность</p>
                  <p className="font-semibold">{car.specs.power}</p>
                </div>
              </div>
            )}
            {car.specs.acceleration && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                <Timer className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Разгон</p>
                  <p className="font-semibold">{car.specs.acceleration}</p>
                </div>
              </div>
            )}
            {car.specs.batteryCapacity && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                <Battery className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Батарея</p>
                  <p className="font-semibold">{car.specs.batteryCapacity}</p>
                </div>
              </div>
            )}
            {car.specs.range && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                <Gauge className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Запас хода</p>
                  <p className="font-semibold">{car.specs.range}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Комплектации</h3>
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
                  "flex items-center justify-between p-4 rounded-lg border transition-all duration-200",
                  selectedTrim?.name === trim.name
                    ? "border-primary bg-primary/5"
                    : "border-gray-200"
                )}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={trim.name} id={trim.name} />
                  <Label htmlFor={trim.name}>{trim.name}</Label>
                </div>
                <span className="font-semibold">{trim.price}</span>
              </div>
            ))}
          </RadioGroup>
        </Card>
      </div>
    </div>
  );
};

export default CarDetailTemplate;