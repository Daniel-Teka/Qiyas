import React from 'react';

function Navbar({ cartCount, setView, currentView }) {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#232f3e', color: 'white' }}>
      <h2>Merkato Store</h2>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: currentView === 'home' ? '#ff9900' : 'white', cursor: 'pointer' }}>Home</button>
        <button onClick={() => setView('products')} style={{ background: 'none', border: 'none', color: currentView === 'products' ? '#ff9900' : 'white', cursor: 'pointer' }}>Products</button>
        <button onClick={() => setView('contact')} style={{ background: 'none', border: 'none', color: currentView === 'contact' ? '#ff9900' : 'white', cursor: 'pointer' }}>Contact Us</button>
        <span style={{ background: '#ff9900', padding: '5px 10px', borderRadius: '4px', color: 'black', fontWeight: 'bold' }}>
          🛒 Cart: {cartCount}
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
