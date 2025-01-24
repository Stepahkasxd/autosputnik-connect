import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BasicInfoStepProps {
  onComplete: (data: any) => void;
  initialData: any;
  isEditing?: boolean;
}

export const BasicInfoStep = ({ onComplete, initialData, isEditing }: BasicInfoStepProps) => {
  const [name, setName] = useState(initialData.name || "");
  const [basePrice, setBasePrice] = useState(initialData.basePrice || initialData.base_price || "");
  const [baseSpecs, setBaseSpecs] = useState<Record<string, string>>(initialData.specs || {});
  const [trims, setTrims] = useState(
    initialData.trims?.length > 0
      ? initialData.trims.map((trim: any) => ({
          name: trim.name || "",
          price: trim.price || "",
          specs: trim.specs || {},
        }))
      : [{ name: "", price: "", specs: {} as Record<string, string> }]
  );

  useEffect(() => {
    if (isEditing && initialData) {
      setName(initialData.name || "");
      setBasePrice(initialData.basePrice || initialData.base_price || "");
      setBaseSpecs(initialData.specs || {});
      setTrims(
        initialData.trims?.length > 0
          ? initialData.trims.map((trim: any) => ({
              name: trim.name || "",
              price: trim.price || "",
              specs: trim.specs || {},
            }))
          : [{ name: "", price: "", specs: {} as Record<string, string> }]
      );
    }
  }, [isEditing, initialData]);

  const availableSpecs = [
    "Мощность",
    "Разгон до 100 км/ч",
    "Запас хода",
    "Максимальная скорость",
    "Тип привода",
    "Емкость батареи",
    "Время зарядки",
    "Клиренс",
    "Колесная база",
    "Масса",
    "Тип кузова",
  ];

  const addTrim = () => {
    setTrims([...trims, { name: "", price: "", specs: {} }]);
  };

  const removeTrim = (index: number) => {
    setTrims(trims.filter((_, i) => i !== index));
  };

  const updateTrim = (index: number, field: string, value: string) => {
    const newTrims = [...trims];
    newTrims[index] = { ...newTrims[index], [field]: value };
    setTrims(newTrims);
  };

  const addBaseSpec = () => {
    const availableSpecsForBase = availableSpecs.filter(
      (spec) => !Object.keys(baseSpecs).includes(spec)
    );
    
    if (availableSpecsForBase.length > 0) {
      const newSpec = availableSpecsForBase[0];
      setBaseSpecs({
        ...baseSpecs,
        [newSpec]: "",
      });
    }
  };

  const removeBaseSpec = (specKey: string) => {
    const { [specKey]: _, ...remainingSpecs } = baseSpecs;
    setBaseSpecs(remainingSpecs);
  };

  const updateBaseSpec = (specKey: string, value: string) => {
    setBaseSpecs({
      ...baseSpecs,
      [specKey]: value,
    });
  };

  const addSpecToTrim = (trimIndex: number) => {
    const newTrims = [...trims];
    const currentSpecs = newTrims[trimIndex].specs;
    const availableSpecsForTrim = availableSpecs.filter(
      (spec) => !Object.keys(currentSpecs).includes(spec)
    );
    
    if (availableSpecsForTrim.length > 0) {
      const newSpec = availableSpecsForTrim[0];
      newTrims[trimIndex].specs = {
        ...currentSpecs,
        [newSpec]: "",
      };
      setTrims(newTrims);
    }
  };

  const removeSpecFromTrim = (trimIndex: number, specKey: string) => {
    const newTrims = [...trims];
    const { [specKey]: _, ...remainingSpecs } = newTrims[trimIndex].specs;
    newTrims[trimIndex].specs = remainingSpecs;
    setTrims(newTrims);
  };

  const updateTrimSpec = (trimIndex: number, specKey: string, value: string) => {
    const newTrims = [...trims];
    newTrims[trimIndex].specs = {
      ...newTrims[trimIndex].specs,
      [specKey]: value,
    };
    setTrims(newTrims);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = trims.every(trim => 
      trim.name && 
      trim.price && 
      Object.entries(trim.specs).every(([_, value]) => value)
    );

    if (!isValid) {
      alert("Пожалуйста, заполните все поля комплектаций");
      return;
    }

    onComplete({
      name,
      basePrice,
      specs: baseSpecs,
      trims,
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <form onSubmit={handleSubmit} className="space-y-6 pr-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Название модели</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Например: Zeekr 001"
            />
          </div>

          <div>
            <Label htmlFor="basePrice">Базовая цена</Label>
            <Input
              id="basePrice"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
              placeholder="Например: от 5 990 000 ₽"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Базовые характеристики</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBaseSpec}
                disabled={Object.keys(baseSpecs).length === availableSpecs.length}
              >
                <Plus className="w-4 h-4 mr-1" /> Добавить характеристику
              </Button>
            </div>

            {Object.entries(baseSpecs).map(([specKey, specValue]) => (
              <div key={specKey} className="flex gap-2 items-start">
                <Select
                  value={specKey}
                  onValueChange={(newValue) => {
                    if (newValue !== specKey) {
                      const oldValue = baseSpecs[specKey];
                      const updatedSpecs = { ...baseSpecs };
                      delete updatedSpecs[specKey];
                      updatedSpecs[newValue] = oldValue;
                      setBaseSpecs(updatedSpecs);
                    }
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Выберите характеристику" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSpecs
                      .filter(spec => spec === specKey || !Object.keys(baseSpecs).includes(spec))
                      .map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Input
                  value={specValue}
                  onChange={(e) => updateBaseSpec(specKey, e.target.value)}
                  placeholder="Значение"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBaseSpec(specKey)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Label>Комплектации</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTrim}>
                <Plus className="w-4 h-4 mr-1" /> Добавить комплектацию
              </Button>
            </div>

            {trims.map((trim, trimIndex) => (
              <div key={trimIndex} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <Label>Название комплектации</Label>
                    <Input
                      value={trim.name}
                      onChange={(e) => updateTrim(trimIndex, "name", e.target.value)}
                      placeholder="Например: Base"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Цена комплектации</Label>
                    <Input
                      value={trim.price}
                      onChange={(e) => updateTrim(trimIndex, "price", e.target.value)}
                      placeholder="Например: 5 990 000 ₽"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTrim(trimIndex)}
                    className="mt-6"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Характеристики комплектации</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSpecToTrim(trimIndex)}
                      disabled={Object.keys(trim.specs).length === availableSpecs.length}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Добавить характеристику
                    </Button>
                  </div>

                  {Object.entries(trim.specs).map(([specKey, specValue]) => (
                    <div key={specKey} className="flex gap-2 items-start">
                      <Select
                        value={specKey}
                        onValueChange={(newValue) => {
                          if (newValue !== specKey) {
                            const oldValue = trim.specs[specKey];
                            const updatedSpecs = { ...trim.specs };
                            delete updatedSpecs[specKey];
                            updatedSpecs[newValue] = oldValue;
                            const newTrims = [...trims];
                            newTrims[trimIndex].specs = updatedSpecs;
                            setTrims(newTrims);
                          }
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Выберите характеристику" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSpecs
                            .filter(spec => spec === specKey || !Object.keys(trim.specs).includes(spec))
                            .map((spec) => (
                              <SelectItem key={spec} value={spec}>
                                {spec}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={specValue}
                        onChange={(e) => updateTrimSpec(trimIndex, specKey, e.target.value)}
                        placeholder="Значение"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSpecFromTrim(trimIndex, specKey)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Далее
        </Button>
      </form>
    </ScrollArea>
  );
};
