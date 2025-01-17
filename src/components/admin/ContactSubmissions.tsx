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
    <div className="bg-card dark:bg-card/40 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Заявки на обратную связь</h2>
      
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 dark:border-border/20">
              <TableHead className="text-muted-foreground">Дата</TableHead>
              <TableHead className="text-muted-foreground">Имя</TableHead>
              <TableHead className="text-muted-foreground">Предпочтения</TableHead>
              <TableHead className="text-muted-foreground">Планируемая дата</TableHead>
              <TableHead className="text-muted-foreground">Телефон</TableHead>
              <TableHead className="text-muted-foreground">Способ связи</TableHead>
              <TableHead className="text-muted-foreground">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow 
                key={submission.id}
                className="border-border/50 dark:border-border/20 hover:bg-muted/50 dark:hover:bg-muted/20"
              >
                <TableCell className="text-foreground">{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-foreground">{submission.name}</TableCell>
                <TableCell className="text-foreground">{submission.car_preferences}</TableCell>
                <TableCell className="text-foreground">{new Date(submission.timing).toLocaleDateString()}</TableCell>
                <TableCell className="text-foreground">{submission.phone}</TableCell>
                <TableCell className="text-foreground">
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
    </div>
  );
};