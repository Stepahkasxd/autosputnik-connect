import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

interface ColorInput {
  name: string;
  code: string;
  imageFile?: File;
  imageUrl?: string;
}

interface ColorsSectionProps {
  colors: ColorInput[];
  onColorsChange: (colors: ColorInput[]) => void;
}

export const ColorsSection = ({ colors, onColorsChange }: ColorsSectionProps) => {
  const addColor = () => {
    onColorsChange([...colors, { name: "", code: "" }]);
  };

  const removeColor = (index: number) => {
    onColorsChange(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, field: keyof ColorInput, value: string | File) => {
    onColorsChange(colors.map((color, i) => 
      i === index ? { ...color, [field]: value } : color
    ));
  };

  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-medium mb-4">Цвета</h3>
      <div className="space-y-4">
        {colors.map((color, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1">
              <Label>Название цвета</Label>
              <Input
                value={color.name}
                onChange={(e) => updateColor(index, "name", e.target.value)}
                placeholder="Например: Черный металлик"
              />
            </div>
            <div className="flex-1">
              <Label>Код цвета</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={color.code}
                  onChange={(e) => updateColor(index, "code", e.target.value)}
                  className="w-16"
                />
                <Input
                  value={color.code}
                  onChange={(e) => updateColor(index, "code", e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
            <div className="flex-1">
              <Label>Фото автомобиля в этом цвете</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    updateColor(index, "imageFile", file);
                  }
                }}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-6"
              onClick={() => removeColor(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addColor}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Добавить цвет
        </Button>
      </div>
    </div>
  );
};