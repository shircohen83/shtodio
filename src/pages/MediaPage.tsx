
import { useState } from "react";

import {
  zumba1, zumba2, zumba3, zumba4, zumba5, zumba6,
  kickboxing1, kickboxing2, kickboxing3,
  fitness1, fitness2, fitness3,
} from "../assets/images";

import "./MediaPage.css";

type GalleryImage = {
  id: number;
  src: string;
  category: "zumba" | "kickboxing" | "fitness";
  alt: string;
};

const images: GalleryImage[] = [
  { id: 1, src: zumba1, category: "zumba", alt: "ילדות בחוג זומבה" },
  { id: 2, src: kickboxing1, category: "kickboxing", alt: "ילד מתאמן בקיקבוקס" },
  { id: 3, src: fitness1, category: "fitness", alt: "ילדים במסלול מכשולים" },
  { id: 4, src: zumba2, category: "zumba", alt: "ילדות רוקדות יחד" },
  { id: 5, src: fitness2, category: "fitness", alt: "תחנות כושר לילדים" },
  { id: 6, src: zumba5, category: "zumba", alt: "חוג זומבה לילדות" },
  { id: 7, src: kickboxing2, category: "kickboxing", alt: "אימון שק אגרוף" },
  { id: 8, src: zumba3, category: "zumba", alt: "פעילות זומבה לילדים" },
  { id: 9, src: kickboxing3, category: "kickboxing", alt: "תרגול קיקבוקס" },
  { id: 10, src: zumba4, category: "zumba", alt: "ילדות רוקדות בסטודיו" },
  { id: 11, src: fitness3, category: "fitness", alt: "פעילות ספורטיבית קבוצתית" },
  { id: 12, src: zumba6, category: "zumba", alt: "ריקוד קבוצתי" },
];

const filters = [
  { label: "הכל", value: "all" },
  { label: "זומבה", value: "zumba" },
  { label: "קיקבוקס", value: "kickboxing" },
  { label: "כושר כללי", value: "fitness" },
];

const MediaPage = () => {
  const [category, setCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages =
    category === "all"
      ? images
      : images.filter((image) => image.category === category);

  return (
    <main className="media-page">
      <h1>רגעים מהסטודיו</h1>

      <div className="media-filters">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            className={category === item.value ? "selected" : ""}
            onClick={() => setCategory(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="media-gallery">
        {filteredImages.map((image) => (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            onClick={() => setSelectedImage(image.src)}
          />
        ))}
      </div>

      {selectedImage && (
        <div
          className="media-lightbox"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            aria-label="סגירת התמונה"
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="תמונה מוגדלת מהסטודיו"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
};

export default MediaPage;
