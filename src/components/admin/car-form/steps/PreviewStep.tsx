import { CarCard } from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarSpecs } from "@/components/cars/CarSpecs";

interface PreviewStepProps {
  onComplete: (data: any, shouldClose?: boolean) => void;
  initialData: any;
  isEditing?: boolean;
}

export const PreviewStep = ({ onComplete, initialData, isEditing }: PreviewStepProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(initialData, false); // Pass false to indicate not to close
  };

  const handleClose = () => {
    onComplete(null, true); // Pass true to indicate should close
  };

  // Prepare data for preview
  const previewData = {
    id: initialData.id || "preview",
    name: initialData.name,
    price: initialData.basePrice,
    image: initialData?.image_url,
    specs: initialData.specs || {},
    trims: initialData.trims?.map((trim: any) => ({
      name: trim.name,
      price: trim.price,
      specs: trim.specs,
    })) || [],
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ScrollArea className="h-[500px] pr-4">
        <Tabs defaultValue="card">
          <TabsList className="mb-4">
            <TabsTrigger value="card">Карточка</TabsTrigger>
            <TabsTrigger value="details">Подробная информация</TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="mt-0">
            <div className="max-w-sm mx-auto">
              <CarCard {...previewData} />
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-0">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{previewData.name}</h2>
                <p className="text-xl font-semibold text-primary">
                  {previewData.price}
                </p>
              </div>

              <CarSpecs specs={previewData.specs} />

              {previewData.trims.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Комплектации</h3>
                  <div className="grid gap-4">
                    {previewData.trims.map((trim: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{trim.name}</h4>
                          <span className="font-semibold text-primary">
                            {trim.price}
                          </span>
                        </div>
                        <CarSpecs specs={trim.specs} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1">
          {isEditing ? "Сохранить изменения" : "Сохранить"}
        </Button>
        <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
          Закрыть
        </Button>
      </div>
    </form>
  );
};