import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CarDetailTemplate from "@/components/cars/CarDetailTemplate";
import { Car, CarSpecs } from "@/data/cars";

const fetchCarById = async (id: string): Promise<Car> => {
  console.log("Fetching car details for id:", id);
  
  // If we're in preview mode, don't make the API call
  if (id === 'preview') {
    throw new Error('Preview mode is only available in the admin panel');
  }

  const { data: carData, error: carError } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (carError) {
    console.error("Error fetching car:", carError);
    throw carError;
  }

  const { data: colorData, error: colorError } = await supabase
    .from("car_colors")
    .select("*")
    .eq("car_id", id);

  if (colorError) {
    console.error("Error fetching colors:", colorError);
    throw colorError;
  }

  const { data: trimData, error: trimError } = await supabase
    .from("car_trims")
    .select("*")
    .eq("car_id", id);

  if (trimError) {
    console.error("Error fetching trims:", trimError);
    throw trimError;
  }

  // Add interior fetch
  const { data: interiorData, error: interiorError } = await supabase
    .from("car_interiors")
    .select("*")
    .eq("car_id", id);

  if (interiorError) {
    console.error("Error fetching interiors:", interiorError);
    throw interiorError;
  }

  console.log("Fetched car details:", { carData, colorData, trimData, interiorData });

  const car: Car = {
    id: carData.id,
    name: carData.name,
    basePrice: carData.base_price,
    image: carData.image_url || "/placeholder.svg",
    colors: colorData.map((color) => ({
      name: color.name,
      code: color.code,
      image_url: color.image_url,
    })) || [],
    interiors: interiorData.map((interior) => ({
      name: interior.name,
    })) || [],
    trims: trimData.map((trim) => ({
      name: trim.name,
      price: trim.price,
      specs: trim.specs || {},
    })) || [],
    specs: carData.specs as CarSpecs || {},
  };

  return car;
};

const CarDetail = () => {
  const { id } = useParams();

  const { data: car, isLoading, error } = useQuery({
    queryKey: ["car", id],
    queryFn: () => fetchCarById(id!),
    enabled: !!id && id !== 'preview',
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

  return (
    <div className="container mx-auto px-4 pt-24">
      <CarDetailTemplate car={car} />
    </div>
  );
};

export default CarDetail;