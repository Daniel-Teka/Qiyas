import React from 'react';
import { Link } from 'react-router-dom';

function Cart({ cart, removeFromCart }) {
  // Calculate total checkout price
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 font-medium text-sm border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="bg-white rounded-xl shadow p-6 mt-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Amount:</p>
              <p className="text-2xl font-extrabold text-gray-900">${total.toFixed(2)}</p>
            </div>
            <button 
              onClick={() => alert("Checkout successful! (Simulation)")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition shadow"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;