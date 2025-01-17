import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  name: string;
  car_name: string;
  trim_name: string | null;
  phone: string;
  contact_method: string;
  created_at: string;
}

export const Orders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заказы",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setOrders(prev => prev.filter(order => order.id !== id));
      toast({
        title: "Заказ удален",
        description: "Заказ был успешно удален",
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить заказ",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-card dark:bg-card/40 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Заказы</h2>
      
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 dark:border-border/20">
              <TableHead className="text-muted-foreground">Дата</TableHead>
              <TableHead className="text-muted-foreground">Имя</TableHead>
              <TableHead className="text-muted-foreground">Автомобиль</TableHead>
              <TableHead className="text-muted-foreground">Комплектация</TableHead>
              <TableHead className="text-muted-foreground">Телефон</TableHead>
              <TableHead className="text-muted-foreground">Способ связи</TableHead>
              <TableHead className="text-muted-foreground">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.id}
                className="border-border/50 dark:border-border/20 hover:bg-muted/50 dark:hover:bg-muted/20"
              >
                <TableCell className="text-foreground">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-foreground">{order.name}</TableCell>
                <TableCell className="text-foreground">{order.car_name}</TableCell>
                <TableCell className="text-foreground">{order.trim_name || 'Базовая'}</TableCell>
                <TableCell className="text-foreground">{order.phone}</TableCell>
                <TableCell className="text-foreground">
                  {order.contact_method === 'whatsapp' ? 'WhatsApp' : 'Telegram'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(order.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};