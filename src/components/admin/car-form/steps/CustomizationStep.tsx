import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface CustomizationStepProps {
  onComplete: (data: any) => void;
  initialData: any;
}

export const CustomizationStep = ({ onComplete, initialData }: CustomizationStepProps) => {
  const [colors, setColors] = useState<{ name: string; code: string }[]>([
    { name: "", code: "#000000" },
  ]);
  const [interiors, setInteriors] = useState<{ name: string }[]>([{ name: "" }]);

  const addColor = () => {
    setColors([...colors, { name: "", code: "#000000" }]);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, field: "name" | "code", value: string) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  const addInterior = () => {
    setInteriors([...interiors, { name: "" }]);
  };

  const removeInterior = (index: number) => {
    setInteriors(interiors.filter((_, i) => i !== index));
  };

  const updateInterior = (index: number, value: string) => {
    const newInteriors = [...interiors];
    newInteriors[index].name = value;
    setInteriors(newInteriors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      ...initialData,
      colors,
      interiors,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Цвета</Label>
            <Button type="button" variant="outline" size="sm" onClick={addColor}>
              <Plus className="w-4 h-4 mr-1" /> Добавить цвет
            </Button>
          </div>
          {colors.map((color, index) => (
            <div key={index} className="flex gap-2 items-start">
              <Input
                value={color.name}
                onChange={(e) => updateColor(index, "name", e.target.value)}
                placeholder="Название цвета"
                required
              />
              <Input
                type="color"
                value={color.code}
                onChange={(e) => updateColor(index, "code", e.target.value)}
                required
                className="w-20"
              />
              {colors.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeColor(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Варианты салона</Label>
            <Button type="button" variant="outline" size="sm" onClick={addInterior}>
              <Plus className="w-4 h-4 mr-1" /> Добавить вариант салона
            </Button>
          </div>
          {interiors.map((interior, index) => (
            <div key={index} className="flex gap-2 items-start">
              <Input
                value={interior.name}
                onChange={(e) => updateInterior(index, e.target.value)}
                placeholder="Название варианта салона"
                required
              />
              {interiors.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeInterior(index)}
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