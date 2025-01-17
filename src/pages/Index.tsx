import { Header } from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";

const Index = () => {
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
      </main>
    </div>
  );
};

export default Index;