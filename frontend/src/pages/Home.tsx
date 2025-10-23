import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../api/axiosInstance";
import type { Product } from "../types/Product";
import "../css/Home.css";

// ... your existing sampleSlides and trending data ...

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<{
    latest: Product[];
    new_arrival: Product[];
    trending: Product[];
    sale: Product[];
    seasonal: Product[];
  }>({
    latest: [],
    new_arrival: [],
    trending: [],
    sale: [],
    seasonal: []
  });

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const types = ['latest', 'new_arrival', 'trending', 'sale', 'seasonal'];
        const promises = types.map(type => 
          axiosInstance.get(`/products/featured/products?type=${type}&limit=6`)
        );
        
        const results = await Promise.all(promises);
        const featuredData = {
          latest: results[0].data,
          new_arrival: results[1].data,
          trending: results[2].data,
          sale: results[3].data,
          seasonal: results[4].data
        };
        
        setFeaturedProducts(featuredData);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="home-container">
      {/* Your existing hero section */}
      <header className="container-fluid pt-5 position-relative">
        {/* ... your existing hero carousel code ... */}
      </header>

      {/* 🆕 FEATURED PRODUCTS SECTIONS */}
      
      {/* Latest Products - Horizontal Scroll */}
      {featuredProducts.latest.length > 0 && (
        <FeaturedSection 
          title="Latest Collection"
          subtitle="Fresh from our designers"
          products={featuredProducts.latest}
          type="latest"
          layout="scroll"
        />
      )}

      {/* New Arrivals - Grid Layout */}
      {featuredProducts.new_arrival.length > 0 && (
        <FeaturedSection 
          title="New Arrivals"
          subtitle="Just launched products"
          products={featuredProducts.new_arrival}
          type="new_arrival"
          layout="grid"
        />
      )}

      {/* Trending Products - Sliding Cards */}
      {featuredProducts.trending.length > 0 && (
        <FeaturedSection 
          title="Trending Now"
          subtitle="What everyone's loving"
          products={featuredProducts.trending}
          type="trending"
          layout="slider"
        />
      )}

      {/* Sale Products - Highlighted */}
      {featuredProducts.sale.length > 0 && (
        <FeaturedSection 
          title="Special Offers"
          subtitle="Limited time discounts"
          products={featuredProducts.sale}
          type="sale"
          layout="highlight"
        />
      )}

      {/* Seasonal Products */}
      {featuredProducts.seasonal.length > 0 && (
        <FeaturedSection 
          title="Seasonal Picks"
          subtitle="Perfect for this season"
          products={featuredProducts.seasonal}
          type="seasonal"
          layout="grid"
        />
      )}

      {/* Your existing sections */}
      <section id="trending" className="container py-5">
        {/* ... your existing trending section ... */}
      </section>

      <section id="categories" className="container py-5">
        {/* ... your existing categories section ... */}
      </section>

      <section id="festival" className="container-fluid py-5" style={{ background: "#fff9f2" }}>
        {/* ... your existing festival section ... */}
      </section>
    </div>
  );
};

// 🆕 Featured Section Component (keep the same as before)
interface FeaturedSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  type: string;
  layout: 'scroll' | 'grid' | 'slider' | 'highlight';
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ 
  title, 
  subtitle, 
  products, 
  type, 
  layout 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (layout === 'slider') {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % Math.ceil(products.length / 3));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [products.length, layout]);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'latest': return 'bg-primary';
      case 'new_arrival': return 'bg-success';
      case 'trending': return 'bg-warning text-dark';
      case 'sale': return 'bg-danger';
      case 'seasonal': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const getBadgeText = (type: string) => {
    switch (type) {
      case 'latest': return 'Latest';
      case 'new_arrival': return 'New';
      case 'trending': return 'Trending';
      case 'sale': return 'Sale';
      case 'seasonal': return 'Seasonal';
      default: return 'Featured';
    }
  };

  if (products.length === 0) return null;

  return (
    <section className={`featured-section featured-${layout} py-5`}>
      <div className="container">
        <div className="section-header text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">{title}</h2>
          <p className="lead text-muted">{subtitle}</p>
          <div className="header-decoration"></div>
        </div>

        {layout === 'scroll' && (
          <div className="products-scroll-container">
            <div className="products-scroll-track">
              {products.concat(products).map((product, index) => (
                <ProductCard 
                  key={`${product._id}-${index}`} 
                  product={product} 
                  badge={{ color: getBadgeColor(type), text: getBadgeText(type) }}
                  animation="slide"
                />
              ))}
            </div>
          </div>
        )}

        {layout === 'grid' && (
          <div className="row g-4 justify-content-center">
            {products.map((product) => (
              <div key={product._id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <ProductCard 
                  product={product} 
                  badge={{ color: getBadgeColor(type), text: getBadgeText(type) }}
                  animation="fade"
                />
              </div>
            ))}
          </div>
        )}

        {layout === 'slider' && (
          <div className="products-slider-container">
            <div 
              className="products-slider-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {products.map((product) => (
                <div key={product._id} className="slider-item">
                  <ProductCard 
                    product={product} 
                    badge={{ color: getBadgeColor(type), text: getBadgeText(type) }}
                    animation="scale"
                  />
                </div>
              ))}
            </div>
            <div className="slider-controls">
              {[...Array(Math.ceil(products.length / 3))].map((_, index) => (
                <button
                  key={index}
                  className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        )}

        {layout === 'highlight' && (
          <div className="highlight-products">
            <div className="row g-4 align-items-stretch">
              {products.map((product, index) => (
                <div key={product._id} className={`col-lg-${index === 0 ? '6' : '3'} col-md-${index === 0 ? '6' : '3'} col-sm-6`}>
                  <ProductCard 
                    product={product} 
                    badge={{ color: getBadgeColor(type), text: getBadgeText(type) }}
                    featured={index === 0}
                    animation="bounce"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// 🆕 Product Card Component (keep the same as before)
interface ProductCardProps {
  product: Product;
  badge: { color: string; text: string };
  featured?: boolean;
  animation?: 'slide' | 'fade' | 'scale' | 'bounce';
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  badge, 
  featured = false, 
  animation = 'fade' 
}) => {
  const imageUrl = product.images?.[0] || 'https://placehold.co/300x300?text=No+Image';

  return (
    <div className={`product-card featured-card ${featured ? 'featured-large' : ''} animate-${animation}`}>
      <div className="card-image-container">
        <img 
          src={imageUrl} 
          alt={product.title}
          className="card-image"
        />
        <span className={`product-badge ${badge.color}`}>
          {badge.text}
        </span>
        <div className="card-overlay">
          <button className="btn btn-light btn-sm quick-view-btn">
            Quick View
          </button>
          <button className="btn btn-light btn-sm wishlist-btn">
            ♡
          </button>
        </div>
      </div>
      
      <div className="card-content">
        <h6 className="product-title">{product.title}</h6>
        <p className="product-description">
          {product.description?.substring(0, 60)}...
        </p>
        <div className="price-section">
          <span className="product-price">₹{product.price.toLocaleString()}</span>
          {featured && (
            <span className="discount-badge">Special Offer</span>
          )}
        </div>
        <button className="btn btn-dark w-100 add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Home;