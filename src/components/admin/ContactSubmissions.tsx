import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Submission {
  id: string;
  name: string;
  car_preferences: string;
  timing: string;
  phone: string;
  contact_method: string;
  created_at: string;
}

export const ContactSubmissions = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заявки",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => prev.filter(submission => submission.id !== id));
      toast({
        title: "Заявка удалена",
        description: "Заявка была успешно удалена",
      });
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить заявку",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Заявки на обратную связь</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Имя</TableHead>
            <TableHead>Предпочтения</TableHead>
            <TableHead>Планируемая дата</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Способ связи</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{submission.name}</TableCell>
              <TableCell>{submission.car_preferences}</TableCell>
              <TableCell>{new Date(submission.timing).toLocaleDateString()}</TableCell>
              <TableCell>{submission.phone}</TableCell>
              <TableCell>
                {submission.contact_method === 'whatsapp' ? 'WhatsApp' : 'Телефон'}
              </TableCell>
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