import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CarForm } from "./CarForm";
import { CarsTable } from "./CarsTable";
import { Car, CarSpecs } from "@/data/cars";
import { Json } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CarManagement = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [consoleErrors, setConsoleErrors] = useState<string[]>([]);

  // Перехватываем ошибки консоли
  useEffect(() => {
    const originalConsoleError = console.error;
    const errors: string[] = [];

    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      const errorMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      errors.push(`${new Date().toLocaleString()}: ${errorMessage}`);
      setConsoleErrors(prev => [...prev, `${new Date().toLocaleString()}: ${errorMessage}`]);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const convertJsonToCarSpecs = (specs: Json): CarSpecs => {
    if (typeof specs !== 'object' || !specs) {
      console.error('Invalid specs format:', specs);
      return {
        acceleration: "",
        power: "",
        drive: "",
        range: "",
        batteryCapacity: "",
        dimensions: "",
        wheelbase: "",
        additionalFeatures: [],
      };
    }

    return {
      acceleration: (specs as any).acceleration || "",
      power: (specs as any).power || "",
      drive: (specs as any).drive || "",
      range: (specs as any).range || "",
      batteryCapacity: (specs as any).batteryCapacity || "",
      dimensions: (specs as any).dimensions || "",
      wheelbase: (specs as any).wheelbase || "",
      additionalFeatures: Array.isArray((specs as any).additionalFeatures) 
        ? (specs as any).additionalFeatures 
        : [],
    };
  };

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*");
      
      if (error) throw error;
      
      if (data) {
        const convertedCars: Car[] = data.map(car => ({
          id: car.id,
          name: car.name,
          basePrice: car.base_price,
          image: car.image_url || "/placeholder.svg",
          specs: convertJsonToCarSpecs(car.specs),
          colors: [],
          interiors: [],
          trims: []
        }));
        
        setCars(convertedCars);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список автомобилей",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("cars")
        .delete()
        .eq("id", id);
      
      if (error) throw error;

      toast({
        title: "Автомобиль удален",
        description: "Автомобиль был успешно удален из каталога",
      });
      
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить автомобиль",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Управление автомобилями</h2>
        <div className="flex gap-4">
          <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <AlertCircle className="h-4 w-4 mr-2" />
                Журнал ошибок
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Журнал ошибок консоли</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                {consoleErrors.length > 0 ? (
                  consoleErrors.map((error, index) => (
                    <div key={index} className="mb-4 p-2 bg-red-50 rounded">
                      <pre className="whitespace-pre-wrap text-sm text-red-600">{error}</pre>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Ошибок пока нет</p>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setSelectedCar(null);
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
              <CarForm
                selectedCar={selectedCar}
                onSuccess={() => {
                  setIsDialogOpen(false);
                  fetchCars();
                }}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CarsTable
        cars={cars}
        onEdit={(car) => {
          setSelectedCar(car);
          setIsDialogOpen(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CarManagement;