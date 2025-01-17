import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MessageSquare, Phone, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CarColor, CarInterior, CarTrim } from "@/data/cars";

interface OrderFormProps {
  carName: string;
  selectedTrim?: CarTrim;
  selectedColor: CarColor;
  selectedInterior: CarInterior;
  onClose: () => void;
}

export const OrderForm = ({ carName, selectedTrim, selectedColor, selectedInterior, onClose }: OrderFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("whatsapp");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("orders").insert([
        {
          name,
          car_name: carName,
          trim_name: selectedTrim?.name,
          phone,
          contact_method: contactMethod,
          color: selectedColor.name,
          interior: selectedInterior.name,
          price: selectedTrim?.price || "Base",
        },
      ]);

      if (error) throw error;

      toast({
        title: "Заказ отправлен",
        description: "Мы свяжемся с вами в ближайшее время",
      });

      onClose();
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заказ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Input
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <Input
            placeholder="Номер телефона"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Выбранный цвет:</span>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: selectedColor.code }}
              />
              <span>{selectedColor.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Выбранный салон:</span>
            <span>{selectedInterior.name}</span>
          </div>

          {selectedTrim && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Комплектация:</span>
              <span>{selectedTrim.name}</span>
            </div>
          )}
        </div>

        <RadioGroup
          value={contactMethod}
          onValueChange={setContactMethod}
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Отправка..." : "Отправить заказ"}
        <Send className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
};