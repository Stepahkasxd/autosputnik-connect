import { Car } from "@/data/cars";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Gauge, Car as CarIcon } from "lucide-react";

interface LixiangL7DetailProps {
  car: Car;
}

const LixiangL7Detail = ({ car }: LixiangL7DetailProps) => {
  const [selectedColor, setSelectedColor] = useState(car.colors[0]);
  const [selectedInterior, setSelectedInterior] = useState(car.interiors[0].name);
  const [selectedTrim, setSelectedTrim] = useState(car.trims[0]);

  return (
    <div className="space-y-8 pb-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{car.name}</h1>
        <p className="text-xl text-gray-600">{car.basePrice}</p>
      </div>

      {/* Color Selection */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Цвет кузова</h2>
        <div className="flex gap-4 flex-wrap">
          {car.colors.map((color) => (
            <button
              key={color.code}
              onClick={() => setSelectedColor(color)}
              className={`w-16 h-16 rounded-full border-4 transition-all ${
                selectedColor.code === color.code
                  ? "border-blue-500 scale-110"
                  : "border-transparent scale-100"
              }`}
              style={{ backgroundColor: color.code }}
              title={color.name}
            />
          ))}
        </div>
        <p className="text-lg text-gray-600">{selectedColor.name}</p>
      </div>

      {/* Interior Selection */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Интерьер</h2>
        <RadioGroup value={selectedInterior} onValueChange={setSelectedInterior}>
          {car.interiors.map((interior) => (
            <div key={interior.name} className="flex items-center space-x-2">
              <RadioGroupItem value={interior.name} id={interior.name} />
              <Label htmlFor={interior.name}>{interior.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Trim Selection */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Комплектация</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {car.trims.map((trim) => (
            <div
              key={trim.name}
              onClick={() => setSelectedTrim(trim)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                selectedTrim.name === trim.name
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-200"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">{trim.name}</h3>
              <p className="text-lg text-gray-600">{trim.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Характеристики</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3">
            <ArrowRight className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Длина</p>
              <p className="font-semibold">{car.specs.dimensions}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CarIcon className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Колесная база</p>
              <p className="font-semibold">{car.specs.wheelbase}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Gauge className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Мощность</p>
              <p className="font-semibold">{car.specs.power}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LixiangL7Detail;