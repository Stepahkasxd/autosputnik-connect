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
    <div className="bg-card dark:bg-card/40 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Тикеты поддержки</h2>
      
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 dark:border-border/20">
              <TableHead className="text-muted-foreground">Дата</TableHead>
              <TableHead className="text-muted-foreground">Имя</TableHead>
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground">Тема</TableHead>
              <TableHead className="text-muted-foreground">Сообщение</TableHead>
              <TableHead className="text-muted-foreground">Статус</TableHead>
              <TableHead className="text-muted-foreground">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow 
                key={ticket.id}
                className="border-border/50 dark:border-border/20 hover:bg-muted/50 dark:hover:bg-muted/20"
              >
                <TableCell className="text-foreground">{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-foreground">{ticket.name}</TableCell>
                <TableCell className="text-foreground">{ticket.email}</TableCell>
                <TableCell className="text-foreground">{ticket.subject}</TableCell>
                <TableCell className="text-foreground max-w-xs truncate">{ticket.message}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ticket.status === 'resolved' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
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
                      className="hover:bg-muted/50 dark:hover:bg-muted/20"
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
    </div>
  );
};