import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { MessageSquare, Phone, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Step = "welcome" | "name" | "car" | "timing" | "contact";

interface ChatMessage {
  text: string;
  isUser?: boolean;
  isTyping?: boolean;
  displayedText?: string;
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.isUser && lastMessage?.text) {
      let currentText = "";
      const words = lastMessage.text.split(" ");
      let wordIndex = 0;

      const typeNextWord = () => {
        if (wordIndex < words.length) {
          currentText += (wordIndex > 0 ? " " : "") + words[wordIndex];
          setMessages(prev => 
            prev.map((msg, idx) => 
              idx === prev.length - 1 
                ? { ...msg, displayedText: currentText }
                : msg
            )
          );
          wordIndex++;
          setTimeout(typeNextWord, 100); // Скорость печатания (мс)
          scrollToBottom();
        }
      };

      typeNextWord();
    } else {
      scrollToBottom();
    }
  }, [messages]);

  const simulateTyping = async (text: string, isUser = false) => {
    if (isUser) {
      setMessages(prev => [...prev, { text, isUser, displayedText: text }]);
    } else {
      setMessages(prev => [...prev, { text, isUser, displayedText: "" }]);
    }
  };

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

  const addMessage = async (text: string, isUser = false) => {
    await simulateTyping(text, isUser);
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
            className="w-full flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            Начать общение
            <Send className="w-4 h-4" />
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
            <Button type="submit" className="w-full flex items-center gap-2">
              Далее
              <Send className="w-4 h-4" />
            </Button>
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
            <Button type="submit" className="w-full flex items-center gap-2">
              Далее
              <Send className="w-4 h-4" />
            </Button>
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
            <Button type="submit" className="w-full flex items-center gap-2">
              Далее
              <Send className="w-4 h-4" />
            </Button>
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
            <Button type="submit" className="w-full flex items-center gap-2">
              Отправить
              <Send className="w-4 h-4" />
            </Button>
          </form>
        );
    }
  };

  return (
    <div className="glass-card p-6 rounded-lg max-w-md mx-auto space-y-6 fade-up">
      <div 
        ref={chatContainerRef}
        className="space-y-4 max-h-[400px] overflow-y-auto mb-4 scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "p-3 rounded-lg transition-all duration-300 animate-fade-up",
              message.isUser
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-8"
                : "bg-white/80 backdrop-blur-sm border border-purple-100 mr-8"
            )}
          >
            {message.isUser ? message.text : (message.displayedText || "")}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {renderInput()}
    </div>
  );
};