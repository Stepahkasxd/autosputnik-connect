import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, X } from "lucide-react";

export const CarsManagement = () => {
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [power, setPower] = useState("");
  const [acceleration, setAcceleration] = useState("");
  const [range, setRange] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Colors state
  const [colors, setColors] = useState<{ name: string; code: string }[]>([
    { name: "", code: "#000000" },
  ]);

  // Trims state
  const [trims, setTrims] = useState<{ name: string; price: string }[]>([
    { name: "", price: "" },
  ]);

  // Interiors state
  const [interiors, setInteriors] = useState<{ name: string }[]>([
    { name: "" },
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const addColor = () => {
    setColors([...colors, { name: "", code: "#000000" }]);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, field: "name" | "code", value: string) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  const addTrim = () => {
    setTrims([...trims, { name: "", price: "" }]);
  };

  const removeTrim = (index: number) => {
    setTrims(trims.filter((_, i) => i !== index));
  };

  const updateTrim = (index: number, field: "name" | "price", value: string) => {
    const newTrims = [...trims];
    newTrims[index][field] = value;
    setTrims(newTrims);
  };

  const addInterior = () => {
    setInteriors([...interiors, { name: "" }]);
  };

  const removeInterior = (index: number) => {
    setInteriors(interiors.filter((_, i) => i !== index));
  };

  const updateInterior = (index: number, value: string) => {
    const newInteriors = [...interiors];
    newInteriors[index].name = value;
    setInteriors(newInteriors);
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

      // Prepare specifications object
      const specs = {
        power: power || undefined,
        acceleration: acceleration || undefined,
        range: range || undefined,
      };

      // Add car to database
      console.log("Adding car to database:", { name, basePrice, imageUrl, specs });
      const { data: carData, error: carError } = await supabase
        .from("cars")
        .insert([
          {
            name,
            base_price: basePrice,
            image_url: imageUrl,
            specs,
          },
        ])
        .select()
        .single();

      if (carError) throw carError;

      // Add colors
      if (colors.length > 0) {
        const { error: colorsError } = await supabase
          .from("car_colors")
          .insert(
            colors.map((color) => ({
              car_id: carData.id,
              name: color.name,
              code: color.code,
            }))
          );

        if (colorsError) throw colorsError;
      }

      // Add trims
      if (trims.length > 0) {
        const { error: trimsError } = await supabase
          .from("car_trims")
          .insert(
            trims.map((trim) => ({
              car_id: carData.id,
              name: trim.name,
              price: trim.price,
            }))
          );

        if (trimsError) throw trimsError;
      }

      // Add interiors
      if (interiors.length > 0) {
        const { error: interiorsError } = await supabase
          .from("car_interiors")
          .insert(
            interiors.map((interior) => ({
              car_id: carData.id,
              name: interior.name,
            }))
          );

        if (interiorsError) throw interiorsError;
      }

      console.log("Car added successfully");
      
      toast({
        title: "Успешно",
        description: "Автомобиль успешно добавлен",
      });

      // Reset form
      setName("");
      setBasePrice("");
      setImage(null);
      setPower("");
      setAcceleration("");
      setRange("");
      setColors([{ name: "", code: "#000000" }]);
      setTrims([{ name: "", price: "" }]);
      setInteriors([{ name: "" }]);
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

          {/* Colors Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Цвета</Label>
              <Button type="button" variant="outline" size="sm" onClick={addColor}>
                <Plus className="w-4 h-4 mr-1" /> Добавить цвет
              </Button>
            </div>
            {colors.map((color, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <Input
                    value={color.name}
                    onChange={(e) => updateColor(index, "name", e.target.value)}
                    placeholder="Название цвета"
                    required
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="color"
                    value={color.code}
                    onChange={(e) => updateColor(index, "code", e.target.value)}
                    required
                  />
                </div>
                {colors.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColor(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Trims Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Комплектации</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTrim}>
                <Plus className="w-4 h-4 mr-1" /> Добавить комплектацию
              </Button>
            </div>
            {trims.map((trim, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <Input
                    value={trim.name}
                    onChange={(e) => updateTrim(index, "name", e.target.value)}
                    placeholder="Название комплектации"
                    required
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={trim.price}
                    onChange={(e) => updateTrim(index, "price", e.target.value)}
                    placeholder="Цена"
                    required
                  />
                </div>
                {trims.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTrim(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Interiors Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Варианты салона</Label>
              <Button type="button" variant="outline" size="sm" onClick={addInterior}>
                <Plus className="w-4 h-4 mr-1" /> Добавить вариант салона
              </Button>
            </div>
            {interiors.map((interior, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <Input
                    value={interior.name}
                    onChange={(e) => updateInterior(index, e.target.value)}
                    placeholder="Название варианта салона"
                    required
                  />
                </div>
                {interiors.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInterior(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="power">Мощность</Label>
            <Input
              id="power"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              placeholder="Например: 400 кВт"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acceleration">Разгон до 100 км/ч</Label>
            <Input
              id="acceleration"
              value={acceleration}
              onChange={(e) => setAcceleration(e.target.value)}
              placeholder="Например: 3,8 с"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="range">Запас хода</Label>
            <Input
              id="range"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder="Например: 656 км"
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