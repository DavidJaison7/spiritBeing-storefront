import React, { useState } from 'react';
import { Product } from '../types';
import { ArrowLeft, Check, Plus } from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onBackToShop: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color?: string) => void;
}
const getColorHex = (colorName: string) => {
  const normalized = colorName.toLowerCase();
  if (normalized.includes('black')) return '#1a1a1a';
  if (normalized.includes('white') || normalized.includes('clear')) return '#fcfcfc';
  if (normalized.includes('grey') || normalized.includes('charcoal')) return '#4a4a4a';
  if (normalized.includes('blue') || normalized.includes('navy') || normalized.includes('cobalt')) return '#2040FF';
  if (normalized.includes('red')) return '#8b0000';
  if (normalized.includes('olive')) return '#556b2f';
  return '#cccccc';
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onBackToShop,
  onSelectProduct,
  onAddToCart,
}) => {
  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
  const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(defaultColor);
  const [added, setAdded] = useState<boolean>(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const handleRelatedPlusClick = (e: React.MouseEvent, relProduct: Product) => {
    e.stopPropagation();
    const defaultSize = relProduct.sizes && relProduct.sizes.length > 0 ? relProduct.sizes[0] : 'M';
    onAddToCart(relProduct, defaultSize, undefined);
    
    setJustAddedId(relProduct.id);
    setTimeout(() => {
      setJustAddedId((current) => (current === relProduct.id ? null : current));
    }, 1400);
  };

  // Update default state if product changes
  React.useEffect(() => {
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M');
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
  }, [product]);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-20 md:pt-28 flex flex-col gap-20">


      {/* Main Product Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Left Column: Image Box */}
        <div className="glass-panel overflow-hidden relative aspect-square flex items-center justify-center p-4 md:p-6 border border-gray-200 bg-white rounded-2xl shadow-sm">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain filter drop-shadow-2xl"
          />
        </div>

        {/* Right Column: Info & Action */}
        <div className="flex flex-col items-center text-center max-w-lg mx-auto">
          <div className="space-y-2 mb-5">
            <p className="text-[#2040FF] font-headline text-sm font-bold tracking-wider uppercase mb-1">
              {product.tagline || "YOU'RE GETTING WARMER"}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-normal text-black leading-tight">
              {product.title}
            </h1>
            <p className="text-2xl font-body-garamond font-bold mt-2 text-[#1b1c1c]">
              Rs. {product.price}
            </p>
          </div>

          <p className="text-gray-800 font-playfair text-lg md:text-xl leading-relaxed mb-10">
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-4 w-full mb-10">
              <span className="block text-xs font-headline font-bold uppercase tracking-widest text-gray-400">
                SELECT SIZE
              </span>
              <div className="flex justify-center gap-6 text-3xl font-playfair">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`transition-colors cursor-pointer font-medium ${selectedSize === size
                        ? 'text-black underline underline-offset-8 decoration-2'
                        : 'text-gray-300 hover:text-black'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-4 w-full mb-10">
              <span className="block text-xs font-headline font-bold uppercase tracking-widest text-gray-400">
                SELECT COLOR
              </span>
              <div className="flex justify-center gap-4 flex-wrap">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-10 h-10 rounded-[12px] cursor-pointer transition-all hover:scale-110 flex items-center justify-center shadow-sm
                        ${isSelected ? 'ring-2 ring-black ring-offset-2 scale-110' : 'ring-1 ring-black/10 border border-black/5'}`}
                      style={{ backgroundColor: getColorHex(color) }}
                      title={color}
                      aria-label={`Select ${color}`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="w-full mb-8">
            <button
              onClick={handleAddToCart}
              className={`w-full sm:w-3/4 mx-auto border-2 border-black rounded-full py-4 text-lg font-headline font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${added ? 'bg-black text-white' : ''
                }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>ADDED TO CART</span>
                </>
              ) : (
                <span>Add to Cart</span>
              )}
            </button>
          </div>

          {/* Spec Meta */}
          <div className="w-full pt-6 border-t border-gray-300">
            <div className="text-[11px] md:text-[12px] text-gray-700 font-sans uppercase tracking-[0.08em] space-y-1.5 font-bold">
              {product.material && <p>MATERIAL: {product.material}</p>}
              {product.color && <p>COLOR: {product.color}</p>}
              {product.origin && <p>ORIGIN: {product.origin}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="space-y-8 pt-12 border-t border-gray-200">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-lg font-sans font-bold tracking-wider uppercase text-black">
            YOU MAY ALSO LIKE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedProducts.map((rel) => {
            const isAdded = justAddedId === rel.id;

            return (
              <div
                key={rel.id}
                onClick={() => onSelectProduct(rel)}
                className="group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Curved Flashcard Image Frame */}
                <div className="relative aspect-[3/4] w-full rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#e8e5de] border border-black/5 shadow-sm">
                  <img
                    src={rel.image}
                    alt={rel.title}
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
                    <h4 className="font-sans font-medium text-[14px] sm:text-[15px] text-[#1a1a1a] tracking-tight leading-snug group-hover:text-black">
                      {rel.title}
                    </h4>
                    <p className="font-sans text-[13px] sm:text-[14px] text-[#333333] mt-1 font-normal tracking-tight">
                      Rs. {rel.price.toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleRelatedPlusClick(e, rel)}
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
    </div>
  );
};

