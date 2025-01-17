import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { CarSpecs } from "@/data/cars";
import { SpecsSection } from "./SpecsSection";

interface TrimInput {
  name: string;
  price: string;
  specs: CarSpecs;
}

interface TrimsSectionProps {
  trims: TrimInput[];
  trimDisabledSpecs: Record<string, Record<string, boolean>>;
  onTrimsChange: (trims: TrimInput[]) => void;
  onTrimSpecToggle: (trimIndex: number, field: string) => void;
}

export const TrimsSection = ({ 
  trims, 
  trimDisabledSpecs, 
  onTrimsChange,
  onTrimSpecToggle
}: TrimsSectionProps) => {
  const addTrim = () => {
    onTrimsChange([...trims, { 
      name: "", 
      price: "", 
      specs: {
        acceleration: "",
        power: "",
        drive: "",
        range: "",
        batteryCapacity: "",
        dimensions: "",
        wheelbase: "",
        additionalFeatures: [],
      }
    }]);
  };

  const removeTrim = (index: number) => {
    onTrimsChange(trims.filter((_, i) => i !== index));
  };

  const updateTrim = (index: number, field: keyof TrimInput, value: string | CarSpecs) => {
    onTrimsChange(trims.map((trim, i) => 
      i === index ? { ...trim, [field]: value } : trim
    ));
  };

  const handleTrimSpecChange = (trimIndex: number, field: keyof CarSpecs, value: string) => {
    onTrimsChange(trims.map((trim, i) => {
      if (i === trimIndex) {
        return {
          ...trim,
          specs: {
            ...trim.specs,
            [field]: field === "additionalFeatures" ? value.split(",") : value,
          }
        };
      }
      return trim;
    }));
  };

  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-medium mb-4">Комплектации</h3>
      <div className="space-y-4">
        {trims.map((trim, trimIndex) => (
          <div key={trimIndex} className="space-y-4 border p-4 rounded-lg">
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <Label>Название комплектации</Label>
                <Input
                  value={trim.name}
                  onChange={(e) => updateTrim(trimIndex, "name", e.target.value)}
                  placeholder="Например: Базовая"
                />
              </div>
              <div className="flex-1">
                <Label>Цена</Label>
                <Input
                  value={trim.price}
                  onChange={(e) => updateTrim(trimIndex, "price", e.target.value)}
                  placeholder="Например: 5 990 000 ₽"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-6"
                onClick={() => removeTrim(trimIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <SpecsSection
              specs={trim.specs}
              disabledSpecs={trimDisabledSpecs[trimIndex] || {}}
              onSpecChange={(field, value) => handleTrimSpecChange(trimIndex, field, value)}
              onSpecToggle={(field) => onTrimSpecToggle(trimIndex, field)}
              title="Характеристики комплектации"
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addTrim}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Добавить комплектацию
        </Button>
      </div>
    </div>
  );
};