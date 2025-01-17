import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    <RadioGroup
      value={selectedTrim?.name}
      onValueChange={onTrimChange}
      className="space-y-2"
    >
      {trims.map((trim) => (
        <div
          key={trim.name}
          className={cn(
            "flex items-center justify-between p-4 rounded-lg transition-all",
            "border border-gray-800 hover:border-primary/50",
            selectedTrim?.name === trim.name && "border-primary bg-primary/10"
          )}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value={trim.name} id={trim.name} />
            <Label htmlFor={trim.name} className="font-medium cursor-pointer">
              {trim.name}
            </Label>
          </div>
          <span className="font-semibold">{trim.price}</span>
        </div>
      ))}
    </RadioGroup>
  );
};