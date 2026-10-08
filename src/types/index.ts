export type Client = {
  id: string;
  username: string;
  parentName: string;
};

export type Lesson = {
  id: number;
  lessonType: "zumba" | "kickboxing" | "general-sport";
  title: string;
  description: string;
  day: number;
  startHour: number;
  duration: number;
};

export type Registration = {
  id: number;
  clientId: string;
  lessonId: number;
  createdAt: string;
  lesson: Lesson;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  color: string;
  stock: number;
};