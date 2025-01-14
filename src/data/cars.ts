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
  drive?: string;
  range?: string;
  acceleration: string;
  power: string;
  batteryCapacity?: string;
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
  {
    id: "zeekr-009",
    name: "Zeekr 009",
    basePrice: "от 7 290 000 ₽",
    image: "/placeholder.svg",
    colors: [
      { name: "Черный", code: "#000000" },
      { name: "Оливковый", code: "#556B2F" },
      { name: "Серый", code: "#8E9196" },
      { name: "Белый", code: "#FFFFFF" },
    ],
    interiors: [
      { name: "Белый" },
      { name: "Черный" },
      { name: "Черно-белый" },
    ],
    trims: [
      { name: "ZEEKR YOU (4-местный)", price: "7 290 000 ₽" },
      { name: "ZEEKR YOU (5-местный)", price: "7 490 000 ₽" },
      { name: "ZEEKR ME", price: "7 990 000 ₽" },
    ],
    specs: {
      drive: "Полный привод 4WD",
      range: "700 км",
      acceleration: "4,5 с до 100 км/ч",
      power: "400 кВт",
    },
  },
  {
    id: "lixiang-l6",
    name: "Lixiang L6",
    basePrice: "от 4 990 000 ₽",
    image: "/placeholder.svg",
    colors: [
      { name: "Бежевый", code: "#E8DCC4" },
      { name: "Серый", code: "#808080" },
      { name: "Черный", code: "#000000" },
    ],
    interiors: [
      { name: "Белый" },
      { name: "Черный" },
    ],
    trims: [
      { name: "L6 PRO", price: "4 990 000 ₽" },
      { name: "L6 MAX", price: "5 490 000 ₽" },
    ],
    specs: {
      acceleration: "6,5 с до 100 км/ч",
      power: "408 л.с.",
      batteryCapacity: "52,3 кВт⋅ч",
    },
  },
  {
    id: "lixiang-l7",
    name: "Lixiang L7",
    basePrice: "от 5 290 000 ₽",
    image: "/placeholder.svg",
    colors: [
      { name: "Черный", code: "#000000" },
      { name: "Белый", code: "#FFFFFF" },
      { name: "Серый", code: "#808080" },
      { name: "Серебристый", code: "#C0C0C0" },
    ],
    interiors: [
      { name: "Кожа черная" },
      { name: "Кожа бежевая" },
      { name: "Серо-белая" },
    ],
    trims: [
      { name: "L7 Air", price: "5 290 000 ₽" },
      { name: "L7 Pro", price: "5 790 000 ₽" },
      { name: "L7 Max", price: "6 290 000 ₽" },
    ],
    specs: {
      dimensions: "5050 мм",
      wheelbase: "3100 мм",
      power: "449 л.с.",
    },
  },
];