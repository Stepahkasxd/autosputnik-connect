import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cars } from "@/data/cars";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CarSpecs } from "@/data/cars";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export const CarManagement = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [specs, setSpecs] = useState<CarSpecs>({
    acceleration: "",
    power: "",
    drive: "",
    range: "",
    batteryCapacity: "",
    dimensions: "",
    wheelbase: "",
    additionalFeatures: [],
  });

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
    
    // Convert CarSpecs to Json type
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
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving car:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("cars").delete().eq("id", id);
      toast({
        title: "Автомобиль удален",
        description: "Автомобиль был успешно удален из каталога",
      });
    } catch (error) {
      console.error("Error deleting car:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить автомобиль",
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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Управление автомобилями</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedCar(null);
              setSpecs({
                acceleration: "",
                power: "",
                drive: "",
                range: "",
                batteryCapacity: "",
                dimensions: "",
                wheelbase: "",
                additionalFeatures: [],
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить автомобиль
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedCar ? "Редактировать автомобиль" : "Добавить автомобиль"}
              </DialogTitle>
            </DialogHeader>
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
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">Сохранить</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Модель</TableHead>
            <TableHead>Базовая цена</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car.id}>
              <TableCell>{car.name}</TableCell>
              <TableCell>{car.basePrice}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedCar(car);
                      setSpecs(car.specs);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(car.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CarManagement;