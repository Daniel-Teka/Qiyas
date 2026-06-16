import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';

function App() {
  const [cart, setCart] = useState([]);

  // Add item to cart
  const addToCart = (product) => {
    // Check if item already exists to avoid duplicates
    const exist = cart.find((item) => item.id === product.id);
    if (exist) {
      alert("Item is already in your cart!");
    } else {
      setCart([...cart, product]);
    }
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <Navbar cartCount={cart.length} />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;






// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import ProductDetails from "./pages/ProductDetails";
// import Cart from "./pages/Cart";

// function App() {
//   // Load cart from localStorage first
//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem("cart");
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   // Save cart every time it changes
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = (product) => {
//     const exist = cart.find((item) => item.id === product.id);
//     if (exist) {
//       alert("Item is already in your cart!");
//     } else {
//       setCart([...cart, product]);
//     }
//   };

//   const removeFromCart = (id) => {
//     setCart(cart.filter((item) => item.id !== id));
//   };

//   return (
//     <Router>
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100">
//         <Navbar cartCount={cart.length} />

//         <main className="container mx-auto px-4 py-6">
//           <Routes>
//             <Route path="/" element={<Home addToCart={addToCart} />} />
//             <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
//             <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;