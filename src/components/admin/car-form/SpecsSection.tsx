import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CarSpecs } from "@/data/cars";

interface SpecsSectionProps {
  specs: CarSpecs;
  disabledSpecs: Record<string, boolean>;
  onSpecChange: (field: keyof CarSpecs, value: string) => void;
  onSpecToggle: (field: string) => void;
  title?: string;
}

export const SpecsSection = ({ 
  specs, 
  disabledSpecs, 
  onSpecChange, 
  onSpecToggle,
  title = "Базовые характеристики автомобиля"
}: SpecsSectionProps) => {
  const specFields = [
    { key: "acceleration", label: "Разгон до 100 км/ч", placeholder: "Например: 3.8 с" },
    { key: "power", label: "Мощность", placeholder: "Например: 400 кВт или 517 л.с." },
    { key: "drive", label: "Привод", placeholder: "Например: Полный привод 4WD" },
    { key: "range", label: "Запас хода", placeholder: "Например: 656 км" },
    { key: "batteryCapacity", label: "Емкость батареи", placeholder: "Например: 52.3 кВт⋅ч" },
    { key: "dimensions", label: "Габариты", placeholder: "Например: 5050 мм" },
    { key: "wheelbase", label: "Колесная база", placeholder: "Например: 3100 мм" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specFields.map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor={key}>{label}</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`toggle-${key}`} className="text-sm text-gray-500">
                  Не используется
                </Label>
                <Switch
                  id={`toggle-${key}`}
                  checked={disabledSpecs[key]}
                  onCheckedChange={() => onSpecToggle(key)}
                />
              </div>
            </div>
            <Input
              id={key}
              value={specs[key as keyof CarSpecs] as string}
              onChange={(e) => onSpecChange(key as keyof CarSpecs, e.target.value)}
              placeholder={placeholder}
              disabled={disabledSpecs[key]}
            />
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="additionalFeatures">
          Дополнительные характеристики
          <span className="text-sm text-gray-500 block">
            Введите характеристики через запятую
          </span>
        </Label>
        <Input
          id="additionalFeatures"
          value={specs.additionalFeatures?.join(", ") || ""}
          onChange={(e) => onSpecChange("additionalFeatures", e.target.value)}
          placeholder='Например: 21" Air Vortex диски, Панорамная крыша'
        />
      </div>
    </div>
  );
};