import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { Car } from "@/data/cars";

export const CarManagement = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [cars, setCars] = useState<Car[]>([]);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*");
      
      if (error) throw error;
      
      if (data) {
        setCars(data.map(car => ({
          id: car.id,
          name: car.name,
          basePrice: car.base_price,
          image: car.image_url || "/placeholder.svg",
          specs: car.specs,
          colors: [],
          interiors: [],
          trims: []
        })));
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
      
      fetchCars(); // Обновляем список после удаления
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
                fetchCars(); // Обновляем список после сохранения
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
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