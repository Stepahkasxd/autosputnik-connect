import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { title: "Каталог автомобилей", path: "/catalog" },
    { title: "Подбор автомобиля", path: "/selection" },
    { title: "Услуги", path: "/services" },
    { title: "Техподдержка", path: "/support" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">г. Москва</span>
          </div>
          
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-semibold">Автоспутник</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};