import { Card } from "@/components/ui/card";
import { CheckCircle2, Sparkles } from "lucide-react";
import { CarSpecs as CarSpecsType } from "@/data/cars";

interface CarSpecsProps {
  specs: CarSpecsType;
}

export const CarSpecsDisplay = ({ specs }: CarSpecsProps) => {
  const hasSpecs = (specs: CarSpecsType): boolean => {
    if (!specs) return false;
    return Object.values(specs).some(value => value !== undefined && value !== null);
  };

  if (!hasSpecs(specs)) return null;

  return (
    <Card className="p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Базовые характеристики</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(specs).map(([key, value]) => (
          value && (
            <div key={key} className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{key}</p>
                <p className="font-semibold">{value}</p>
              </div>
            </div>
          )
        ))}
      </div>
    </Card>
  );
};