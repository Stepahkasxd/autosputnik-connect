import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";
import { CarCard } from "@/components/CarCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Car } from "@/data/cars";

const Index = () => {
  const { toast } = useToast();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const convertDbCarToCar = (dbCar: any): Car => {
    return {
      id: dbCar.id,
      name: dbCar.name,
      basePrice: dbCar.base_price,
      image: dbCar.image_url || "/placeholder.svg",
      specs: dbCar.specs,
      colors: [],
      interiors: [],
      trims: []
    };
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .order("name");

        if (error) {
          throw error;
        }

        if (data) {
          const convertedCars = data.map(convertDbCarToCar);
          setCars(convertedCars);
        }
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

    fetchCars();
  }, [toast]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 fade-up">
              Найдите свой идеальный автомобиль
            </h1>
            <p className="text-xl text-gray-600 fade-up animation-delay-100">
              Подберем автомобиль на любой вкус и бюджет
            </p>
          </div>
          <ContactForm />
        </section>

        {/* Car Catalog Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Каталог автомобилей</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div 
                  key={n} 
                  className="h-[300px] rounded-lg bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard
                  key={car.id}
                  id={car.id}
                  name={car.name}
                  price={car.basePrice}
                  image={car.image}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Автомобили пока не добавлены
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;