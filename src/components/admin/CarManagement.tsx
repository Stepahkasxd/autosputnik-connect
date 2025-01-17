import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CarForm } from "./CarForm";
import { CarsTable } from "./CarsTable";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Car, CarSpecs } from "@/data/cars";
import { Json } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

export const CarManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [consoleErrors, setConsoleErrors] = useState<string[]>([]);

  useEffect(() => {
    checkAuth();
    const originalConsoleError = console.error;
    const errors: string[] = [];

    console.error = (...args) => {
      const errorMessage = args.join(" ");
      errors.push(errorMessage);
      setConsoleErrors([...errors]);
      originalConsoleError.apply(console, args);
    };

    fetchCars();

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const checkAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      console.error("Authentication error:", error);
      toast({
        title: "Ошибка аутентификации",
        description: "Пожалуйста, войдите в систему",
        variant: "destructive",
      });
      navigate("/admin/login");
    }
  };

  const convertJsonToCarSpecs = (specs: Json): CarSpecs => {
    if (typeof specs !== 'object' || !specs || Array.isArray(specs)) {
      return {};
    }

    const specsObj = specs as Record<string, Json>;
    
    return {
      acceleration: specsObj.acceleration?.toString(),
      power: specsObj.power?.toString(),
      maxSpeed: specsObj.maxSpeed?.toString(),
      dimensions: specsObj.dimensions?.toString(),
      clearance: specsObj.clearance?.toString(),
      consumption: specsObj.consumption?.toString(),
      trunk: specsObj.trunk?.toString(),
      drive: specsObj.drive?.toString(),
      range: specsObj.range?.toString(),
      batteryCapacity: specsObj.batteryCapacity?.toString(),
      wheelbase: specsObj.wheelbase?.toString(),
      additionalFeatures: Array.isArray(specsObj.additionalFeatures) 
        ? specsObj.additionalFeatures.map(String)
        : undefined,
    };
  };

  const fetchCars = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("No active session");
        return;
      }

      const { data: carsData, error } = await supabase
        .from("cars")
        .select("*");

      if (error) {
        console.error("Error fetching cars:", error);
        throw error;
      }

      if (carsData) {
        const formattedCars = carsData.map(car => ({
          id: car.id,
          name: car.name,
          basePrice: car.base_price,
          image: car.image_url || '/placeholder.svg',
          colors: [], // These will be populated separately if needed
          interiors: [],
          trims: [],
          specs: convertJsonToCarSpecs(car.specs),
        }));
        setCars(formattedCars);
      }
    } catch (error) {
      console.error("Error in fetchCars:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список автомобилей",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("No active session");
        toast({
          title: "Ошибка аутентификации",
          description: "Пожалуйста, войдите в систему",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("cars")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setCars(cars.filter(car => car.id !== id));
      toast({
        title: "Успешно",
        description: "Автомобиль удален",
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление автомобилями</h2>
        <Button onClick={() => {
          setSelectedCar(null);
          setIsDialogOpen(true);
        }}>
          Добавить автомобиль
        </Button>
      </div>

      <CarsTable
        cars={cars}
        onEdit={(car) => {
          setSelectedCar(car);
          setIsDialogOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

      <AlertDialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Консоль ошибок</AlertDialogTitle>
            <AlertDialogDescription>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {consoleErrors.map((error, index) => (
                  <Alert key={index} variant="destructive" className="mb-2">
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                ))}
              </ScrollArea>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};