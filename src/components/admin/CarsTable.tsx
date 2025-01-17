import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database } from "@/integrations/supabase/types";

type Car = Database["public"]["Tables"]["cars"]["Row"] & {
  car_colors: Database["public"]["Tables"]["car_colors"]["Row"][];
  car_trims: Database["public"]["Tables"]["car_trims"]["Row"][];
};

interface CarsTableProps {
  cars: Car[];
  onEdit: (car: Car) => void;
  onDelete: (id: string) => void;
}

export const CarsTable = ({ cars, onEdit, onDelete }: CarsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Модель</TableHead>
          <TableHead>Базовая цена</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cars.map((car) => (
          <TableRow key={car.id}>
            <TableCell>{car.name}</TableCell>
            <TableCell>{car.base_price}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(car)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(car.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};