import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  Car, 
  FileText, 
  Shield, 
  PaintBucket, 
  Settings, 
  Headphones,
  Globe,
  Calculator,
  Clock
} from "lucide-react";
import { useInView } from "react-intersection-observer";

const ServiceCard = ({ 
  title, 
  description, 
  icon: Icon, 
  badges = [] 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  badges?: string[];
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      <Card className={`h-full transition-all duration-500 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base mb-4">{description}</CardDescription>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant="secondary">{badge}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      title: "Подбор автомобиля",
      description: "Профессиональный подбор автомобиля под ваши требования и бюджет. Учитываем все ваши пожелания и предлагаем оптимальные варианты.",
      icon: Car,
      badges: ["Индивидуальный подход", "Полный анализ", "Тест-драйв"]
    },
    {
      title: "Техническая диагностика",
      description: "Полная техническая диагностика автомобиля перед покупкой. Проверка всех систем и агрегатов на специализированном оборудовании.",
      icon: Wrench,
      badges: ["Компьютерная диагностика", "Проверка ходовой", "Осмотр кузова"]
    },
    {
      title: "Оформление документов",
      description: "Помощь в оформлении всех необходимых документов при покупке автомобиля. Работаем со всеми видами оплаты и страховыми компаниями.",
      icon: FileText,
      badges: ["Страхование", "Регистрация", "Лизинг"]
    },
    {
      title: "Русификация автомобиля",
      description: "Полная русификация меню, навигации и мультимедийной системы автомобиля. Установка русских карт и голосового помощника.",
      icon: Globe,
      badges: ["Перевод меню", "Русские карты", "Голосовой помощник"]
    },
    {
      title: "Гарантийное обслуживание",
      description: "Полное гарантийное обслуживание автомобилей. Регулярные ТО и ремонт с использованием оригинальных запчастей.",
      icon: Shield,
      badges: ["Оригинальные запчасти", "Сертифицированный сервис", "Гарантия"]
    },
    {
      title: "Детейлинг",
      description: "Профессиональный детейлинг и уход за автомобилем. Полировка, керамическое покрытие, химчистка салона.",
      icon: PaintBucket,
      badges: ["Полировка", "Керамика", "Химчистка"]
    },
    {
      title: "Дооснащение",
      description: "Установка дополнительного оборудования и тюнинг автомобиля. Модернизация систем безопасности и комфорта.",
      icon: Settings,
      badges: ["Тюнинг", "Доп. оборудование", "Модернизация"]
    },
    {
      title: "Техническая поддержка",
      description: "Круглосуточная техническая поддержка и консультации по всем вопросам эксплуатации автомобиля.",
      icon: Headphones,
      badges: ["24/7", "Онлайн консультации", "Выезд специалиста"]
    },
    {
      title: "Финансовые услуги",
      description: "Помощь в получении кредита или лизинга. Работаем с ведущими банками и лизинговыми компаниями.",
      icon: Calculator,
      badges: ["Кредит", "Лизинг", "Рассрочка"]
    },
    {
      title: "Trade-in",
      description: "Обмен вашего автомобиля на новый с доплатой. Быстрая и справедливая оценка вашего автомобиля.",
      icon: Clock,
      badges: ["Быстрая оценка", "Выкуп", "Обмен"]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-8 text-center">Наши услуги</h1>
      <p className="text-xl text-muted-foreground text-center mb-12">
        Полный спектр услуг для вашего комфорта
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default Services;