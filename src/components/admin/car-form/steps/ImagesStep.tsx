import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImagesStepProps {
  onComplete: () => void;
  initialData: any;
  isEditing?: boolean;
}

export const ImagesStep = ({ onComplete, initialData, isEditing = false }: ImagesStepProps) => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [colorImages, setColorImages] = useState<{ [key: string]: File | null }>(
    initialData.colors.reduce((acc: any, color: any) => {
      acc[color.name] = null;
      return acc;
    }, {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  const handleColorImageChange = (colorName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setColorImages({ ...colorImages, [colorName]: e.target.files[0] });
    }
  };

  const uploadImage = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload main image if changed
      let mainImageUrl = initialData.image_url;
      if (mainImage) {
        mainImageUrl = await uploadImage(mainImage, 'car-images');
      }

      let carId = initialData.id;

      if (isEditing) {
        // Update existing car
        const { error: carError } = await supabase
          .from("cars")
          .update({
            name: initialData.name,
            base_price: initialData.basePrice,
            image_url: mainImageUrl,
            specs: initialData.specs || {},
          })
          .eq('id', carId);

        if (carError) throw carError;

        // Delete existing colors, trims, and interiors
        await Promise.all([
          supabase.from("car_colors").delete().eq("car_id", carId),
          supabase.from("car_trims").delete().eq("car_id", carId),
          supabase.from("car_interiors").delete().eq("car_id", carId),
        ]);
      } else {
        // Add new car
        const { data: carData, error: carError } = await supabase
          .from("cars")
          .insert([
            {
              name: initialData.name,
              base_price: initialData.basePrice,
              image_url: mainImageUrl,
              specs: initialData.specs || {},
            },
          ])
          .select()
          .single();

        if (carError) throw carError;
        carId = carData.id;
      }

      // Upload color images and add colors
      const colorPromises = initialData.colors.map(async (color: any) => {
        const colorImage = colorImages[color.name];
        let imageUrl = color.image_url;
        if (colorImage) {
          imageUrl = await uploadImage(colorImage, 'car-color-images');
        }

        return supabase.from("car_colors").insert([{
          car_id: carId,
          name: color.name,
          code: color.code,
          image_url: imageUrl,
        }]);
      });

      await Promise.all(colorPromises);

      // Add trims
      if (initialData.trims.length > 0) {
        await supabase
          .from("car_trims")
          .insert(
            initialData.trims.map((trim: any) => ({
              car_id: carId,
              name: trim.name,
              price: trim.price,
              specs: trim.specs || {},
            }))
          );
      }

      // Add interiors
      if (initialData.interiors.length > 0) {
        await supabase
          .from("car_interiors")
          .insert(
            initialData.interiors.map((interior: any) => ({
              car_id: carId,
              name: interior.name,
            }))
          );
      }

      toast({
        title: "Успешно",
        description: isEditing ? "Автомобиль успешно обновлен" : "Автомобиль успешно добавлен",
      });

      onComplete();
    } catch (error) {
      console.error("Error saving car:", error);
      toast({
        title: "Ошибка",
        description: isEditing ? "Не удалось обновить автомобиль" : "Не удалось добавить автомобиль",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="mainImage">Основное изображение автомобиля</Label>
          {initialData.image_url && (
            <img
              src={initialData.image_url}
              alt="Current main image"
              className="w-32 h-32 object-cover rounded-lg mb-2"
            />
          )}
          <Input
            id="mainImage"
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-4">
          <Label>Изображения для цветов</Label>
          {initialData.colors.map((color: any) => (
            <div key={color.name} className="flex items-center gap-4">
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: color.code }}
              />
              <span className="min-w-[120px]">{color.name}</span>
              {color.image_url && (
                <img
                  src={color.image_url}
                  alt={`Current ${color.name} image`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleColorImageChange(color.name, e)}
                className="cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (isEditing ? "Обновление..." : "Добавление...") : (isEditing ? "Обновить" : "Завершить")}
      </Button>
    </form>
  );
};