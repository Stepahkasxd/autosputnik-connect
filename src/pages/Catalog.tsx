import { Header } from "@/components/Header";
import { CarCard } from "@/components/CarCard";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import type { Car } from "@/data/cars";

const Catalog = () => {
  const { toast } = useToast();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    setCars([]);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <section className="py-12">
          <h1 className="text-3xl font-bold mb-8 text-center">Каталог автомобилей</h1>
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

export default Catalog;