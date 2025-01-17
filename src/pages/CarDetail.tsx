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

const fetchCarById = async (id: string) => {
  console.log("Fetching car details for id:", id);
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching car:", error);
    throw error;
  }

  console.log("Fetched car details:", data);
  return data;
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
          <p className="text-xl text-gray-600">{car.base_price}</p>
        </div>
        
        {car.image_url && (
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={car.image_url}
              alt={car.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

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