import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { 
  Battery, 
  Car as CarIcon, 
  Gauge, 
  Timer, 
  Zap, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageSquare,
  Phone,
  Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Car, CarSpecs } from "@/data/cars";
import { supabase } from "@/integrations/supabase/client";

interface CarDetailTemplateProps {
  car: Car;
}

const CarDetailTemplate = ({ car }: CarDetailTemplateProps) => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(car?.colors[0]);
  const [selectedInterior, setSelectedInterior] = useState(car?.interiors[0]?.name);
  const [selectedTrim, setSelectedTrim] = useState(car?.trims[0]);
  const [currentImage, setCurrentImage] = useState(car?.image);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: "",
    phone: "",
    contactMethod: "whatsapp"
  });

  const allImages = [
    car.image,
    ...car.colors
      .map(color => color.image_url)
      .filter((url): url is string => url !== undefined && url !== null)
  ];

  useEffect(() => {
    if (selectedColor?.image_url) {
      setCurrentImage(selectedColor.image_url);
      const newIndex = allImages.findIndex(img => img === selectedColor.image_url);
      if (newIndex !== -1) {
        setCurrentImageIndex(newIndex);
      }
    } else {
      setCurrentImage(car.image);
      setCurrentImageIndex(0);
    }
  }, [selectedColor, car.image, allImages]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === allImages.length - 1 ? 0 : prev + 1;
      setCurrentImage(allImages[newIndex]);
      return newIndex;
    });
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === 0 ? allImages.length - 1 : prev - 1;
      setCurrentImage(allImages[newIndex]);
      return newIndex;
    });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: orderForm.name,
          phone: orderForm.phone,
          contact_method: orderForm.contactMethod,
          car_preferences: `${car.name} - ${selectedTrim?.name || 'Base model'}`,
          timing: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      toast({
        title: "Заявка отправлена",
        description: "Мы свяжемся с вами в ближайшее время",
      });
      
      setIsOrderModalOpen(false);
      setOrderForm({
        name: "",
        phone: "",
        contactMethod: "whatsapp"
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      });
    }
  };

  const hasSpecs = (specs: CarSpecs): boolean => {
    if (!specs) return false;
    return Object.values(specs).some(value => value !== undefined && value !== null);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 hover:bg-secondary"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="overflow-hidden bg-gradient-to-b from-gray-50 to-white shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
            <AspectRatio ratio={16 / 9}>
              {currentImage ? (
                <>
                  <img
                    src={currentImage}
                    alt={car.name}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105 cursor-pointer"
                    onClick={() => setIsImageModalOpen(true)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsImageModalOpen(true)}
                  >
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                  {allImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={previousImage}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <CarIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </AspectRatio>
          </Card>

          <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Заказать {car.name}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleOrderSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Ваше имя</Label>
                  <Input
                    id="name"
                    value={orderForm.name}
                    onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Номер телефона</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Способ связи</Label>
                  <RadioGroup
                    value={orderForm.contactMethod}
                    onValueChange={(value) => setOrderForm({ ...orderForm, contactMethod: value })}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="whatsapp" id="whatsapp" />
                      <Label htmlFor="whatsapp" className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="telegram" id="telegram" />
                      <Label htmlFor="telegram" className="flex items-center space-x-2">
                        <Send className="w-4 h-4" />
                        <span>Telegram</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full">
                  Отправить
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-8 pr-4">
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-transparent shadow-lg">
              <h1 className="text-3xl font-bold mb-2 animate-fade-up">{car.name}</h1>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold text-primary animate-fade-up delay-100">
                  {selectedTrim ? selectedTrim.price : car.basePrice}
                </p>
                <Button 
                  onClick={() => setIsOrderModalOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Заказать
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            {hasSpecs(car.specs) && (
              <Card className="p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Базовые характеристики</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(car.specs).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">{key}</p>
                          <p className="font-semibold">{value}</p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Комплектации</h3>
              </div>
              <RadioGroup
                value={selectedTrim?.name}
                onValueChange={(value) => {
                  const trim = car.trims.find((t) => t.name === value);
                  if (trim) setSelectedTrim(trim);
                }}
                className="space-y-4"
              >
                {car.trims.map((trim) => (
                  <div
                    key={trim.name}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-300",
                      selectedTrim?.name === trim.name
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={trim.name} id={trim.name} />
                        <Label htmlFor={trim.name} className="font-medium">{trim.name}</Label>
                      </div>
                      <span className="font-semibold text-primary">{trim.price}</span>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CarDetailTemplate;
