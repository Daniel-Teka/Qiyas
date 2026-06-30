import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

function Home() {
  return (
    <>
      <Hero />

      <section className="featured">
        <h2>Featured Products</h2>

        <div className="products">
          <ProductCard name="Smartphone" price={350} />
          <ProductCard name="Shoes" price={80} />
          <ProductCard name="Coffee" price={15} />
        </div>
      </section>
    </>
  );
}

export default Home;