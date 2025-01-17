import { Header } from "@/components/Header";
import { CarCard } from "@/components/CarCard";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedDrive, setSelectedDrive] = useState<string>("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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

  const filteredCars = cars?.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase());
    const basePrice = parseInt(car.base_price.replace(/[^\d]/g, ''), 10);
    const matchesPrice = basePrice >= priceRange[0] && basePrice <= priceRange[1];
    const matchesDrive = !selectedDrive || 
      (car.specs['Привод'] && car.specs['Привод'].toLowerCase().includes(selectedDrive.toLowerCase()));

    return matchesSearch && matchesPrice && matchesDrive;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 10000000]);
    setSelectedDrive("");
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <section className="py-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Каталог автомобилей</h1>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Поиск автомобиля..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Фильтры</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                      <Label>Ценовой диапазон</Label>
                      <div className="pt-4">
                        <Slider
                          value={priceRange}
                          min={0}
                          max={10000000}
                          step={100000}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex justify-between mt-2 text-sm text-gray-500">
                          <span>{priceRange[0].toLocaleString()} ₽</span>
                          <span>{priceRange[1].toLocaleString()} ₽</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Тип привода</Label>
                      <Select value={selectedDrive} onValueChange={setSelectedDrive}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип привода" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Все</SelectItem>
                          <SelectItem value="полный">Полный</SelectItem>
                          <SelectItem value="задний">Задний</SelectItem>
                          <SelectItem value="передний">Передний</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={clearFilters}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Сбросить фильтры
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div 
                  key={n} 
                  className="h-[300px] rounded-lg bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : filteredCars && filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
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
              {cars?.length === 0 ? "Автомобили пока не добавлены" : "По вашему запросу ничего не найдено"}
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Catalog;