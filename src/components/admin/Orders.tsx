import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список заказов",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.from("orders").delete().eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Заказ успешно удален",
      });

      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить заказ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Заказы</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Имя</TableHead>
            <TableHead>Автомобиль</TableHead>
            <TableHead>Комплектация</TableHead>
            <TableHead>Цвет</TableHead>
            <TableHead>Салон</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Способ связи</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.name}</TableCell>
              <TableCell>{order.car_name}</TableCell>
              <TableCell>{order.trim_name || "Базовая"}</TableCell>
              <TableCell>{order.color || "Не выбран"}</TableCell>
              <TableCell>{order.interior || "Не выбран"}</TableCell>
              <TableCell>{order.price || "Базовая"}</TableCell>
              <TableCell>{order.phone}</TableCell>
              <TableCell>
                {order.contact_method === "whatsapp"
                  ? "WhatsApp"
                  : "Телефонный звонок"}
              </TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удалить заказ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Это действие нельзя отменить. Заказ будет удален из базы
                        данных.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(order.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Удалить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};