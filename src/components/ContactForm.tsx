import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { MessageSquare, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Step = "welcome" | "name" | "car" | "timing" | "contact";

interface ChatMessage {
  text: string;
  isUser?: boolean;
}

export const ContactForm = () => {
  const [step, setStep] = useState<Step>("welcome");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "Приветствую! Меня зовут Виктория. Я сотрудничаю с крупными автоплощадками китайских и европейских марок. Подберу авто на любой вкус и цвет, найду лучшие цены и помогу с документами. Бонусом: фото и видео-отчеты." }
  ]);
  const [formData, setFormData] = useState({
    name: "",
    carPreferences: "",
    timing: "",
    phone: "",
    contactMethod: "whatsapp"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          car_preferences: formData.carPreferences,
          timing: formData.timing,
          phone: formData.phone,
          contact_method: formData.contactMethod
        }]);

      if (error) throw error;

      toast({
        title: "Форма отправлена",
        description: "Виктория свяжется с вами в ближайшее время",
      });
      
      // Reset form
      setStep("welcome");
      setMessages([messages[0]]);
      setFormData({
        name: "",
        carPreferences: "",
        timing: "",
        phone: "",
        contactMethod: "whatsapp"
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить форму. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      });
    }
  };

  const addMessage = (text: string, isUser = false) => {
    setMessages(prev => [...prev, { text, isUser }]);
  };

  const renderInput = () => {
    switch (step) {
      case "welcome":
        return (
          <Button 
            onClick={() => {
              addMessage("Напишите, пожалуйста, ваше имя");
              setStep("name");
            }}
            className="w-full"
          >
            Начать общение
          </Button>
        );
      case "name":
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!formData.name) return;
            addMessage(formData.name, true);
            addMessage(`Отлично, ${formData.name}! Давайте подберем автомобиль именно для вас. Какой автомобиль вы хотите приобрести? (Марка, модель, год, цвет, характеристики)`);
            setStep("car");
          }}>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ваше имя"
              className="mb-2"
            />
            <Button type="submit" className="w-full">Далее</Button>
          </form>
        );
      case "car":
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!formData.carPreferences) return;
            addMessage(formData.carPreferences, true);
            addMessage("Отличный выбор! А когда бы вы хотели приобрести авто?");
            setStep("timing");
          }}>
            <Input
              value={formData.carPreferences}
              onChange={(e) => setFormData({ ...formData, carPreferences: e.target.value })}
              placeholder="Опишите желаемый автомобиль"
              className="mb-2"
            />
            <Button type="submit" className="w-full">Далее</Button>
          </form>
        );
      case "timing":
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!formData.timing) return;
            addMessage(formData.timing, true);
            addMessage("Принято! Подскажите, как с вами связаться?");
            setStep("contact");
          }}>
            <Input
              type="date"
              value={formData.timing}
              onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
              className="mb-2"
            />
            <Button type="submit" className="w-full">Далее</Button>
          </form>
        );
      case "contact":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Ваш номер телефона"
              required
            />
            <RadioGroup
              value={formData.contactMethod}
              onValueChange={(value) => setFormData({ ...formData, contactMethod: value })}
              className="space-y-2"
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
            <Button type="submit" className="w-full">Отправить</Button>
          </form>
        );
    }
  };

  return (
    <div className="glass-card p-6 rounded-lg max-w-md mx-auto space-y-6 fade-up">
      <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.isUser
                ? "bg-primary text-primary-foreground ml-8"
                : "bg-muted mr-8"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      {renderInput()}
    </div>
  );
};