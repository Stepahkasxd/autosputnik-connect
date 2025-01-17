import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoStepProps {
  onComplete: (data: any) => void;
  initialData: any;
}

export const BasicInfoStep = ({ onComplete, initialData }: BasicInfoStepProps) => {
  const [name, setName] = useState(initialData.name);
  const [basePrice, setBasePrice] = useState(initialData.basePrice);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);

  // Список доступных характеристик
  const availableSpecs = [
    "Мощность",
    "Разгон до 100 км/ч",
    "Запас хода",
    "Максимальная скорость",
    "Тип привода",
    "Емкость батареи",
    "Время зарядки",
    "Клиренс",
    "Колесная база",
    "Масса",
  ];

  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Преобразуем массив specs в объект для сохранения
    const specsObject = specs.reduce((acc, spec) => {
      if (spec.key && spec.value) {
        acc[spec.key] = spec.value;
      }
      return acc;
    }, {} as Record<string, string>);

    onComplete({
      name,
      basePrice,
      specs: specsObject,
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

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Характеристики</Label>
            <Button type="button" variant="outline" size="sm" onClick={addSpec}>
              <Plus className="w-4 h-4 mr-1" /> Добавить характеристику
            </Button>
          </div>
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-2 items-start">
              <Select
                value={spec.key}
                onValueChange={(value) => updateSpec(index, "key", value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Выберите характеристику" />
                </SelectTrigger>
                <SelectContent>
                  {availableSpecs
                    .filter((specName) => 
                      !specs.some((s, i) => i !== index && s.key === specName)
                    )
                    .map((specName) => (
                      <SelectItem key={specName} value={specName}>
                        {specName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Input
                value={spec.value}
                onChange={(e) => updateSpec(index, "value", e.target.value)}
                placeholder="Значение"
                required={!!spec.key}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSpec(index)}
              >
                <X className="w-4 h-4" />
              </Button>
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