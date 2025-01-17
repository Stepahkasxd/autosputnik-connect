import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { CustomizationStep } from "./steps/CustomizationStep";
import { ImagesStep } from "./steps/ImagesStep";
import { PreviewStep } from "./steps/PreviewStep";

interface AddCarStepsProps {
  isEditing?: boolean;
  initialCarData?: any;
  onEditComplete?: () => void;
}

export const AddCarSteps = ({ isEditing = false, initialCarData, onEditComplete }: AddCarStepsProps) => {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    basePrice: "",
    power: "",
    acceleration: "",
    range: "",
    trims: [{ name: "", price: "", specs: {} }],
  });

  useEffect(() => {
    if (isEditing && initialCarData) {
      setFormData({
        id: initialCarData.id,
        name: initialCarData.name,
        basePrice: initialCarData.base_price,
        specs: initialCarData.specs || {},
        colors: initialCarData.car_colors || [],
        interiors: initialCarData.car_interiors || [],
        trims: initialCarData.car_trims || [],
        image_url: initialCarData.image_url,
      });
      setOpen(true);
    }
  }, [isEditing, initialCarData]);

  const handleStepComplete = (stepData: any) => {
    setFormData((prev: any) => ({ ...prev, ...stepData }));
    setStep(step + 1);
  };

  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setFormData({
      name: "",
      basePrice: "",
      power: "",
      acceleration: "",
      range: "",
      trims: [{ name: "", price: "", specs: {} }],
    });
    if (isEditing && onEditComplete) {
      onEditComplete();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BasicInfoStep onComplete={handleStepComplete} initialData={formData} isEditing={isEditing} />;
      case 2:
        return <CustomizationStep onComplete={handleStepComplete} initialData={formData} isEditing={isEditing} />;
      case 3:
        return <ImagesStep onComplete={handleStepComplete} initialData={formData} isEditing={isEditing} />;
      case 4:
        return <PreviewStep onComplete={handleClose} initialData={formData} isEditing={isEditing} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return isEditing ? "Редактирование основной информации" : "Основная информация";
      case 2:
        return isEditing ? "Редактирование вариантов" : "Настройка вариантов";
      case 3:
        return isEditing ? "Редактирование изображений" : "Добавление изображений";
      case 4:
        return "Предпросмотр";
      default:
        return "";
    }
  };

  if (isEditing) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{getStepTitle()}</DialogTitle>
          </DialogHeader>
          {renderStep()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Добавить автомобиль
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{getStepTitle()}</DialogTitle>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};