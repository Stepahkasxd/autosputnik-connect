import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Car, Trash2, Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AddCarSteps } from "./car-form/AddCarSteps";

export const CarsManagement = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      console.log("Fetching cars...");
      const { data: carsData, error: carsError } = await supabase
        .from("cars")
        .select("*, car_colors(*), car_interiors(*), car_trims(*)");

      if (carsError) throw carsError;
      console.log("Fetched cars:", carsData);
      setCars(carsData);
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список автомобилей",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (carId: string) => {
    try {
      setIsLoading(true);
      
      // Delete related records first
      await Promise.all([
        supabase.from("car_colors").delete().eq("car_id", carId),
        supabase.from("car_trims").delete().eq("car_id", carId),
        supabase.from("car_interiors").delete().eq("car_id", carId),
      ]);

      // Delete the car record
      const { error } = await supabase.from("cars").delete().eq("id", carId);
      
      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Автомобиль успешно удален",
      });

      // Refresh the cars list
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить автомобиль",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (car: any) => {
    console.log("Editing car:", car);
    setSelectedCar(car);
  };

  const handleEditComplete = () => {
    setSelectedCar(null);
    fetchCars();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Управление автомобилями</h2>
        <AddCarSteps />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Существующие модели</CardTitle>
          <CardDescription>
            Список всех добавленных автомобилей
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cars.map((car) => (
              <div
                key={car.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Car className="w-5 h-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium">{car.name}</h3>
                    <p className="text-sm text-gray-500">{car.base_price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(car)}
                  >
                    <Pencil className="w-4 h-4 text-blue-500" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Удалить автомобиль?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Автомобиль будет удален из базы данных.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(car.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedCar && (
        <AddCarSteps
          isEditing={true}
          initialCarData={selectedCar}
          onEditComplete={handleEditComplete}
        />
      )}
    </div>
  );
};