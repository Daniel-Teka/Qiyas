import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className="featured">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty 🛒</p>
      ) : (
        <>
          <div className="products">
            {cart.map((item, index) => (
              <div className="card" key={index}>
                <h3>{item.name}</h3>
                <p>${item.price}</p>

                <button onClick={() => removeFromCart(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: "20px" }}>
            Total: ${total}
          </h3>
        </>
      )}
    </section>
  );
}

export default Cart;