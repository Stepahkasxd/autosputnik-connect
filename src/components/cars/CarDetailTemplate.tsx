import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Car } from "@/data/cars";
import { OrderForm } from "./OrderForm";
import { CarSpecs } from "./CarSpecs";
import { TrimSelector } from "./TrimSelector";
import { ArrowLeft, Send } from "lucide-react";
import { Link } from "react-router-dom";

interface CarDetailTemplateProps {
  car: Car;
}

const CarDetailTemplate = ({ car }: CarDetailTemplateProps) => {
  const [selectedTrim, setSelectedTrim] = useState(car.trims[0]);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <Link to="/catalog" className="inline-flex items-center text-white hover:text-primary mb-8">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Назад
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Car Image */}
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
          <img
            src={car.image || "/placeholder.svg"}
            alt={car.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Column - Car Details */}
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">{car.name}</h1>
              <p className="text-2xl">{selectedTrim?.price || car.basePrice}</p>
            </div>
            <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Send className="w-5 h-5 mr-2" />
                  Заказать
                </Button>
              </DialogTrigger>
              <DialogContent>
                <OrderForm
                  carName={car.name}
                  selectedTrim={selectedTrim}
                  onClose={() => setIsOrderDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Trims */}
          {car.trims && car.trims.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-primary">✦</span> Комплектации
              </h2>
              <TrimSelector
                trims={car.trims}
                selectedTrim={selectedTrim}
                onTrimChange={(trimName) => {
                  const trim = car.trims.find((t) => t.name === trimName);
                  if (trim) setSelectedTrim(trim);
                }}
              />
            </div>
          )}

          {/* Specifications */}
          {car.specs && Object.keys(car.specs).length > 0 && (
            <CarSpecs specs={car.specs} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailTemplate;