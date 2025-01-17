import { Header } from "@/components/Header";
import { CarCard } from "@/components/CarCard";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Helper function to ensure specs are in the correct format
const formatSpecs = (specs: any): Record<string, string> => {
  if (typeof specs !== 'object' || specs === null) {
    return {};
  }
  
  const formattedSpecs: Record<string, string> = {};
  Object.entries(specs).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formattedSpecs[key] = String(value);
    }
  });
  return formattedSpecs;
};

const fetchCars = async () => {
  console.log("Fetching cars from Supabase...");
  const { data, error } = await supabase
    .from("cars")
    .select(`
      *,
      car_trims (
        name,
        price,
        specs
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cars:", error);
    throw error;
  }

  // Transform the data to match the expected types
  const transformedData = data.map(car => ({
    ...car,
    specs: formatSpecs(car.specs),
    car_trims: car.car_trims?.map((trim: any) => ({
      name: trim.name,
      price: trim.price,
      specs: formatSpecs(trim.specs)
    })) || []
  }));

  console.log("Fetched and transformed cars:", transformedData);
  return transformedData;
};

const Catalog = () => {
  const { toast } = useToast();

  const { data: cars, isLoading, error } = useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
  });

  useEffect(() => {
    if (error) {
      console.error("Error in cars query:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список автомобилей",
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
          ) : cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard
                  key={car.id}
                  id={car.id}
                  name={car.name}
                  price={car.base_price}
                  image={car.image_url || "/placeholder.svg"}
                  specs={car.specs}
                  trims={car.car_trims}
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