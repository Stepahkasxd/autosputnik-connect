import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CarFront } from "lucide-react";

interface CarCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
}

export const CarCard = ({ id, name, price, image }: CarCardProps) => {
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