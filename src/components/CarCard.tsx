import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CarFront, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CarCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  specs?: Record<string, string>;
}

export const CarCard = ({ id, name, price, image, specs }: CarCardProps) => {
  // Функция для отображения ключевых характеристик
  const renderKeySpecs = () => {
    if (!specs || Object.keys(specs).length === 0) return null;

    // Приоритетные характеристики для отображения
    const prioritySpecs = [
      "Мощность",
      "Разгон до 100 км/ч",
      "Запас хода",
      "Максимальная скорость"
    ];

    // Фильтруем характеристики по приоритету
    const keySpecs = Object.entries(specs)
      .filter(([key]) => prioritySpecs.includes(key))
      .slice(0, 3); // Показываем только первые 3 характеристики

    if (keySpecs.length === 0) return null;

    return (
      <div className="mt-2 space-y-1">
        {keySpecs.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{key}:</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
        
        {Object.keys(specs).length > 3 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  <Info className="w-4 h-4 mr-1" />
                  Все характеристики
                </Button>
              </TooltipTrigger>
              <TooltipContent className="w-64">
                <div className="space-y-2">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg fade-up">
      <CardHeader className="p-0">
        <div className="aspect-video overflow-hidden bg-gray-100 relative">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CarFront className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2">{name}</CardTitle>
        <p className="text-xl font-semibold text-primary">{price}</p>
        {renderKeySpecs()}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/car/${id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Подробнее
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};