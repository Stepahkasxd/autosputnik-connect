import { Header } from "@/components/Header";
import { SupportForm } from "@/components/support/SupportForm";

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Техническая поддержка</h1>
          <p className="text-gray-600 mb-8">
            Если у вас возникли вопросы или проблемы, пожалуйста, заполните форму ниже, 
            и наша команда поддержки свяжется с вами в ближайшее время.
          </p>
          <SupportForm />
        </div>
      </div>
    </div>
  );
};

export default Support;