import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { CarSpecs } from "@/data/cars";
import { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Trash2 } from "lucide-react";

interface CarFormProps {
  selectedCar?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ColorInput {
  name: string;
  code: string;
}

interface TrimInput {
  name: string;
  price: string;
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

  const [disabledSpecs, setDisabledSpecs] = useState<Record<string, boolean>>({});
  const [colors, setColors] = useState<ColorInput[]>([{ name: "", code: "" }]);
  const [trims, setTrims] = useState<TrimInput[]>([{ name: "", price: "" }]);

  const handleSpecChange = (field: keyof CarSpecs, value: string) => {
    setSpecs((prev) => ({
      ...prev,
      [field]: field === "additionalFeatures" ? value.split(",") : value,
    }));
  };

  const handleSpecToggle = (field: string) => {
    setDisabledSpecs(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    if (!disabledSpecs[field]) {
      setSpecs(prev => ({
        ...prev,
        [field]: "Не используется"
      }));
    } else {
      setSpecs(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const addColor = () => {
    setColors(prev => [...prev, { name: "", code: "" }]);
  };

  const removeColor = (index: number) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, field: keyof ColorInput, value: string) => {
    setColors(prev => prev.map((color, i) => 
      i === index ? { ...color, [field]: value } : color
    ));
  };

  const addTrim = () => {
    setTrims(prev => [...prev, { name: "", price: "" }]);
  };

  const removeTrim = (index: number) => {
    setTrims(prev => prev.filter((_, i) => i !== index));
  };

  const updateTrim = (index: number, field: keyof TrimInput, value: string) => {
    setTrims(prev => prev.map((trim, i) => 
      i === index ? { ...trim, [field]: value } : trim
    ));
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

    try {
      let carId;
      if (selectedCar) {
        await supabase
          .from("cars")
          .update({
            name,
            base_price: basePrice,
            specs: specsAsJson,
          })
          .eq("id", selectedCar.id);
        carId = selectedCar.id;
      } else {
        const { data: carData } = await supabase
          .from("cars")
          .insert([{
            name,
            base_price: basePrice,
            specs: specsAsJson,
          }])
          .select()
          .single();
        carId = carData?.id;
      }

      // Сохраняем цвета
      if (carId) {
        // Удаляем старые цвета если редактируем
        if (selectedCar) {
          await supabase
            .from("car_colors")
            .delete()
            .eq("car_id", carId);
        }
        
        // Добавляем новые цвета
        const validColors = colors.filter(c => c.name && c.code);
        if (validColors.length > 0) {
          await supabase
            .from("car_colors")
            .insert(validColors.map(color => ({
              car_id: carId,
              name: color.name,
              code: color.code,
            })));
        }

        // Удаляем старые комплектации если редактируем
        if (selectedCar) {
          await supabase
            .from("car_trims")
            .delete()
            .eq("car_id", carId);
        }

        // Добавляем новые комплектации
        const validTrims = trims.filter(t => t.name && t.price);
        if (validTrims.length > 0) {
          await supabase
            .from("car_trims")
            .insert(validTrims.map(trim => ({
              car_id: carId,
              name: trim.name,
              price: trim.price,
            })));
        }
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
    <form onSubmit={handleSave} className="space-y-6">
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

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Комплектации</h3>
        <div className="space-y-4">
          {trims.map((trim, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <Label>Название комплектации</Label>
                <Input
                  value={trim.name}
                  onChange={(e) => updateTrim(index, "name", e.target.value)}
                  placeholder="Например: Базовая"
                />
              </div>
              <div className="flex-1">
                <Label>Цена</Label>
                <Input
                  value={trim.price}
                  onChange={(e) => updateTrim(index, "price", e.target.value)}
                  placeholder="Например: 5 990 000 ₽"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-6"
                onClick={() => removeTrim(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Характеристики автомобиля</h3>
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
                    onCheckedChange={() => handleSpecToggle(key)}
                  />
                </div>
              </div>
              <Input
                id={key}
                value={specs[key as keyof CarSpecs] as string}
                onChange={(e) => handleSpecChange(key as keyof CarSpecs, e.target.value)}
                placeholder={placeholder}
                disabled={disabledSpecs[key]}
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