import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const ContactSubmissions = () => {
  const { toast } = useToast();
  
  // Mock data - replace with actual data from your backend
  const submissions = [
    { id: 1, name: "Иван Петров", email: "ivan@example.com", message: "Интересует Zeekr 001", date: "2024-02-20" },
    { id: 2, name: "Анна Иванова", email: "anna@example.com", message: "Хочу тест-драйв", date: "2024-02-19" },
  ];

  const handleDelete = (id: number) => {
    console.log("Deleting submission:", id);
    toast({
      title: "Заявка удалена",
      description: `Заявка #${id} была успешно удалена`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Заявки на обратную связь</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Имя</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Сообщение</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>{submission.date}</TableCell>
              <TableCell>{submission.name}</TableCell>
              <TableCell>{submission.email}</TableCell>
              <TableCell>{submission.message}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(submission.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};