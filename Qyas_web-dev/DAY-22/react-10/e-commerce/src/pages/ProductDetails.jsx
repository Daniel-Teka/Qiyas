import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data';

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  
  // Find the product matching the ID from URL route parameter
  const product = PRODUCTS.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Product not found!</h2>
        <Link to="/" className="text-blue-600 underline mt-4 inline-block">Return Home</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="text-blue-600 hover:underline inline-block mb-6">← Back to Products</Link>
      <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded-lg" />
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-2">{product.name}</h1>
          <p className="text-2xl text-blue-600 font-bold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          <button 
            onClick={() => addToCart(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition max-w-xs"
          >
            Add to Shopping Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;