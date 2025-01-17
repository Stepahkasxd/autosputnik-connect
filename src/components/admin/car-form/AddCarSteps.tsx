import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { CustomizationStep } from "./steps/CustomizationStep";
import { ImagesStep } from "./steps/ImagesStep";

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
      // Transform the data from the database format to the form format
      setFormData({
        id: initialCarData.id,
        name: initialCarData.name,
        basePrice: initialCarData.base_price,
        specs: initialCarData.specs || {},
        colors: initialCarData.car_colors || [],
        interiors: initialCarData.car_interiors || [],
        trims: initialCarData.car_trims || [],
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
        return <ImagesStep onComplete={handleClose} initialData={formData} isEditing={isEditing} />;
      default:
        return null;
    }
  };

  if (isEditing) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {step === 1 && "Редактирование основной информации"}
              {step === 2 && "Редактирование вариантов"}
              {step === 3 && "Редактирование изображений"}
            </DialogTitle>
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
          <DialogTitle>
            {step === 1 && "Основная информация"}
            {step === 2 && "Настройка вариантов"}
            {step === 3 && "Добавление изображений"}
          </DialogTitle>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};