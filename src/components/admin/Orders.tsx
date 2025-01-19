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
import { Input } from "@/components/ui/input";
import { Trash2, ArrowUpDown, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, sortField, sortOrder, searchTerm]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching orders...");

      let query = supabase
        .from("orders")
        .select("*", { count: "exact" });

      // Apply search filter if searchTerm exists
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,car_name.ilike.%${searchTerm}%`);
      }

      // Apply sorting
      query = query.order(sortField, { ascending: sortOrder === "asc" });

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setOrders(data || []);
      if (count) {
        setTotalPages(Math.ceil(count / itemsPerPage));
      }
      
      console.log("Orders fetched:", data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список заказов",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return (
      <ArrowUpDown
        className={`w-4 h-4 ml-1 transform ${
          sortOrder === "asc" ? "rotate-0" : "rotate-180"
        }`}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Заказы</h2>
        <div className="flex gap-4">
          <Input
            placeholder="Поиск по имени или автомобилю..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select
            value={`${itemsPerPage}`}
            onValueChange={(value) => {
              setCurrentPage(1);
              // Implement items per page change logic here
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Записей на странице" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 записей</SelectItem>
              <SelectItem value="25">25 записей</SelectItem>
              <SelectItem value="50">50 записей</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
          <div className="text-lg font-medium text-muted-foreground">
            Заказов пока нет
          </div>
          <p className="text-sm text-muted-foreground">
            Когда появятся новые заказы, они отобразятся здесь
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                    <div className="flex items-center">
                      Имя {renderSortIcon("name")}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("car_name")} className="cursor-pointer">
                    <div className="flex items-center">
                      Автомобиль {renderSortIcon("car_name")}
                    </div>
                  </TableHead>
                  <TableHead>Комплектация</TableHead>
                  <TableHead>Цвет</TableHead>
                  <TableHead>Салон</TableHead>
                  <TableHead onClick={() => handleSort("price")} className="cursor-pointer">
                    <div className="flex items-center">
                      Цена {renderSortIcon("price")}
                    </div>
                  </TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Способ связи</TableHead>
                  <TableHead onClick={() => handleSort("created_at")} className="cursor-pointer">
                    <div className="flex items-center">
                      Дата {renderSortIcon("created_at")}
                    </div>
                  </TableHead>
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

          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Предыдущая
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Страница {currentPage} из {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Следующая
            </Button>
          </div>
        </>
      )}
    </div>
  );
};