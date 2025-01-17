import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface BasicInfoStepProps {
  onComplete: (data: any) => void;
  initialData: any;
}

export const BasicInfoStep = ({ onComplete, initialData }: BasicInfoStepProps) => {
  const [name, setName] = useState(initialData.name);
  const [basePrice, setBasePrice] = useState(initialData.basePrice);
  const [power, setPower] = useState(initialData.power);
  const [acceleration, setAcceleration] = useState(initialData.acceleration);
  const [range, setRange] = useState(initialData.range);
  const [trims, setTrims] = useState(initialData.trims);

  const addTrim = () => {
    setTrims([...trims, { name: "", price: "", specs: {} }]);
  };

  const removeTrim = (index: number) => {
    setTrims(trims.filter((_: any, i: number) => i !== index));
  };

  const updateTrim = (index: number, field: string, value: string) => {
    const newTrims = [...trims];
    newTrims[index][field] = value;
    setTrims(newTrims);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      name,
      basePrice,
      power,
      acceleration,
      range,
      trims,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Название модели</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Например: Zeekr 001"
          />
        </div>

        <div>
          <Label htmlFor="basePrice">Базовая цена</Label>
          <Input
            id="basePrice"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
            placeholder="Например: от 5 990 000 ₽"
          />
        </div>

        <div>
          <Label htmlFor="power">Мощность</Label>
          <Input
            id="power"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            placeholder="Например: 400 кВт"
          />
        </div>

        <div>
          <Label htmlFor="acceleration">Разгон до 100 км/ч</Label>
          <Input
            id="acceleration"
            value={acceleration}
            onChange={(e) => setAcceleration(e.target.value)}
            placeholder="Например: 3,8 с"
          />
        </div>

        <div>
          <Label htmlFor="range">Запас хода</Label>
          <Input
            id="range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="Например: 656 км"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Комплектации</Label>
            <Button type="button" variant="outline" size="sm" onClick={addTrim}>
              <Plus className="w-4 h-4 mr-1" /> Добавить комплектацию
            </Button>
          </div>
          {trims.map((trim: any, index: number) => (
            <div key={index} className="flex gap-2 items-start">
              <Input
                value={trim.name}
                onChange={(e) => updateTrim(index, "name", e.target.value)}
                placeholder="Название комплектации"
                required
              />
              <Input
                value={trim.price}
                onChange={(e) => updateTrim(index, "price", e.target.value)}
                placeholder="Цена"
                required
              />
              {trims.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTrim(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Далее
      </Button>
    </form>
  );
};