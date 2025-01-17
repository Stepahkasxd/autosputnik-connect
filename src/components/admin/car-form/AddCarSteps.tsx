import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, AlertTriangle } from "lucide-react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { CustomizationStep } from "./steps/CustomizationStep";
import { ImagesStep } from "./steps/ImagesStep";
import { PreviewStep } from "./steps/PreviewStep";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddCarStepsProps {
  isEditing?: boolean;
  initialCarData?: any;
  onEditComplete?: () => void;
}

const DRAFT_KEY = 'car_form_draft';

export const AddCarSteps = ({ isEditing = false, initialCarData, onEditComplete }: AddCarStepsProps) => {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    basePrice: "",
    power: "",
    acceleration: "",
    range: "",
    trims: [{ name: "", price: "", specs: {} }],
  });

  // Load draft on initial mount
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
    } else {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        setHasDraft(true);
        setFormData(draftData.formData);
        setStep(draftData.step);
      }
    }
  }, [isEditing, initialCarData]);

  const handleStepComplete = (stepData: any, shouldClose?: boolean) => {
    if (stepData === null) {
      // If PreviewStep was closed without saving
      handleClose();
      return;
    }
    
    const newFormData = { ...formData, ...stepData };
    setFormData(newFormData);
    
    // Save progress to localStorage
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      step: step + 1,
      formData: newFormData,
    }));
    
    if (shouldClose) {
      handleClose();
    } else if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStep(1);
    // Clear draft when form is completed
    localStorage.removeItem(DRAFT_KEY);
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

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setFormData({
      name: "",
      basePrice: "",
      power: "",
      acceleration: "",
      range: "",
      trims: [{ name: "", price: "", specs: {} }],
    });
    setStep(1);
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
        return <PreviewStep onComplete={handleStepComplete} initialData={formData} isEditing={isEditing} />;
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
          {hasDraft && step === 1 && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                У вас есть несохраненный черновик. Хотите продолжить с последнего сохраненного места?
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearDraft}>
                    Начать заново
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};