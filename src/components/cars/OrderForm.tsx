import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MessageSquare, Phone, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderFormProps {
  carName: string;
  selectedTrim?: {
    name: string;
    price: string;
  };
  onClose: () => void;
}

export const OrderForm = ({ carName, selectedTrim, onClose }: OrderFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState("whatsapp");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedInterior, setSelectedInterior] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [carDetails, setCarDetails] = useState<{
    colors: { name: string; code: string }[];
    interiors: { name: string }[];
  }>({ colors: [], interiors: [] });

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const { data: colors } = await supabase
          .from("car_colors")
          .select("name, code")
          .eq("car_name", carName);

        const { data: interiors } = await supabase
          .from("car_interiors")
          .select("name")
          .eq("car_name", carName);

        if (colors && interiors) {
          setCarDetails({ colors, interiors });
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    };

    fetchCarDetails();
  }, [carName]);

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
          color: selectedColor,
          interior: selectedInterior,
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

        <div>
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите цвет" />
            </SelectTrigger>
            <SelectContent>
              {carDetails.colors.map((color) => (
                <SelectItem key={color.name} value={color.name}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.code }}
                    />
                    {color.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={selectedInterior} onValueChange={setSelectedInterior}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите отделку салона" />
            </SelectTrigger>
            <SelectContent>
              {carDetails.interiors.map((interior) => (
                <SelectItem key={interior.name} value={interior.name}>
                  {interior.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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