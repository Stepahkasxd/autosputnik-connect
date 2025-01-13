import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Car as CarIcon, Gauge, Timer, Zap, CheckCircle2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Car } from "@/data/cars";

interface Zeekr001DetailProps {
  car: Car;
}

const Zeekr001Detail = ({ car }: Zeekr001DetailProps) => {
  const [selectedColor, setSelectedColor] = useState(car?.colors[0]?.code);
  const [selectedInterior, setSelectedInterior] = useState(car?.interiors[0]?.name);
  const [selectedTrim, setSelectedTrim] = useState(car?.trims[0]?.name);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Image and Colors */}
      <div className="space-y-8">
        <div className="rounded-lg overflow-hidden bg-gray-100 glass-card">
          <AspectRatio ratio={16 / 9}>
            {car.image ? (
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CarIcon className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </AspectRatio>
        </div>

        {/* Color Selection */}
        <div className="space-y-4 glass-card p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Цвет кузова</h3>
          <div className="grid grid-cols-3 gap-4">
            {car.colors.map((color) => (
              <button
                key={color.code}
                onClick={() => setSelectedColor(color.code)}
                className={cn(
                  "relative p-4 rounded-lg border transition-all duration-200",
                  selectedColor === color.code
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
                {selectedColor === color.code && (
                  <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Details */}
      <div className="space-y-8">
        <div className="glass-card p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
          <p className="text-2xl font-semibold text-primary">{car.basePrice}</p>
        </div>

        {/* Interior Selection */}
        <div className="glass-card p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Варианты салона</h3>
          <RadioGroup
            value={selectedInterior}
            onValueChange={setSelectedInterior}
            className="space-y-2"
          >
            {car.interiors.map((interior) => (
              <div key={interior.name} className="flex items-center space-x-2">
                <RadioGroupItem value={interior.name} id={interior.name} />
                <Label htmlFor={interior.name}>{interior.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Specifications */}
        <div className="glass-card p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Характеристики</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CarIcon className="w-5 h-5 text-gray-500" />
              <span>{car.specs.drive}</span>
            </div>
            {car.specs.range && (
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-gray-500" />
                <span>Запас хода: {car.specs.range}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-gray-500" />
              <span>Разгон: {car.specs.acceleration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-gray-500" />
              <span>Мощность: {car.specs.power}</span>
            </div>
          </div>
        </div>

        {/* Trims */}
        <div className="glass-card p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Комплектации</h3>
          <RadioGroup
            value={selectedTrim}
            onValueChange={setSelectedTrim}
            className="space-y-4"
          >
            {car.trims.map((trim) => (
              <div
                key={trim.name}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-all duration-200",
                  selectedTrim === trim.name
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
        </div>

        {/* Additional Features */}
        {car.specs.additionalFeatures && (
          <div className="glass-card p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">Дополнительные характеристики</h3>
            <ul className="space-y-2">
              {car.specs.additionalFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Zeekr001Detail;