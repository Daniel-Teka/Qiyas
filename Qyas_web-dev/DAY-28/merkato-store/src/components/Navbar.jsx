import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cart } = useCart();

  return (
    <header className="navbar">
      <h1>Merkato Store</h1>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/cart">Cart</Link>
      </nav>

      <div className="cart">
        🛒 {cart.length}
      </div>
    </header>
  );
}

export default Navbar;