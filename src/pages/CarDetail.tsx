import React from "react";
import { useParams } from "react-router-dom";
import { cars } from "@/data/cars";
import Zeekr001Detail from "@/components/cars/Zeekr001Detail";
import Zeekr007Detail from "@/components/cars/Zeekr007Detail";
import Zeekr009Detail from "@/components/cars/Zeekr009Detail";

const CarDetail = () => {
  const { id } = useParams();
  const car = cars.find((c) => c.id === id);

  if (!car) {
    return <div className="container mx-auto px-4 pt-24">Автомобиль не найден</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      {car.id === "zeekr-001" && <Zeekr001Detail car={car} />}
      {car.id === "zeekr-007" && <Zeekr007Detail car={car} />}
      {car.id === "zeekr-009" && <Zeekr009Detail car={car} />}
    </div>
  );
};

export default CarDetail;