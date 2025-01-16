import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CarSpecs } from "@/data/cars";
import { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

interface CarFormProps {
  selectedCar?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CarForm = ({ selectedCar, onSuccess, onCancel }: CarFormProps) => {
  const { toast } = useToast();
  const [specs, setSpecs] = useState<CarSpecs>(
    selectedCar?.specs || {
      acceleration: "",
      power: "",
      drive: "",
      range: "",
      batteryCapacity: "",
      dimensions: "",
      wheelbase: "",
      additionalFeatures: [],
    }
  );

  const handleSpecChange = (field: keyof CarSpecs, value: string) => {
    setSpecs((prev) => ({
      ...prev,
      [field]: field === "additionalFeatures" ? value.split(",") : value,
    }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get("name")?.toString() || "";
    const basePrice = formData.get("price")?.toString() || "";
    
    const specsAsJson: Json = {
      acceleration: specs.acceleration,
      power: specs.power,
      drive: specs.drive,
      range: specs.range,
      batteryCapacity: specs.batteryCapacity,
      dimensions: specs.dimensions,
      wheelbase: specs.wheelbase,
      additionalFeatures: specs.additionalFeatures,
    };

    const carData = {
      name,
      base_price: basePrice,
      specs: specsAsJson,
    };

    try {
      if (selectedCar) {
        await supabase
          .from("cars")
          .update(carData)
          .eq("id", selectedCar.id);
      } else {
        await supabase.from("cars").insert([carData]);
      }

      const imageFile = formData.get("image") as File;
      if (imageFile && imageFile.size > 0) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        await supabase.storage
          .from("car-images")
          .upload(fileName, imageFile);
      }

      toast({
        title: selectedCar ? "Автомобиль обновлен" : "Автомобиль добавлен",
        description: "Изменения успешно сохранены",
      });
      onSuccess();
    } catch (error) {
      console.error("Error saving car:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      });
    }
  };

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
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название модели</Label>
          <Input 
            id="name" 
            name="name"
            defaultValue={selectedCar?.name} 
            required 
            placeholder="Например: Zeekr 001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Базовая цена</Label>
          <Input 
            id="price" 
            name="price"
            defaultValue={selectedCar?.base_price} 
            required 
            placeholder="Например: от 5 990 000 ₽"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Фотография автомобиля</Label>
        <Input 
          id="image" 
          name="image"
          type="file" 
          accept="image/*" 
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Характеристики автомобиля</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specFields.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                value={specs[key as keyof CarSpecs] as string}
                onChange={(e) => handleSpecChange(key as keyof CarSpecs, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
        
        <div className="space-y-2 mt-4">
          <Label htmlFor="additionalFeatures">
            Дополнительные характеристики
            <span className="text-sm text-gray-500 block">
              Введите характеристики через запятую
            </span>
          </Label>
          <Input
            id="additionalFeatures"
            value={specs.additionalFeatures?.join(", ") || ""}
            onChange={(e) => handleSpecChange("additionalFeatures", e.target.value)}
            placeholder='Например: 21" Air Vortex диски, Панорамная крыша'
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit">Сохранить</Button>
      </div>
    </form>
  );
};