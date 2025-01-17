import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Car } from "@/data/cars";
import { OrderForm } from "./OrderForm";
import { CarSpecs } from "./CarSpecs";
import { TrimSelector } from "./TrimSelector";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CarDetailTemplateProps {
  car: Car;
}

const CarDetailTemplate = ({ car }: CarDetailTemplateProps) => {
  const [selectedTrim, setSelectedTrim] = useState(car.trims[0]);
  const [selectedColor, setSelectedColor] = useState(car.colors[0]);
  const [selectedInterior, setSelectedInterior] = useState(car.interiors[0]);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  // Проверяем наличие данных
  const hasColors = car.colors && car.colors.length > 0;
  const hasInteriors = car.interiors && car.interiors.length > 0;
  const hasTrims = car.trims && car.trims.length > 0;
  const hasSpecs = car.specs && Object.keys(car.specs).length > 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <Link to="/catalog" className="inline-flex items-center text-white hover:text-primary mb-8">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Назад
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Car Image */}
        <div className="space-y-8">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
            <img
              src={car.image || "/placeholder.svg"}
              alt={car.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Color Selection */}
          {hasColors && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-primary">✦</span> Цвета
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {car.colors.map((color) => (
                  <button
                    key={color.code}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "relative p-4 rounded-lg border transition-all duration-200",
                      selectedColor.code === color.code
                        ? "border-primary"
                        : "border-gray-800 hover:border-gray-700"
                    )}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full border shadow-inner"
                        style={{ backgroundColor: color.code }}
                      />
                      <span className="text-sm text-center">{color.name}</span>
                    </div>
                    {selectedColor.code === color.code && (
                      <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
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
                  selectedColor={selectedColor}
                  selectedInterior={selectedInterior}
                  onClose={() => setIsOrderDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Interior Selection */}
          {hasInteriors && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-primary">✦</span> Варианты салона
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {car.interiors.map((interior) => (
                  <button
                    key={interior.name}
                    onClick={() => setSelectedInterior(interior)}
                    className={cn(
                      "p-4 rounded-lg border transition-all",
                      selectedInterior.name === interior.name
                        ? "border-primary bg-primary/5"
                        : "border-gray-800 hover:border-gray-700"
                    )}
                  >
                    {interior.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trims */}
          {hasTrims && (
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
          {hasSpecs && <CarSpecs specs={car.specs} />}
        </div>
      </div>
    </div>
  );
};

export default CarDetailTemplate;