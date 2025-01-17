import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImagesStepProps {
  onComplete: () => void;
  initialData: any;
}

export const ImagesStep = ({ onComplete, initialData }: ImagesStepProps) => {
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
      // Upload main image
      let mainImageUrl = null;
      if (mainImage) {
        mainImageUrl = await uploadImage(mainImage, 'car-images');
      }

      // Add car to database
      const { data: carData, error: carError } = await supabase
        .from("cars")
        .insert([
          {
            name: initialData.name,
            base_price: initialData.basePrice,
            image_url: mainImageUrl,
            specs: {
              power: initialData.power || undefined,
              acceleration: initialData.acceleration || undefined,
              range: initialData.range || undefined,
            },
          },
        ])
        .select()
        .single();

      if (carError) throw carError;

      // Upload color images and add colors
      const colorPromises = initialData.colors.map(async (color: any) => {
        const colorImage = colorImages[color.name];
        let imageUrl = null;
        if (colorImage) {
          imageUrl = await uploadImage(colorImage, 'car-color-images');
        }

        return supabase.from("car_colors").insert([{
          car_id: carData.id,
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
              car_id: carData.id,
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
              car_id: carData.id,
              name: interior.name,
            }))
          );
      }

      toast({
        title: "Успешно",
        description: "Автомобиль успешно добавлен",
      });

      onComplete();
    } catch (error) {
      console.error("Error adding car:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить автомобиль",
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
        {isLoading ? "Добавление..." : "Завершить"}
      </Button>
    </form>
  );
};