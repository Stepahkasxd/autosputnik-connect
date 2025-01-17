import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { CustomizationStep } from "./steps/CustomizationStep";
import { ImagesStep } from "./steps/ImagesStep";

export const AddCarSteps = () => {
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
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BasicInfoStep onComplete={handleStepComplete} initialData={formData} />;
      case 2:
        return <CustomizationStep onComplete={handleStepComplete} initialData={formData} />;
      case 3:
        return <ImagesStep onComplete={handleClose} initialData={formData} />;
      default:
        return null;
    }
  };

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