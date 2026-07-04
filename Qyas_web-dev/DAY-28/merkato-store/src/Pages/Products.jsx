import ProductCard from "../components/ProductCard";

function Products() {
  return (
    <section className="featured">
      <h2>All Products</h2>

      <div className="products">
        <ProductCard
          name="Laptop"
          price={900}
          image="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600"
        />

        <ProductCard
          name="Headphones"
          price={120}
          image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
        />

        <ProductCard
          name="Phone"
          price={500}
          image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
        />

        <ProductCard
          name="Shoes"
          price={80}
          image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
        />
      </div>
    </section>
  );
}

export default Products;