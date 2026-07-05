import { mockProducts } from '../../data/mockProducts';
import ProductCard from '../../components/ProductCard';

export default function Products({ addToCart }) {
  return (
      <div className="grid">
            {mockProducts.map(p => (
                    <ProductCard key={p.id} product={p} addToCart={addToCart} />
                          ))}
                              </div>
                                );
                                }