import React from "react";
import { useParams } from "react-router-dom";
import { cars } from "@/data/cars";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Car as CarIcon, Gauge, Timer, Zap, Circle } from "lucide-react";

const CarDetail = () => {
  const { id } = useParams();
  const car = cars.find((c) => c.id === id);

  if (!car) {
    return <div className="container mx-auto px-4 pt-24">Автомобиль не найден</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image and Colors */}
        <div className="space-y-6">
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
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
          </div>

          {/* Color Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Цвет кузова</h3>
            <RadioGroup defaultValue={car.colors[0]?.code} className="grid grid-cols-3 gap-4">
              {car.colors.map((color) => (
                <div key={color.code} className="flex items-center space-x-2">
                  <RadioGroupItem value={color.code} id={color.code} />
                  <Label htmlFor={color.code} className="flex items-center gap-2">
                    <Circle className="w-4 h-4" style={{ color: color.code }} fill={color.code} />
                    {color.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Interior Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Варианты салона</h3>
            <RadioGroup defaultValue={car.interiors[0]?.name} className="space-y-2">
              {car.interiors.map((interior) => (
                <div key={interior.name} className="flex items-center space-x-2">
                  <RadioGroupItem value={interior.name} id={interior.name} />
                  <Label htmlFor={interior.name}>{interior.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
            <p className="text-2xl font-semibold text-primary">{car.basePrice}</p>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Комплектации</h3>
            <RadioGroup defaultValue={car.trims[0]?.name} className="space-y-4">
              {car.trims.map((trim) => (
                <div key={trim.name} className="flex items-center justify-between p-4 rounded-lg border">
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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Дополнительные характеристики</h3>
              <ul className="list-disc list-inside space-y-2">
                {car.specs.additionalFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetail;