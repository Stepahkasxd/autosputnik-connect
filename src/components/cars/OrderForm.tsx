import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MessageSquare, Phone, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface OrderFormProps {
  carName: string;
  selectedTrim?: { name: string } | null;
  onClose: () => void;
}

export const OrderForm = ({ carName, selectedTrim, onClose }: OrderFormProps) => {
  const [orderForm, setOrderForm] = useState({
    name: "",
    phone: "",
    contactMethod: "whatsapp"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('orders')
        .insert([{
          name: orderForm.name,
          phone: orderForm.phone,
          contact_method: orderForm.contactMethod,
          car_name: carName,
          trim_name: selectedTrim?.name || null,
        }]);

      if (error) throw error;

      toast({
        title: "Заказ отправлен",
        description: "Мы свяжемся с вами в ближайшее время",
      });
      
      onClose();
      setOrderForm({
        name: "",
        phone: "",
        contactMethod: "whatsapp"
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заказ. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Ваше имя</Label>
        <Input
          id="name"
          value={orderForm.name}
          onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Номер телефона</Label>
        <Input
          id="phone"
          type="tel"
          value={orderForm.phone}
          onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Способ связи</Label>
        <RadioGroup
          value={orderForm.contactMethod}
          onValueChange={(value) => setOrderForm({ ...orderForm, contactMethod: value })}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="whatsapp" id="whatsapp" />
            <Label htmlFor="whatsapp" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="phone" />
            <Label htmlFor="phone" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Телефонный звонок</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <Button type="submit" className="w-full">
        Отправить
        <Send className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
};