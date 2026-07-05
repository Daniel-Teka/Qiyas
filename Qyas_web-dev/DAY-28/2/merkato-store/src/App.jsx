import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './views/Home/Home';
import Products from './views/Products/Products';
import Contact from './views/Contact/Contact';

function App() {
  const [currentView, setCurrentView] = useState('home'); // Options: 'home', 'products', 'contact'
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className="app-container">
      <Navbar cartCount={cart.length} setView={setCurrentView} currentView={currentView} />
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        {currentView === 'home' && <Home setView={setCurrentView} />}
        {currentView === 'products' && <Products addToCart={addToCart} />}
        {currentView === 'contact' && <Contact />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
