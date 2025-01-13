import { Header } from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";
import { CarCard } from "@/components/CarCard";

const cars = [
  {
    id: "zeekr-001",
    name: "Zeekr 001",
    price: "от 5 990 000 ₽",
    image: "/placeholder.svg",
  },
  {
    id: "zeekr-007",
    name: "Zeekr 007",
    price: "от 6 290 000 ₽",
    image: "/placeholder.svg",
  },
  // Add more cars here
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 fade-up">
              Найдите свой идеальный автомобиль
            </h1>
            <p className="text-xl text-gray-600 fade-up animation-delay-100">
              Подберем автомобиль на любой вкус и бюджет
            </p>
          </div>
          <ContactForm />
        </section>

        {/* Car Catalog Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Каталог автомобилей</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} {...car} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;