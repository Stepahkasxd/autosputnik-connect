import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CarFront } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CarCardProps {
  id: string;
  name: string;
  price: string;
  image?: string;
  specs: Record<string, string>;
  trims?: Array<{
    name: string;
    price: string;
    specs: Record<string, string>;
  }>;
}

export const CarCard = ({ id, name, price, image, specs, trims }: CarCardProps) => {
  // Функция для отображения характеристик
  const renderSpecs = (specsToRender: Record<string, string>) => {
    if (!specsToRender || Object.keys(specsToRender).length === 0) return null;

    return (
      <div className="mt-4 grid grid-cols-1 gap-2">
        {Object.entries(specsToRender).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{key}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="aspect-[16/9] relative bg-muted">
          {image ? (
            <img
              src={image}
              alt={name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CarFront className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1">
        <CardTitle className="text-lg mb-2">{name}</CardTitle>
        <p className="text-xl font-semibold text-primary">{price}</p>
        
        {renderSpecs(specs)}

        {trims && trims.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-4">
              <h3 className="font-medium">Комплектации:</h3>
              {trims.map((trim, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{trim.name}</span>
                    <span className="text-primary">{trim.price}</span>
                  </div>
                  {renderSpecs(trim.specs)}
                  {index < trims.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/car/${id}`} className="w-full">
          <Button className="w-full">Подробнее</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};