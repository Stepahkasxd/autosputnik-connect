import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Battery, Gauge, Zap } from "lucide-react";
import type { Car } from "@/data/cars";

interface LixiangMegaDetailProps {
  car: Car;
}

export default function LixiangMegaDetail({ car }: LixiangMegaDetailProps) {
  const [selectedColor, setSelectedColor] = useState(car.colors[0]);
  const [selectedInterior, setSelectedInterior] = useState(car.interiors[0]);
  const [selectedTrim, setSelectedTrim] = useState(car.trims[0]);

  return (
    <div className="space-y-8 pb-16 animate-fade-up">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{car.name}</h1>
        <p className="text-2xl font-semibold text-primary">{selectedTrim.price}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Цвет кузова</h3>
            <RadioGroup
              defaultValue={selectedColor.name}
              onValueChange={(value) => {
                const color = car.colors.find((c) => c.name === value);
                if (color) setSelectedColor(color);
              }}
              className="grid grid-cols-3 gap-4"
            >
              {car.colors.map((color) => (
                <div key={color.name} className="text-center space-y-2">
                  <RadioGroupItem
                    value={color.name}
                    id={`color-${color.name}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`color-${color.name}`}
                    className="flex flex-col items-center space-y-2 cursor-pointer peer-aria-checked:ring-2 peer-aria-checked:ring-primary rounded-lg p-2"
                  >
                    <div
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                      style={{ backgroundColor: color.code }}
                    />
                    <span className="text-sm">{color.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Интерьер</h3>
            <RadioGroup
              defaultValue={selectedInterior.name}
              onValueChange={(value) => {
                const interior = car.interiors.find((i) => i.name === value);
                if (interior) setSelectedInterior(interior);
              }}
              className="grid gap-4"
            >
              {car.interiors.map((interior) => (
                <div key={interior.name}>
                  <RadioGroupItem
                    value={interior.name}
                    id={`interior-${interior.name}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`interior-${interior.name}`}
                    className="flex items-center justify-between rounded-lg border p-4 cursor-pointer peer-aria-checked:border-primary"
                  >
                    <span>{interior.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Комплектация</h3>
            <RadioGroup
              defaultValue={selectedTrim.name}
              onValueChange={(value) => {
                const trim = car.trims.find((t) => t.name === value);
                if (trim) setSelectedTrim(trim);
              }}
              className="grid gap-4"
            >
              {car.trims.map((trim) => (
                <div key={trim.name}>
                  <RadioGroupItem
                    value={trim.name}
                    id={`trim-${trim.name}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`trim-${trim.name}`}
                    className="flex items-center justify-between rounded-lg border p-4 cursor-pointer peer-aria-checked:border-primary"
                  >
                    <span>{trim.name}</span>
                    <span className="font-semibold">{trim.price}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h3 className="text-lg font-semibold">Характеристики</h3>
          <div className="grid gap-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
              <Zap className="w-6 h-6" />
              <div>
                <p className="text-sm text-muted-foreground">Мощность</p>
                <p className="font-semibold">{car.specs.power}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
              <Battery className="w-6 h-6" />
              <div>
                <p className="text-sm text-muted-foreground">Запас хода</p>
                <p className="font-semibold">{car.specs.range}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary">
              <Gauge className="w-6 h-6" />
              <div>
                <p className="text-sm text-muted-foreground">Разгон</p>
                <p className="font-semibold">{car.specs.acceleration}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}