import { Header } from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CarFront, 
  Shield, 
  Clock, 
  BadgeCheck, 
  ArrowRight,
  Wrench,
  FileText,
  Globe,
  PaintBucket,
  Settings,
  Headphones,
  Calculator
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CarCard } from "@/components/CarCard";
import { useInView } from "react-intersection-observer";

const Index = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [carsRef, carsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [advantagesRef, advantagesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [servicesRef, servicesInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const { data: popularCars } = useQuery({
    queryKey: ['popularCars'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const advantages = [
    {
      icon: <Shield className="w-10 h-10 md:w-12 md:h-12 text-purple-500" />,
      title: "Гарантия качества",
      description: "Все автомобили проходят тщательную проверку перед продажей"
    },
    {
      icon: <Clock className="w-10 h-10 md:w-12 md:h-12 text-pink-500" />,
      title: "Быстрое оформление",
      description: "Оформление документов занимает минимум времени"
    },
    {
      icon: <BadgeCheck className="w-10 h-10 md:w-12 md:h-12 text-purple-500" />,
      title: "Официальный дилер",
      description: "Мы являемся официальным представителем брендов"
    }
  ];

  const services = [
    {
      title: "Подбор автомобиля",
      description: "Профессиональный подбор автомобиля под ваши требования и бюджет. Учитываем все ваши пожелания и предлагаем оптимальные варианты.",
      icon: CarFront,
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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/50">
      <Header />
      
      <main className="container mx-auto px-4 pt-16 md:pt-20 space-y-12 md:space-y-24">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className={`py-8 md:py-16 transition-all duration-700 ${
            heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="max-w-4xl mx-auto text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Найдите свой идеальный автомобиль
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Подберем автомобиль на любой вкус и бюджет
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div 
              className={`space-y-6 transition-all duration-700 delay-200 ${
                heroInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
              <div className="glass-card p-6 md:p-8 rounded-lg">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Почему мы?</h2>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                    <span className="text-base md:text-lg">Индивидуальный подход к каждому клиенту</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0"></span>
                    <span className="text-base md:text-lg">Большой выбор автомобилей</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                    <span className="text-base md:text-lg">Помощь в оформлении документов</span>
                  </li>
                </ul>
              </div>
            </div>
            <div 
              ref={formRef}
              className={`transition-all duration-700 delay-300 ${
                formInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
            >
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Popular Models Section */}
        <section 
          ref={carsRef}
          className={`py-12 transition-all duration-700 ${
            carsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Популярные модели</h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Самые востребованные автомобили этого месяца
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
            {popularCars?.map((car, index) => (
              <div 
                key={car.id}
                className={`transition-all duration-700 ${
                  carsInView 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CarCard
                  id={car.id}
                  name={car.name}
                  price={car.base_price}
                  image={car.image_url}
                  specs={car.specs}
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/catalog">
              <Button 
                variant="outline" 
                className="group text-base md:text-lg px-6 py-3 transition-all hover:scale-105"
              >
                Смотреть все модели
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Services Section */}
        <section 
          ref={servicesRef}
          className={`py-12 transition-all duration-700 ${
            servicesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Наши услуги</h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Полный спектр услуг для вашего комфорта
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <Card 
                key={index}
                className={`h-full transition-all duration-700 ${
                  servicesInView 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.badges.map((badge, badgeIndex) => (
                      <span
                        key={badgeIndex}
                        className="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded-full"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Advantages Section */}
        <section 
          ref={advantagesRef}
          className={`py-12 transition-all duration-700 ${
            advantagesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Наши преимущества</h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Почему клиенты выбирают нас
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {advantages.map((advantage, index) => (
              <Card 
                key={index} 
                className={`text-center p-6 md:p-8 glass-card transition-all duration-700 ${
                  advantagesInView 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="mb-4 md:mb-6 flex justify-center">
                    {advantage.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-3">
                    {advantage.title}
                  </h3>
                  <p className="text-base md:text-lg text-muted-foreground">
                    {advantage.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
