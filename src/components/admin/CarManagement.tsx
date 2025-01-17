import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CarForm } from "./CarForm";
import { CarsTable } from "./CarsTable";
import { Database } from "@/integrations/supabase/types";

type Car = Database["public"]["Tables"]["cars"]["Row"] & {
  car_colors: Database["public"]["Tables"]["car_colors"]["Row"][];
  car_trims: Database["public"]["Tables"]["car_trims"]["Row"][];
};

export const CarManagement = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAuth = () => {
    const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
    return isAuthenticated;
  };

  const fetchCars = async () => {
    if (!checkAuth()) return;

    try {
      const { data, error } = await supabase
        .from("cars")
        .select(`
          *,
          car_colors (*),
          car_trims (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const carsWithParsedSpecs = data.map(car => ({
        ...car,
        specs: convertJsonToCarSpecs(car.specs)
      }));

      setCars(carsWithParsedSpecs);
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список автомобилей",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const convertJsonToCarSpecs = (specs: any) => {
    if (!specs || Array.isArray(specs)) return {};
    
    const specsObj = specs as Record<string, any>;
    return {
      acceleration: specsObj.acceleration || "",
      power: specsObj.power || "",
      maxSpeed: specsObj.maxSpeed || "",
      dimensions: specsObj.dimensions || "",
      clearance: specsObj.clearance || "",
      consumption: specsObj.consumption || "",
      trunk: specsObj.trunk || "",
      drive: specsObj.drive || "",
      range: specsObj.range || "",
      batteryCapacity: specsObj.batteryCapacity || "",
      wheelbase: specsObj.wheelbase || "",
      additionalFeatures: Array.isArray(specsObj.additionalFeatures) 
        ? specsObj.additionalFeatures 
        : []
    };
  };

  const handleDeleteCar = async (carId: string) => {
    if (!checkAuth()) return;

    try {
      const { error } = await supabase
        .from("cars")
        .delete()
        .eq("id", carId);

      if (error) throw error;

      setCars(cars.filter(car => car.id !== carId));
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

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление автомобилями</h2>
        <Button onClick={() => setIsAddingCar(true)}>
          Добавить автомобиль
        </Button>
      </div>

      {isAddingCar || editingCar ? (
        <CarForm
          car={editingCar}
          onSuccess={() => {
            setIsAddingCar(false);
            setEditingCar(null);
            fetchCars();
          }}
          onCancel={() => {
            setIsAddingCar(false);
            setEditingCar(null);
          }}
        />
      ) : (
        <CarsTable 
          cars={cars} 
          onDelete={handleDeleteCar}
          onEdit={handleEditCar}
        />
      )}
    </div>
  );
};

export default CarManagement;