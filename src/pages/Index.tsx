import { Header } from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CarFront, Shield, Clock, BadgeCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CarCard } from "@/components/CarCard";

const Index = () => {
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
      icon: <Shield className="w-12 h-12 text-purple-500" />,
      title: "Гарантия качества",
      description: "Все автомобили проходят тщательную проверку перед продажей"
    },
    {
      icon: <Clock className="w-12 h-12 text-pink-500" />,
      title: "Быстрое оформление",
      description: "Оформление документов занимает минимум времени"
    },
    {
      icon: <BadgeCheck className="w-12 h-12 text-purple-500" />,
      title: "Официальный дилер",
      description: "Мы являемся официальным представителем брендов"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/50">
      <Header />
      
      <main className="container mx-auto px-4 pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 fade-up bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Найдите свой идеальный автомобиль
            </h1>
            <p className="text-xl text-muted-foreground fade-up animation-delay-100">
              Подберем автомобиль на любой вкус и бюджет
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="space-y-6 fade-up">
              <div className="glass-card p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Почему мы?</h2>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Индивидуальный подход к каждому клиенту</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    <span>Большой выбор автомобилей</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Помощь в оформлении документов</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="fade-up animation-delay-200">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Popular Models Section */}
        <section className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Популярные модели</h2>
            <p className="text-muted-foreground">Самые востребованные автомобили этого месяца</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {popularCars?.map((car) => (
              <div key={car.id} className="fade-up">
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
              <Button variant="outline" className="group">
                Смотреть все модели
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Наши преимущества</h2>
            <p className="text-muted-foreground">Почему клиенты выбирают нас</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} className="text-center p-6 glass-card fade-up">
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-center">{advantage.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
                  <p className="text-muted-foreground">{advantage.description}</p>
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