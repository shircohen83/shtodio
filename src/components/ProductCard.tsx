import { useState } from "react";
import { Link } from "react-router";

import {
  bottleBrand1,
  bottleBrand2,
  bottleBrand3,
  shirtBrand1,
  shirtBrand2,
  shirtBrand3,
  towelBrand1,
  towelBrand2,
  towelBrand3,
} from "../assets/images/index";

import type { Product } from "../types";

import "./ProductCard.css";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const images =
    product.name === "face towel"
      ? [towelBrand1, towelBrand2, towelBrand3]
      : product.name === "bottle"
        ? [bottleBrand1, bottleBrand2, bottleBrand3]
        : [shirtBrand1, shirtBrand2, shirtBrand3];

  const [imageIndex, setImageIndex] = useState(0);

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

  return (
    <article className="product-card">
      <div className="product-image-container">
        <button
          type="button"
          className="product-image-button previous"
          onClick={previousImage}
        >
          ‹
        </button>

        <Link to={`/shop/${product.id}`}>
          <img
            src={images[imageIndex]}
            alt={product.name}
          />
        </Link>

        <button
          type="button"
          className="product-image-button next"
          onClick={nextImage}
        >
          ›
        </button>
      </div>

      <Link
        to={`/shop/${product.id}`}
        className="product-info"
      >
        <h2>{product.name}</h2>
        <p>{product.price} ₪</p>
      </Link>
    </article>
  );
};

export default ProductCard;