import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SupportTicket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export const SupportTickets = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить тикеты",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTickets(prev => prev.filter(ticket => ticket.id !== id));
      toast({
        title: "Тикет удален",
        description: "Тикет был успешно удален",
      });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить тикет",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (id: string) => {
    try {
      const ticket = tickets.find(t => t.id === id);
      const newStatus = ticket?.status === 'pending' ? 'resolved' : 'pending';

      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setTickets(prev => prev.map(ticket => 
        ticket.id === id ? { ...ticket, status: newStatus } : ticket
      ));

      toast({
        title: "Статус обновлен",
        description: `Тикет отмечен как ${newStatus === 'resolved' ? 'решенный' : 'ожидающий'}`,
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Тикеты поддержки</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Имя</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Тема</TableHead>
            <TableHead>Сообщение</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{ticket.name}</TableCell>
              <TableCell>{ticket.email}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell className="max-w-xs truncate">{ticket.message}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  ticket.status === 'resolved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {ticket.status === 'resolved' ? 'Решен' : 'Ожидает'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleStatusChange(ticket.id)}
                  >
                    {ticket.status === 'resolved' ? (
                      <MessageSquare className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(ticket.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};