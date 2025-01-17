import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CarFront } from "lucide-react";

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

export const CarCard = ({ id, name, price, image }: CarCardProps) => {
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
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/car/${id}`} className="w-full">
          <Button className="w-full">Подробнее</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};