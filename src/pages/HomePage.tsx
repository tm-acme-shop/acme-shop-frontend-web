import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/products/ProductCard';
import { logger } from '../logging/logger';

export function HomePage() {
  useEffect(() => {
    logger.info('Page view', { page: 'home' });
  }, []);

  const { products, loading } = useFeaturedProducts();

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to AcmeShop</h1>
        <p>Your one-stop shop for everything you need.</p>
        <Link to="/products" className="cta-button">
          Shop Now
        </Link>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        {loading ? (
          <p>Loading featured products...</p>
        ) : (
          <div className="product-grid">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <Link to="/products" className="view-all">
          View All Products
        </Link>
      </section>

      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          <Link to="/products?category=electronics" className="category-card">
            Electronics
          </Link>
          <Link to="/products?category=clothing" className="category-card">
            Clothing
          </Link>
          <Link to="/products?category=home" className="category-card">
            Home & Garden
          </Link>
          <Link to="/products?category=sports" className="category-card">
            Sports
          </Link>
        </div>
      </section>
    </div>
  );
}
