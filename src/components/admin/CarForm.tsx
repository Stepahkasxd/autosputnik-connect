import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CarSpecs } from "@/data/cars";
import { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { BasicInfoSection } from "./car-form/BasicInfoSection";
import { ColorsSection } from "./car-form/ColorsSection";
import { SpecsSection } from "./car-form/SpecsSection";
import { TrimsSection } from "./car-form/TrimsSection";

interface CarFormProps {
  selectedCar?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ColorInput {
  name: string;
  code: string;
  imageFile?: File;
  imageUrl?: string;
}

interface TrimInput {
  name: string;
  price: string;
  specs: CarSpecs;
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
  const [trimDisabledSpecs, setTrimDisabledSpecs] = useState<Record<string, Record<string, boolean>>>({});
  const [colors, setColors] = useState<ColorInput[]>([{ name: "", code: "" }]);
  const [trims, setTrims] = useState<TrimInput[]>([
    { 
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
    }
  ]);

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

  const handleTrimSpecToggle = (trimIndex: number, field: string) => {
    setTrimDisabledSpecs(prev => ({
      ...prev,
      [trimIndex]: {
        ...(prev[trimIndex] || {}),
        [field]: !(prev[trimIndex]?.[field] || false)
      }
    }));

    if (!trimDisabledSpecs[trimIndex]?.[field]) {
      setTrims(prev => prev.map((trim, i) => {
        if (i === trimIndex) {
          return {
            ...trim,
            specs: {
              ...trim.specs,
              [field]: "Не используется"
            }
          };
        }
        return trim;
      }));
    } else {
      setTrims(prev => prev.map((trim, i) => {
        if (i === trimIndex) {
          return {
            ...trim,
            specs: {
              ...trim.specs,
              [field]: ""
            }
          };
        }
        return trim;
      }));
    }
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

      if (carId) {
        if (selectedCar) {
          await supabase
            .from("car_colors")
            .delete()
            .eq("car_id", carId);
        }
        
        const validColors = colors.filter(c => c.name && c.code);
        for (const color of validColors) {
          let imageUrl = color.imageUrl;
          
          if (color.imageFile) {
            const fileName = `${carId}-${color.name}-${Date.now()}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("car-color-images")
              .upload(fileName, color.imageFile);

            if (uploadError) {
              console.error("Error uploading color image:", uploadError);
              continue;
            }

            const { data: { publicUrl } } = supabase.storage
              .from("car-color-images")
              .getPublicUrl(fileName);

            imageUrl = publicUrl;
          }

          await supabase
            .from("car_colors")
            .insert({
              car_id: carId,
              name: color.name,
              code: color.code,
              image_url: imageUrl,
            });
        }

        if (selectedCar) {
          await supabase
            .from("car_trims")
            .delete()
            .eq("car_id", carId);
        }

        const validTrims = trims.filter(t => t.name && t.price);
        if (validTrims.length > 0) {
          const trimsToInsert = validTrims.map(trim => ({
            car_id: carId,
            name: trim.name,
            price: trim.price,
            specs: {
              acceleration: trim.specs.acceleration,
              power: trim.specs.power,
              drive: trim.specs.drive,
              range: trim.specs.range,
              batteryCapacity: trim.specs.batteryCapacity,
              dimensions: trim.specs.dimensions,
              wheelbase: trim.specs.wheelbase,
              additionalFeatures: trim.specs.additionalFeatures,
            } as Json,
          }));

          await supabase
            .from("car_trims")
            .insert(trimsToInsert);
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

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <BasicInfoSection selectedCar={selectedCar} />
      
      <ColorsSection 
        colors={colors}
        onColorsChange={setColors}
      />

      <TrimsSection
        trims={trims}
        trimDisabledSpecs={trimDisabledSpecs}
        onTrimsChange={setTrims}
        onTrimSpecToggle={handleTrimSpecToggle}
      />

      <div className="border-t pt-4">
        <SpecsSection
          specs={specs}
          disabledSpecs={disabledSpecs}
          onSpecChange={handleSpecChange}
          onSpecToggle={handleSpecToggle}
        />
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