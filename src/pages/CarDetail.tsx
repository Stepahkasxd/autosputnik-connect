import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Zeekr001Detail from "@/components/cars/Zeekr001Detail";
import Zeekr007Detail from "@/components/cars/Zeekr007Detail";
import Zeekr009Detail from "@/components/cars/Zeekr009Detail";
import LixiangL6Detail from "@/components/cars/LixiangL6Detail";
import LixiangL7Detail from "@/components/cars/LixiangL7Detail";
import LixiangL9Detail from "@/components/cars/LixiangL9Detail";
import LixiangMegaDetail from "@/components/cars/LixiangMegaDetail";
import { Car } from "@/data/cars";

const fetchCarById = async (id: string): Promise<Car> => {
  console.log("Fetching car details for id:", id);
  
  // Fetch car details
  const { data: carData, error: carError } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (carError) {
    console.error("Error fetching car:", carError);
    throw carError;
  }

  // Fetch car colors
  const { data: colorData, error: colorError } = await supabase
    .from("car_colors")
    .select("*")
    .eq("car_id", id);

  if (colorError) {
    console.error("Error fetching colors:", colorError);
    throw colorError;
  }

  // Fetch car trims
  const { data: trimData, error: trimError } = await supabase
    .from("car_trims")
    .select("*")
    .eq("car_id", id);

  if (trimError) {
    console.error("Error fetching trims:", trimError);
    throw trimError;
  }

  console.log("Fetched car details:", { carData, colorData, trimData });

  // Transform the data to match the Car interface
  const car: Car = {
    id: carData.id,
    name: carData.name,
    basePrice: carData.base_price,
    image: carData.image_url || "/placeholder.svg",
    colors: colorData.map((color) => ({
      name: color.name,
      code: color.code,
    })) || [],
    interiors: [{ name: "Default Interior" }], // Default value since we don't have interiors in DB yet
    trims: trimData.map((trim) => ({
      name: trim.name,
      price: trim.price,
    })) || [],
    specs: carData.specs || {},
  };

  return car;
};

const CarDetail = () => {
  const { id } = useParams();

  const { data: car, isLoading, error } = useQuery({
    queryKey: ["car", id],
    queryFn: () => fetchCarById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Автомобиль не найден
          </h1>
          <p className="text-gray-600">
            Извините, но запрашиваемый автомобиль не существует или был удален
          </p>
        </div>
      </div>
    );
  }

  const getDetailComponent = () => {
    const name = car.name.toLowerCase();
    if (name.includes("zeekr 001")) return <Zeekr001Detail car={car} />;
    if (name.includes("zeekr 007")) return <Zeekr007Detail car={car} />;
    if (name.includes("zeekr 009")) return <Zeekr009Detail car={car} />;
    if (name.includes("lixiang l6")) return <LixiangL6Detail car={car} />;
    if (name.includes("lixiang l7")) return <LixiangL7Detail car={car} />;
    if (name.includes("lixiang l9")) return <LixiangL9Detail car={car} />;
    if (name.includes("lixiang mega")) return <LixiangMegaDetail car={car} />;

    // Default detail view if no specific component matches
    return (
      <div className="space-y-8 pb-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{car.name}</h1>
          <p className="text-xl text-gray-600">{car.basePrice}</p>
        </div>
        
        <div className="aspect-video overflow-hidden rounded-lg">
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-full object-cover"
          />
        </div>

        {car.specs && Object.keys(car.specs).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Характеристики</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(car.specs).map(([key, value]) => (
                <div key={key} className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">{key}</p>
                  <p className="font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 pt-24">
      {getDetailComponent()}
    </div>
  );
};

export default CarDetail;