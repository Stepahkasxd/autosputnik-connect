export interface CarColor {
  name: string;
  code: string;
}

export interface CarInterior {
  name: string;
}

export interface CarTrim {
  name: string;
  price: string;
}

export interface CarSpecs {
  drive: string;
  range?: string;
  acceleration: string;
  power: string;
  additionalFeatures?: string[];
}

export interface Car {
  id: string;
  name: string;
  basePrice: string;
  image: string;
  colors: CarColor[];
  interiors: CarInterior[];
  trims: CarTrim[];
  specs: CarSpecs;
}

export const cars: Car[] = [
  {
    id: "zeekr-001",
    name: "Zeekr 001",
    basePrice: "от 5 990 000 ₽",
    image: "/placeholder.svg",
    colors: [
      { name: "Yu Guang Orange", code: "#FF6B35" },
      { name: "Extreme Blue", code: "#004E98" },
      { name: "Electric Blue", code: "#3A86FF" },
      { name: "Polar Night Black", code: "#1A1A1A" },
      { name: "Laser Gray", code: "#6C757D" },
      { name: "Extreme Daylight", code: "#F8F9FA" },
    ],
    interiors: [
      { name: "Оранжево-серая алькантара" },
      { name: "Светлый кожаный салон" },
    ],
    trims: [
      { name: "ZEEKR YOU", price: "5 990 000 ₽" },
      { name: "ZEEKR ME", price: "6 290 000 ₽" },
      { name: "ZEEKR WE", price: "6 590 000 ₽" },
    ],
    specs: {
      drive: "Полный привод 4WD",
      range: "656 км",
      acceleration: "3,8 с до 100 км/ч",
      power: "400 кВт",
      additionalFeatures: ["21\" Air Vortex диски"],
    },
  },
  {
    id: "zeekr-007",
    name: "Zeekr 007",
    basePrice: "от 6 290 000 ₽",
    image: "/placeholder.svg",
    colors: [
      { name: "Bright Moon White", code: "#FFFFFF" },
      { name: "Cloud Silver", code: "#C0C0C0" },
      { name: "Clear Sky Blue", code: "#87CEEB" },
      { name: "Nardo Grey", code: "#787C7E" },
      { name: "Extreme Night Black", code: "#000000" },
      { name: "Dawn Brown", code: "#8B4513" },
    ],
    interiors: [
      { name: "Черный" },
      { name: "Черно-белый" },
    ],
    trims: [
      { name: "ZEEKR Rear-Wheel Version", price: "6 290 000 ₽" },
      { name: "ZEEKR Four-Wheel Version", price: "6 790 000 ₽" },
    ],
    specs: {
      drive: "Задний привод 2WD / Полный привод 4WD",
      range: "688 км",
      acceleration: "5,6 с до 100 км/ч",
      power: "310 кВт",
      additionalFeatures: ["19\" многоспицевые диски"],
    },
  },
];