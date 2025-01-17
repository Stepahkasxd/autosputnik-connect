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

const sanitizeFileName = (fileName: string): string => {
  // Заменяем пробелы и специальные символы на безопасные
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-');
};

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
      console.log("Starting car save process...");
      let carId;
      if (selectedCar) {
        console.log("Updating existing car:", selectedCar.id);
        const { error: updateError } = await supabase
          .from("cars")
          .update({
            name,
            base_price: basePrice,
            specs: specsAsJson,
          })
          .eq("id", selectedCar.id);

        if (updateError) {
          console.error("Error updating car:", updateError);
          throw updateError;
        }
        carId = selectedCar.id;
      } else {
        console.log("Creating new car with name:", name);
        const { data: carData, error: insertError } = await supabase
          .from("cars")
          .insert([{
            name,
            base_price: basePrice,
            specs: specsAsJson,
          }])
          .select()
          .single();

        if (insertError) {
          console.error("Error inserting car:", insertError);
          throw insertError;
        }
        carId = carData?.id;
        console.log("New car created with ID:", carId);
      }

      if (carId) {
        if (selectedCar) {
          console.log("Deleting existing colors for car:", carId);
          await supabase
            .from("car_colors")
            .delete()
            .eq("car_id", carId);
        }
        
        const validColors = colors.filter(c => c.name && c.code);
        console.log("Processing colors:", validColors.length);
        for (const color of validColors) {
          let imageUrl = color.imageUrl;
          
          if (color.imageFile) {
            const sanitizedFileName = sanitizeFileName(`${carId}-${color.name}-${Date.now()}`);
            console.log("Uploading color image:", sanitizedFileName);
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("car-color-images")
              .upload(sanitizedFileName, color.imageFile);

            if (uploadError) {
              console.error("Error uploading color image:", uploadError);
              continue;
            }

            const { data: { publicUrl } } = supabase.storage
              .from("car-color-images")
              .getPublicUrl(sanitizedFileName);

            imageUrl = publicUrl;
            console.log("Color image uploaded, public URL:", imageUrl);
          }

          const { error: colorError } = await supabase
            .from("car_colors")
            .insert({
              car_id: carId,
              name: color.name,
              code: color.code,
              image_url: imageUrl,
            });

          if (colorError) {
            console.error("Error inserting color:", colorError);
          }
        }

        if (selectedCar) {
          console.log("Deleting existing trims for car:", carId);
          await supabase
            .from("car_trims")
            .delete()
            .eq("car_id", carId);
        }

        const validTrims = trims.filter(t => t.name && t.price);
        console.log("Processing trims:", validTrims.length);
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

          const { error: trimsError } = await supabase
            .from("car_trims")
            .insert(trimsToInsert);

          if (trimsError) {
            console.error("Error inserting trims:", trimsError);
          }
        }
      }

      const imageFile = formData.get("image") as File;
      if (imageFile && imageFile.size > 0) {
        const sanitizedFileName = sanitizeFileName(`${Date.now()}-${imageFile.name}`);
        console.log("Uploading main car image:", sanitizedFileName);
        const { error: mainImageError } = await supabase.storage
          .from("car-images")
          .upload(sanitizedFileName, imageFile);

        if (mainImageError) {
          console.error("Error uploading main image:", mainImageError);
        }
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