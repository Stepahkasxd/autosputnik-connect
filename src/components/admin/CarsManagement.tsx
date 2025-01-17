import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CarsManagement = () => {
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log("Adding new car:", { name, basePrice });
      
      const { data, error } = await supabase
        .from("cars")
        .insert([
          {
            name,
            base_price: basePrice,
            specs: {},
          },
        ])
        .select();

      if (error) throw error;

      console.log("Car added successfully:", data);
      
      toast({
        title: "Успешно",
        description: "Автомобиль успешно добавлен",
      });

      // Reset form
      setName("");
      setBasePrice("");
    } catch (error) {
      console.error("Error adding car:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить автомобиль",
        variant: "destructive",
      });
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="basePrice">Базовая цена</Label>
            <Input
              id="basePrice"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Добавить автомобиль</Button>
        </form>
      </div>
    </div>
  );
};