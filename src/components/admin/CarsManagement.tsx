import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CarsManagement = () => {
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Starting car addition process...");
      
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      let imageUrl = null;

      // Upload image if selected
      if (image) {
        console.log("Uploading image...");
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('car-images')
          .upload(fileName, image);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('car-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
        console.log("Image uploaded successfully:", imageUrl);
      }

      // Add car to database
      console.log("Adding car to database:", { name, basePrice, imageUrl });
      const { error: insertError } = await supabase
        .from("cars")
        .insert([
          {
            name,
            base_price: basePrice,
            image_url: imageUrl,
            specs: {},
          },
        ]);

      if (insertError) throw insertError;

      console.log("Car added successfully");
      
      toast({
        title: "Успешно",
        description: "Автомобиль успешно добавлен",
      });

      // Reset form
      setName("");
      setBasePrice("");
      setImage(null);
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Управление автомобилями</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="name">Название модели</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Например: Zeekr 001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="basePrice">Базовая цена</Label>
            <Input
              id="basePrice"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
              placeholder="Например: от 5 990 000 ₽"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Изображение автомобиля</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Добавление..." : "Добавить автомобиль"}
          </Button>
        </form>
      </div>
    </div>
  );
};