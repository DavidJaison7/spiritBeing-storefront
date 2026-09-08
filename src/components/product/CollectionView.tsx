import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Collection, Product } from '../../types';
import { ProductCard } from './ProductGrid';
import './CollectionView.css';

interface CollectionViewProps {
  collection: Collection;
  products: Product[];
  onNavigateHome: () => void;
  onSelectProduct: (product: Product, selectedColor?: string) => void;
  wishlist?: string[];
  onToggleWishlist?: (productId: string) => void;
  onAddToCart?: (product: Product, size: string, color?: string) => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  collection,
  products,
  onNavigateHome,
  onSelectProduct,
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
}) => {
  const [justAddedId, setJustAddedId] = React.useState<string | null>(null);
  const isLive = collection.status === 'live';
  const collectionProducts = products.filter((p) => p.collectionId === collection.id);

  const handleAddToCart = (e: React.MouseEvent, product: Product, size: string, color?: string) => {
    onAddToCart?.(product, size, color);
    setJustAddedId(product.id);
    window.setTimeout(() => setJustAddedId(null), 1800);
  };

  return (
    <div className={`sb-collection-view ${isLive ? 'is-live' : 'is-coming-soon'}`}>
      <div className="sb-collection-view__hero">
        <img
          src={collection.heroImage}
          alt=""
          className="sb-collection-view__hero-img"
          decoding="async"
        />
        <div className="sb-collection-view__hero-scrim" aria-hidden="true" />

        <button
          type="button"
          className="sb-collection-view__back"
          onClick={onNavigateHome}
          aria-label="Back to home"
        >
          <ArrowLeft size={18} strokeWidth={1.75} />
          <span>Back</span>
        </button>

        <div className="sb-collection-view__hero-copy">
          <h1 className="sb-collection-view__title">{collection.title}</h1>
          <p className="sb-collection-view__tagline">{collection.tagline}</p>
          {isLive && <p className="sb-collection-view__desc">{collection.description}</p>}
        </div>

        {!isLive && (
          <div className="sb-collection-view__soon-overlay" aria-hidden="true">
            <p className="sb-collection-view__soon-text">Coming soon</p>
          </div>
        )}
      </div>

      {isLive && (
        <section className="sb-collection-view__products" aria-label={`${collection.title} products`}>
          <div className="sb-collection-view__products-head">
            <span className="sb-collection-view__eyebrow">Collection drop</span>
            <p className="sb-collection-view__count">
              {collectionProducts.length} {collectionProducts.length === 1 ? 'piece' : 'pieces'}
            </p>
          </div>

          {collectionProducts.length > 0 ? (
            <div className="sb-product-grid">
              {collectionProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(color) => onSelectProduct(product, color)}
                  onAddToCart={(e, size, color) => handleAddToCart(e, product, size, color)}
                  isAdded={justAddedId === product.id}
                  wishlist={wishlist}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="sb-collection-view__empty">
              <p>No products tagged for this collection in Shopify yet.</p>
              <p className="sb-collection-view__empty-hint">
                Add tag <code>{collection.shopifyTag}</code> to products in Shopify Admin.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
