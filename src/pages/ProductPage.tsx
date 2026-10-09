import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import angleRightIcon from "../assets/icons/angle-right.svg";

import { bottleBlack1, bottleBlack2, bottleBlack3, bottleBrand1, bottleBrand2, bottleBrand3, bottleWhite1, bottleWhite2, bottleWhite3, shirtBlack1, shirtBlack2, shirtBlack3, shirtBrand1, shirtBrand2, shirtBrand3, shirtWhite1, shirtWhite2, shirtWhite3, towelBlack1, towelBlack2, towelBlack3, towelBrand1, towelBrand2, towelBrand3, towelWhite1, towelWhite2, towelWhite3 } from "../assets/images/index";

import type { Product } from "../types";

import "./ProductPage.css";

const productImages: Record<string, string[]> = {
  "face towel-white": [towelWhite1, towelWhite2, towelWhite3],
  "face towel-black": [towelBlack1, towelBlack2, towelBlack3],
  "face towel-mixed": [towelBrand1, towelBrand2, towelBrand3],

  "bottle-white": [bottleWhite1, bottleWhite2, bottleWhite3],
  "bottle-black": [bottleBlack1, bottleBlack2, bottleBlack3],
  "bottle-mixed": [bottleBrand1, bottleBrand2, bottleBrand3],

  "t-shirt-white": [shirtWhite1, shirtWhite2, shirtWhite3],
  "t-shirt-black": [shirtBlack1, shirtBlack2, shirtBlack3],
  "t-shirt-mixed": [shirtBrand1, shirtBrand2, shirtBrand3],
};

const productDetails = {
  "face towel": {
    subtitle: "מגבת פנים וספורט",
    description:
      "מגבת קומפקטית ורכה שתוכננה במיוחד לאימוני ילדים. הבד הסופג עוזר לנגב זיעה במהירות, והיא קלה לנשיאה בתיק האימון.",
    material: "80% פוליאסטר, 20% פוליאמיד",
    madeIn: "פורטוגל",
    benefits: [
      "ספיגה גבוהה של זיעה",
      "מתייבשת במהירות",
      "רכה ונעימה למגע",
      "קלה ומתאימה לתיק ספורט",
    ],
  },
  bottle: {
    subtitle: "בקבוק שתייה לספורט",
    description:
      "בקבוק רב־שימושי שנועד ללוות את הילדים לאורך האימון. המבנה הקל והפייה הנוחה מאפשרים שתייה קלה ומהירה במהלך הפעילות.",
    material: "Tritan ללא BPA",
    madeIn: "גרמניה",
    benefits: [
      "נפח של 600 מ״ל",
      "קל ונוח לאחיזה",
      "פייה נוחה לשתייה",
      "מתאים לשימוש יומיומי",
    ],
  },
  "t-shirt": {
    subtitle: "חולצת ספורט לילדים",
    description:
      "חולצת אימון קלילה ונושמת שמאפשרת תנועה חופשית ונוחה לאורך כל הפעילות. הגזרה תוכננה במיוחד לפעילות ספורטיבית.",
    material: "100% פוליאסטר ממוחזר",
    madeIn: "פורטוגל",
    benefits: [
      "בד נושם",
      "מתייבשת במהירות",
      "מאפשרת תנועה חופשית",
      "נעימה גם באימון ארוך",
    ],
  },
};

const ProductPage = () => {
  const { productId } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct]= useState<Product | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");

        if (!response.ok) {
          throw new Error("Failed to get products");
        }

        const productsData: Product[] = await response.json();

        setProducts(productsData);

        const currentProduct = productsData.find(
          (product) => product.id === Number(productId)
        );

        setSelectedProduct(currentProduct ?? null);
      } catch (error) {
        console.error("Failed to get products:", error);
      }
    };

    getProducts();
  }, [productId]);

  if (!selectedProduct) {
    return <p>טוען...</p>;
  }

  const images =
    productImages[
      `${selectedProduct.name}-${selectedProduct.color}`
    ];

  const details =
    productDetails[
      selectedProduct.name as keyof typeof productDetails
    ];

  const nextImage = () => {
    setImageIndex((currentIndex) =>
      currentIndex === images.length - 1
        ? 0
        : currentIndex + 1
    );
  };

  const previousImage = () => {
    setImageIndex((currentIndex) =>
      currentIndex === 0
        ? images.length - 1
        : currentIndex - 1
    );
  };

  const changeColor = (color: string) => {
    const product = products.find(
      (item) =>
        item.name === selectedProduct.name &&
        item.color === color
    );

    if (!product) {
      return;
    }

    setSelectedProduct(product);
    setImageIndex(0);
  };

  return (
    <main className="product-page">
      <Link
        to="/shop"
        className="back-icon"
        title="חזרה"
      >
        <img src={angleRightIcon} alt="arrow to the right" />
      </Link>

      <div className="product-page-content">
        <section className="product-gallery">
          <div className="product-main-image">
            <button
              type="button"
              className="product-page-image-button previous"
              onClick={previousImage}
            >
              ‹
            </button>

            <img
              src={images[imageIndex]}
              alt={selectedProduct.name}
            />

            <button
              type="button"
              className="product-page-image-button next"
              onClick={nextImage}
            >
              ›
            </button>
          </div>

          <div className="product-thumbnails">
            {images.map((image, index) => (
              <button
                type="button"
                className={`product-thumbnail ${
                  imageIndex === index ? "selected" : ""
                }`}
                onClick={() => setImageIndex(index)}
                key={image}
              >
                <img
                  src={image}
                  alt={`${selectedProduct.name} ${index + 1}`}
                />
              </button>
            ))}
          </div>

          <div className="product-colors-section">
            <h2>צבע</h2>

            <div className="product-colors">
              <button
                type="button"
                className={`product-color white ${
                  selectedProduct.color === "white"
                    ? "selected"
                    : ""
                }`}
                onClick={() => changeColor("white")}
                aria-label="לבן"
              />

              <button
                type="button"
                className={`product-color black ${
                  selectedProduct.color === "black"
                    ? "selected"
                    : ""
                }`}
                onClick={() => changeColor("black")}
                aria-label="שחור"
              />

              <button
                type="button"
                className={`product-color mixed ${
                  selectedProduct.color === "mixed"
                    ? "selected"
                    : ""
                }`}
                onClick={() => changeColor("mixed")}
                aria-label="מעורב"
              />
            </div>
          </div>
        </section>

        <section className="product-details">
          <p className="product-category">{details.subtitle}</p>

          <h1>{selectedProduct.name}</h1>

          <p className="product-description">
            {details.description}
          </p>

          <div className="product-specifications">
            <div>
              <span>הרכב</span>
              <strong>{details.material}</strong>
            </div>

            <div>
              <span>ארץ ייצור</span>
              <strong>{details.madeIn}</strong>
            </div>
          </div>

          <div className="product-benefits">
            <h2>למה תאהבו אותו?</h2>

            <ul>
              {details.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="product-purchase">
            <span className="product-price">
              {selectedProduct.price} ₪
            </span>

            <button
              type="button"
              className="add-to-cart-button"
            >
              הוספה לסל
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductPage;