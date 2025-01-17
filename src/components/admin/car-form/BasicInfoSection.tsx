import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormData {
  name: string;
  basePrice: string;
  specs: any;
  colors: any[];
  trims: any[];
}

interface BasicInfoSectionProps {
  selectedCar?: any;
  defaultValues?: FormData | null;
}

export const BasicInfoSection = ({ selectedCar, defaultValues }: BasicInfoSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Название модели</Label>
        <Input 
          id="name" 
          name="name"
          defaultValue={selectedCar?.name || defaultValues?.name} 
          required 
          placeholder="Например: Zeekr 001"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Базовая цена</Label>
        <Input 
          id="price" 
          name="price"
          defaultValue={selectedCar?.base_price || defaultValues?.basePrice} 
          required 
          placeholder="Например: от 5 990 000 ₽"
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="image">Фотография автомобиля</Label>
        <Input 
          id="image" 
          name="image"
          type="file" 
          accept="image/*" 
        />
      </div>
    </div>
  );
};