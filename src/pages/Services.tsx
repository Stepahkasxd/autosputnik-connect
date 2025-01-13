import React from "react";

const Services = () => {
  return (
    <div className="container mx-auto px-4 pt-24">
      <h1 className="text-3xl font-bold mb-6">Наши услуги</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg border bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Подбор автомобиля</h2>
          <p className="text-gray-600">
            Профессиональный подбор автомобиля под ваши требования и бюджет
          </p>
        </div>
        <div className="p-6 rounded-lg border bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Диагностика</h2>
          <p className="text-gray-600">
            Полная техническая диагностика перед покупкой
          </p>
        </div>
        <div className="p-6 rounded-lg border bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Оформление документов</h2>
          <p className="text-gray-600">
            Помощь в оформлении всех необходимых документов
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;