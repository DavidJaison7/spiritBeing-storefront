import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Check } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const handlePlusClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
    onAddToCart(product, defaultSize);
    
    setJustAddedId(product.id);
    setTimeout(() => {
      setJustAddedId((current) => (current === product.id ? null : current));
    }, 1400);
  };

  return (
    <section id="products-grid" className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-12 md:py-20 text-black">
      {/* Flashcards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
          {products.map((product) => {
            const isAdded = justAddedId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Curved Flashcard Image Frame */}
                <div className="relative aspect-[3/4] w-full rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#e8e5de] border border-black/5 shadow-sm">
                  {/* Product Image */}
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Carousel Indicator Dots in Bottom Center */}
                  <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50 shadow-sm" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50 shadow-sm" />
                  </div>
                </div>

                {/* Card Footer: Title & Price + Plus / Added Button */}
                <div className="flex items-start justify-between pt-3.5 px-1">
                  <div className="pr-2">
                    <h3 className="font-sans font-medium text-[14px] sm:text-[15px] text-[#1a1a1a] tracking-tight leading-snug group-hover:text-black">
                      {product.title}
                    </h3>
                    <p className="font-sans text-[13px] sm:text-[14px] text-[#333333] mt-1 font-normal tracking-tight">
                      Rs. {product.price.toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handlePlusClick(e, product)}
                    className={`w-7 h-7 shrink-0 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer mt-0.5 ${
                      isAdded
                        ? 'bg-black text-white scale-110'
                        : 'text-[#111111] hover:bg-black/10 hover:scale-105'
                    }`}
                    title={isAdded ? 'Added to cart' : 'Add to cart'}
                    aria-label="Add to cart"
                  >
                    {isAdded ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[1.5]" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
  );
};

