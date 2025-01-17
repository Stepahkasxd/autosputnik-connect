import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Trim {
  name: string;
  price: string;
}

interface TrimSelectorProps {
  trims: Trim[];
  selectedTrim?: Trim;
  onTrimChange: (trimName: string) => void;
}

export const TrimSelector = ({ trims, selectedTrim, onTrimChange }: TrimSelectorProps) => {
  return (
    <Card className="p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Комплектации</h3>
      </div>
      <RadioGroup
        value={selectedTrim?.name}
        onValueChange={onTrimChange}
        className="space-y-4"
      >
        {trims.map((trim) => (
          <div
            key={trim.name}
            className={cn(
              "p-4 rounded-lg border transition-all duration-300",
              selectedTrim?.name === trim.name
                ? "border-primary bg-primary/5 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={trim.name} id={trim.name} />
                <Label htmlFor={trim.name} className="font-medium">{trim.name}</Label>
              </div>
              <span className="font-semibold text-primary">{trim.price}</span>
            </div>
          </div>
        ))}
      </RadioGroup>
    </Card>
  );
};