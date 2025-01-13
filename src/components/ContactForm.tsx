import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { MessageSquare, Phone } from "lucide-react";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    contactMethod: "whatsapp",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast({
      title: "Форма отправлена",
      description: "Наш специалист свяжется с вами в ближайшее время",
    });
    setFormData({ name: "", phone: "", contactMethod: "whatsapp" });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-lg max-w-md mx-auto space-y-6 fade-up">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Оставьте контактные данные</h2>
        <p className="text-sm text-gray-600">С вами свяжется наш специалист</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Имя</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label>Как вам будет удобно связаться?</Label>
          <RadioGroup
            value={formData.contactMethod}
            onValueChange={(value) =>
              setFormData({ ...formData, contactMethod: value })
            }
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="whatsapp" id="whatsapp" />
              <Label htmlFor="whatsapp" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp сообщение</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="phone" id="phone" />
              <Label htmlFor="phone" className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Обычный телефонный звонок</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Отправить
      </Button>
    </form>
  );
};