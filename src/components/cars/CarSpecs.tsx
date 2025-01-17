import { Card } from "@/components/ui/card";
import { CheckCircle2, Sparkles } from "lucide-react";
import { CarSpecs as CarSpecsType } from "@/data/cars";

interface CarSpecsProps {
  specs: CarSpecsType;
}

export const CarSpecs = ({ specs }: CarSpecsProps) => {
  const hasSpecs = (specs: CarSpecsType): boolean => {
    if (!specs) return false;
    return Object.values(specs).some(value => value !== undefined && value !== null);
  };

  if (!hasSpecs(specs)) return null;

  // Словарь для перевода ключей характеристик
  const specTranslations: Record<string, string> = {
    power: "Мощность",
    acceleration: "Разгон до 100 км/ч",
    range: "Запас хода",
    maxSpeed: "Максимальная скорость",
    drive: "Тип привода",
    batteryCapacity: "Емкость батареи",
    dimensions: "Габариты",
    clearance: "Клиренс",
    wheelbase: "Колесная база",
    consumption: "Расход энергии",
    trunk: "Объем багажника",
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        Характеристики
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(specs).map(([key, value]) => {
          // Пропускаем additionalFeatures, так как это массив
          if (key === 'additionalFeatures' || !value) return null;
          
          return (
            <div 
              key={key} 
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-800 hover:border-primary/50 transition-all"
            >
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-gray-400">{specTranslations[key] || key}</p>
                <p className="font-semibold">{value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Дополнительные характеристики, если есть */}
      {specs.additionalFeatures && specs.additionalFeatures.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Дополнительные характеристики</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specs.additionalFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-800"
              >
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};