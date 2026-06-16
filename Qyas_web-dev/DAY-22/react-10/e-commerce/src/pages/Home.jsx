import React, { useState } from "react";
import { PRODUCTS } from "../data";
import ProductCard from "../components/ProductCard";

function Home({ addToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Get unique categories
  const categories = ["All", ...new Set(PRODUCTS.map(p => p.category))];

  // Filter products
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchSearch =
      product.name.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "All" || product.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <div>

      {/* HEADER */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Our Products</h1>
        <p className="text-gray-500">Search and filter products easily</p>
      </header>

      {/* SEARCH + FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Category Select */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 p-3 border rounded-xl shadow-sm focus:outline-none"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products found 😢
          </p>
        )}
      </div>

    </div>
  );
}

export default Home;