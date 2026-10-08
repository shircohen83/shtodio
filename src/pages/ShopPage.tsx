import { useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";

import type { Product } from "../types";

import "./ShopPage.css";

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");

        if (!response.ok) {
          throw new Error("Failed to get products");
        }

        const productsData: Product[] = await response.json();

        setProducts(productsData);
      } catch (error) {
        console.error("Failed to get products:", error);
      }
    };

    getProducts();
  }, []);

  const mixedProducts = products.filter(
    (product) => product.color === "mixed"
  );

  return (
    <main className="shop-page">
      <h1>חנות</h1>

      <div className="products-container">
        {mixedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </main>
  );
};

export default ShopPage;