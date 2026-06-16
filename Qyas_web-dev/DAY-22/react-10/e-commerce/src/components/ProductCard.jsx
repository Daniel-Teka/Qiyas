import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ product, addToCart }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-xs mx-auto flex flex-col hover:shadow-xl transition">

      {/* IMAGE FIX */}
      <div className="w-full h-40 bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover block"
        />
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col flex-grow">

        <h3 className="text-base font-semibold text-gray-800 truncate">
          {product.name}
        </h3>

        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
          {product.description}
        </p>

        <p className="text-blue-600 font-bold text-lg mt-2">
          ${product.price.toFixed(2)}
        </p>

        {/* BUTTONS */}
        <div className="flex gap-2 mt-auto pt-3">

          <Link
            to={`/product/${product.id}`}
            className="w-1/2 text-center bg-gray-100 hover:bg-gray-200 text-xs py-2 rounded-lg"
          >
            View
          </Link>

          <button
            onClick={() => addToCart(product)}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-lg"
          >
            Add
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductCard;