import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { Star, ThumbsUp, X, ChevronLeft, ChevronRight, Upload, Check, Camera, Filter } from 'lucide-react';

export interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  date: string;
  title: string;
  body: string;
  photos: string[];
  helpful: number;
  userHelpful?: boolean;
}

const getStarLabel = (stars: number) => {
  switch (stars) {
    case 5: return 'Absolutely Holy Grail';
    case 4: return 'REALLY GREAT';
    case 3: return 'DECENT';
    case 2: return 'Not my Vibe';
    case 1: return 'Fell Short';
    default: return `${stars} STARS`;
  }
};

interface ProductReviewsSectionProps {
  product: Product;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: 'r1',
    name: 'Kaelen V.',
    avatar: 'KV',
    verified: true,
    rating: 5,
    date: '2 DAYS AGO',
    title: 'Heavyweight perfection, best drop-shoulder cut yet.',
    body: 'The 280 GSM cotton feels indestructible. Fits boxy with perfect shoulder drape. The puff print graphics are super crisp after 3 washes. Spirit Being never misses on the drop quality.',
    photos: ['/review-img/Unknown.webp', '/review-img/Unknown-2.webp'],
    helpful: 24,
  },
  {
    id: 'r2',
    name: 'Marcus T.',
    avatar: 'MT',
    verified: true,
    rating: 5,
    date: '1 WEEK AGO',
    title: 'Holy Spirit streetwear elevated.',
    body: "Subtle typography on the back, high-density print on the front. I ordered an L for an oversized streetwear look (I'm 6'1) and the fit is 10/10.",
    photos: ['/review-img/Unknown-3.webp'],
    helpful: 18,
  },
  {
    id: 'r3',
    name: 'Aria S.',
    avatar: 'AS',
    verified: true,
    rating: 4,
    date: '2 WEEKS AGO',
    title: 'The detail on the print is insane.',
    body: "You can tell the craftsmanship is luxury level. Pre-shrunk cotton didn't shrink in the wash. Love the message and identity behind the brand.",
    photos: [],
    helpful: 12,
  },
  {
    id: 'r4',
    name: 'Devon M.',
    avatar: 'DM',
    verified: true,
    rating: 4,
    date: '3 WEEKS AGO',
    title: 'Premium quality, size up if you want extra baggy.',
    body: 'Super heavy fabric and high quality stitch. True to size boxy fit, but if you want that ultra-draped streetwear look go 1 size up. Highly recommended.',
    photos: ['/review-img/Unknown-4.webp'],
    helpful: 9,
  },
  {
    id: 'r5',
    name: 'Rachel K.',
    avatar: 'RK',
    verified: true,
    rating: 5,
    date: '1 MONTH AGO',
    title: 'The sticker pack & badge included were such a fire touch!',
    body: 'Item arrived in custom packaging with free weatherproof sticker pack and metallic pin badge. Shirt is pure luxury heavyweight cotton.',
    photos: ['/review-img/Unknown-5.webp', '/review-img/Unknown-6.webp'],
    helpful: 15,
  },
  {
    id: 'r6',
    name: 'Julian P.',
    avatar: 'JP',
    verified: true,
    rating: 3,
    date: '1 MONTH AGO',
    title: 'Great heavy fabric, but very oversized.',
    body: 'Quality of the 280 GSM cotton is top notch. Just be aware that it runs quite oversized. I usually wear L but M would have fit better.',
    photos: [],
    helpful: 7,
  },
  {
    id: 'r7',
    name: 'Siddharth M.',
    avatar: 'SM',
    verified: true,
    rating: 5,
    date: '2 MONTHS AGO',
    title: 'Best streetwear brand out of India right now.',
    body: 'The print quality and puff print detailing on the back are unmatched. Shipping was super quick within 2 days.',
    photos: ['/review-img/Unknown.webp'],
    helpful: 21,
  },
  {
    id: 'r8',
    name: 'Tanya R.',
    avatar: 'TR',
    verified: true,
    rating: 2,
    date: '2 MONTHS AGO',
    title: 'Sizing ran larger than expected for me.',
    body: 'Fabric and print quality are excellent, but the shoulder drop was broader than I expected. Order 1 size down if you like a regular fit.',
    photos: [],
    helpful: 4,
  },
];

const RATING_WORDS = ['', 'FELL SHORT', 'NOT MY VIBE', 'DECENT', 'REALLY GREAT', 'ABSOLUTELY HOLY GRAIL'];

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const localStorageKey = `sb_reviews_${product.id}`;

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(localStorageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_REVIEWS;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews, localStorageKey]);
  const [filterStar, setFilterStar] = useState<number | null>(null);
  const [withPhotosOnly, setWithPhotosOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('highest');
  const [visibleCount, setVisibleCount] = useState<number>(4);
  
  // Review Writer Drawer state
  const [isWriterOpen, setIsWriterOpen] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Lightbox modal state (indexed for prev/next cycling)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAllPhotosModal, setShowAllPhotosModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate statistics
  const totalCount = reviews.length;
  const avgScore = totalCount > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1)
    : '0.0';
  
  const recPercent = totalCount > 0
    ? Math.round((reviews.filter((r) => r.rating >= 4).length / totalCount) * 100)
    : 100;

  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.rating === s).length,
    percent: totalCount > 0 ? (reviews.filter((r) => r.rating === s).length / totalCount) * 100 : 0,
  }));

  const allBuyerPhotos = reviews.flatMap((r) =>
    r.photos.map((url) => ({ url, title: r.title, author: r.name }))
  );

  // Filter and Sort logic
  const filteredReviews = reviews
    .filter((r) => (filterStar ? r.rating === filterStar : true))
    .filter((r) => (withPhotosOnly ? r.photos.length > 0 : true))
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0; // default recent order
    });

  const visibleReviews = filteredReviews.slice(0, visibleCount);

  const handleToggleHelpful = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const userHelpful = !r.userHelpful;
          return {
            ...r,
            userHelpful,
            helpful: userHelpful ? r.helpful + 1 : r.helpful - 1,
          };
        }
        return r;
      })
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray: File[] = Array.from(e.target.files);
      filesArray.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setPhotos((prev) => [...prev, reader.result as string].slice(0, 6));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (body.trim().length < 15) {
      setErrorMsg('Review body must be at least 15 characters long');
      return;
    }
    setErrorMsg('');

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newReview: ReviewItem = {
      id: `r-${Date.now()}`,
      name: name.trim(),
      avatar: initials || 'SB',
      verified: true,
      rating,
      date: 'JUST NOW',
      title: title.trim() || 'Verified Purchase',
      body: body.trim(),
      photos,
      helpful: 0,
    };

    setReviews([newReview, ...reviews]);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsWriterOpen(false);
      setName('');
      setEmail('');
      setTitle('');
      setBody('');
      setPhotos([]);
      setRating(5);
    }, 2000);
  };

  return (
    <section className="w-full bg-transparent text-[#EDEEF2] font-mono relative pb-[40px]">
      <div className="lg:grid lg:grid-cols-12 lg:gap-10 lg:items-start relative">
        
        {/* LEFT COLUMN: Sticky Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 mb-10 lg:mb-0">
          {/* Header Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B3DFF] shadow-[0_0_12px_#0B3DFF]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#8A8D95] font-semibold">REVIEWS</span>
          </div>

          {/* Main Headline */}
          <div className="mb-8 w-full">
            <h2 className="text-5xl sm:text-6xl lg:text-[46px] xl:text-[58px] font-anton uppercase text-white tracking-normal leading-[1.1] flex flex-col items-start w-full">
              <span>WHAT OTHER SPIRIT</span>
              <span className="flex items-baseline gap-2 sm:gap-3 mt-1 flex-wrap lg:flex-nowrap justify-between w-full lg:w-auto">
                <span>BEINGS</span>
                <span className="text-[#0B3DFF] font-rouge capitalize font-normal tracking-wide text-[46px] sm:text-[58px] lg:text-[38px] xl:text-[50px] relative whitespace-nowrap lg:ml-auto">
                  Are Saying
                </span>
              </span>
            </h2>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#5B5E66] mt-4 font-mono">
              About {product.title}
            </p>
          </div>

          {/* Rating Summary Section */}
          <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#0D0E11] border border-white/8">
            {/* Score Card */}
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-3">
                <span className="font-anton text-7xl sm:text-[90px] text-white tracking-normal leading-none">
                  {avgScore}
                </span>
                <span className="text-xs sm:text-sm text-[#5B5E66] font-mono tracking-widest">Out of 5</span>
              </div>

              <div className="flex items-center gap-1.5 mt-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= Math.round(Number(avgScore))
                        ? 'fill-[#0B3DFF] text-[#0B3DFF]'
                        : 'fill-white/10 text-white/10'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-[#8A8D95] mt-4 leading-relaxed">
                <b className="text-white font-semibold">{totalCount}</b> spirits rated this drop
              </p>

              <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#0B3DFF]/40 bg-[#0B3DFF]/10 text-[#9FB3FF] text-[10px] uppercase tracking-widest self-start">
                <span>RECOMMENDED BY {recPercent}%</span>
              </div>
            </div>

            <hr className="border-white/10" />

            {/* Rating Breakdown Bars */}
            <div className="flex flex-col justify-center space-y-2.5">
              {starCounts.map(({ stars, count, percent }) => (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setFilterStar(filterStar === stars ? null : stars)}
                  className={`w-full grid grid-cols-12 items-center gap-3 text-left py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                    filterStar === stars ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <span 
                    className="col-span-5 sm:col-span-4 text-[10px] sm:text-[11px] text-[#8A8D95] font-medium tracking-wider uppercase truncate" 
                    title={getStarLabel(stars)}
                  >
                    {getStarLabel(stars)}
                  </span>
                  <div className="col-span-6 sm:col-span-7 h-2 rounded-full bg-[#131419] overflow-hidden">
                    <div
                      className="h-full bg-[#0B3DFF] rounded-full transition-all duration-700"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="col-span-1 text-xs text-[#5B5E66] text-right font-mono">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrolling Reviews */}
        <div className="lg:col-span-8">

      {/* Buyer Photo Strip */}
      {allBuyerPhotos.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#8A8D95]">
              PHOTOS FROM BUYERS
            </p>
            <button
              type="button"
              onClick={() => setShowAllPhotosModal(true)}
              className="px-4 py-1.5 rounded-2xl border border-white/20 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#A0A4B0] hover:text-white hover:border-white hover:bg-white/5 transition-all cursor-pointer select-none"
            >
              SEE ALL
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
            {allBuyerPhotos.map((photo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-white/10 relative group cursor-pointer"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Action Toolbar */}
      <div className="mt-10 py-4 border-y border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8A8D95]">
            SHOWING {Math.min(visibleCount, filteredReviews.length)} OF {filteredReviews.length} REVIEWS
          </span>
          {(filterStar || withPhotosOnly) && (
            <button
              onClick={() => {
                setFilterStar(null);
                setWithPhotosOnly(false);
              }}
              className="hidden"
            >
              CLEAR FILTERS ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setWithPhotosOnly(!withPhotosOnly)}
            className={`text-xs uppercase tracking-wider px-4 py-2 rounded-2xl border transition-all cursor-pointer ${
              withPhotosOnly
                ? 'border-[#0B3DFF] bg-[#0B3DFF]/20 text-[#B9C6FF]'
                : 'border-white/15 text-[#8A8D95] hover:border-white/30 hover:text-white'
            }`}
          >
            WITH PHOTOS ONLY
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs uppercase tracking-wider px-4 py-2 rounded-2xl border border-white/15 bg-[#0D0E11] text-[#8A8D95] hover:border-white/30 focus:outline-none cursor-pointer"
          >
            <option value="recent">SORT BY: MOST RECENT</option>
            <option value="highest">SORT BY: HIGHEST RATING</option>
            <option value="lowest">SORT BY: LOWEST RATING</option>
          </select>

          <button
            onClick={() => setIsWriterOpen(!isWriterOpen)}
            className="text-xs uppercase tracking-widest px-6 py-2.5 rounded-2xl bg-[#0B3DFF] text-white font-bold hover:bg-[#0B3DFF]/90 transition-all shadow-md cursor-pointer"
          >
            {isWriterOpen ? 'CLOSE FORM' : 'WRITE A REVIEW'}
          </button>
        </div>
      </div>

      {/* Write a Review Expanded Form */}
      {isWriterOpen && (
        <form
          onSubmit={handleSubmitReview}
          className="mt-6 p-6 sm:p-8 rounded-2xl bg-[#0D0E11] border border-[#0B3DFF]/40 space-y-6 animate-fade-in shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-mono uppercase tracking-[0.25em] font-bold text-white">WRITE YOUR REVIEW</h3>
              <p className="text-xs text-[#5B5E66] font-mono mt-0.5">One review per person. Take your time with it.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsWriterOpen(false)}
              className="text-[#8A8D95] hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Close review form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Star Picker */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-[#8A8D95] mb-2">YOUR RATING</label>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        s <= (hoverRating || rating)
                          ? 'fill-[#0B3DFF] text-[#0B3DFF]'
                          : 'fill-white/10 text-white/20'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="px-3.5 py-1 rounded-full bg-[#0B3DFF]/15 border border-[#0B3DFF]/30 text-xs font-mono font-bold uppercase tracking-widest text-[#8FA6FF]">
                {RATING_WORDS[hoverRating || rating]}
              </span>
            </div>
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8A8D95] mb-1.5">YOUR NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kaelen V."
                className="w-full bg-[#08090B] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0B3DFF]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8A8D95] mb-1.5">
                EMAIL <span className="text-[#5B5E66] capitalize">(never shown)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="For order verification"
                className="w-full bg-[#08090B] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0B3DFF]"
              />
            </div>
          </div>

          {/* Headline */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs uppercase tracking-widest text-[#8A8D95]">HEADLINE</label>
              <span className="text-[10px] text-[#5B5E66]">{title.length} / 60</span>
            </div>
            <input
              type="text"
              maxLength={60}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum it up in a few words"
              className="w-full bg-[#08090B] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0B3DFF]"
            />
          </div>

          {/* Review Text */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs uppercase tracking-widest text-[#8A8D95]">YOUR REVIEW</label>
              <span className="text-[10px] text-[#5B5E66]">{body.length} / 900</span>
            </div>
            <textarea
              maxLength={900}
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Fit, fabric, print quality, how it wears after a wash. Whatever helped you decide."
              className="w-full bg-[#08090B] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0B3DFF]"
            />
          </div>

          {/* Photo Attachments Upload */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8A8D95] mb-2">
              PHOTOS <span className="text-[#5B5E66] capitalize">(up to 6 photos)</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/15 rounded-xl p-6 text-center bg-[#08090B] hover:border-[#0B3DFF]/60 cursor-pointer transition-colors"
            >
              <Camera className="w-6 h-6 text-[#8A8D95] mx-auto mb-2" />
              <p className="text-xs text-[#8A8D95]">
                Drag photos here or <span className="text-white underline">browse your files</span>
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {photos.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-3">
                {photos.map((p, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-white/20 relative group">
                    <img src={p} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 text-white flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errorMsg && <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>}

          {isSubmitted && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Your review has been published successfully!</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-8 py-3 rounded-full bg-[#0B3DFF] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#0B3DFF]/90 transition-all cursor-pointer"
            >
              SUBMIT REVIEW
            </button>
          </div>
        </form>
      )}

      {/* Reviews Cards List */}
      <div className="mt-8 space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl text-xs text-[#5B5E66]">
            No reviews matching selected filter criteria.
          </div>
        ) : (
          visibleReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-[#0D0E11] border border-white/8 hover:border-white/15 transition-all space-y-3"
            >
              {/* Reviewer Header */}
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#101217] border border-white/15 flex items-center justify-center text-xs font-bold text-white">
                    {rev.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight flex items-center gap-2">
                      <span>{rev.name}</span>
                      {rev.verified && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0B3DFF]/20 text-[#8FA6FF] border border-[#0B3DFF]/30 uppercase">
                          ✓ VERIFIED BUYER
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-[#5B5E66] uppercase tracking-wider mt-0.5">
                      {rev.date}
                    </p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= rev.rating ? 'fill-[#0B3DFF] text-[#0B3DFF]' : 'fill-white/10 text-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Title & Body */}
              <h5 className="text-sm font-bold text-white pt-1">{rev.title}</h5>
              <p className="text-xs leading-relaxed text-[#8A8D95] font-sans">{rev.body}</p>

              {/* Photos Grid if any */}
              {rev.photos.length > 0 && (
                <div className="flex gap-2.5 pt-2">
                  {rev.photos.map((pUrl, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => {
                        const targetIdx = allBuyerPhotos.findIndex(bp => bp.url === pUrl);
                        if (targetIdx !== -1) setLightboxIndex(targetIdx);
                      }}
                      className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 relative group cursor-pointer"
                    >
                      <img
                        src={pUrl}
                        alt="Customer photo"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Footer Helpful Vote */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#5B5E66]">
                <button
                  type="button"
                  onClick={() => handleToggleHelpful(rev.id)}
                  className={`flex items-center gap-1.5 hover:text-[#8FA6FF] transition-colors cursor-pointer ${
                    rev.userHelpful ? 'text-[#8FA6FF] font-bold' : ''
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>HELPFUL ({rev.helpful})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Reviews Button */}
      {filteredReviews.length > visibleCount && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="px-8 py-3 rounded-2xl border border-white/20 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#A0A4B0] hover:text-white hover:border-white hover:bg-white/5 transition-all cursor-pointer shadow-lg select-none"
          >
            LOAD MORE REVIEWS
          </button>
        </div>
      )}
        </div> {/* Close RIGHT COLUMN */}
      </div> {/* Close 2-Column Grid */}

      {/* Photo Lightbox Modal with Prev (<) and Next (>) Arrow Buttons */}
      {lightboxIndex !== null && allBuyerPhotos[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in outline-none"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allBuyerPhotos.length) % allBuyerPhotos.length : 0));
            } else if (e.key === 'ArrowRight') {
              setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allBuyerPhotos.length : 0));
            } else if (e.key === 'Escape') {
              setLightboxIndex(null);
            }
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/25 transition-all cursor-pointer z-20 shadow-lg"
            title="Close preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Arrow Button (<) */}
          {allBuyerPhotos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allBuyerPhotos.length) % allBuyerPhotos.length : 0));
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer z-20 border border-white/15 shadow-2xl hover:scale-110"
              title="Previous photo (Left Arrow)"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Right Arrow Button (>) */}
          {allBuyerPhotos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allBuyerPhotos.length : 0));
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer z-20 border border-white/15 shadow-2xl hover:scale-110"
              title="Next photo (Right Arrow)"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Main Image & Caption Container */}
          <div className="max-w-3xl w-full flex flex-col items-center gap-4 relative z-10 px-12 sm:px-16">
            <div className="relative overflow-hidden rounded-2xl border border-white/15 shadow-2xl bg-black/40">
              <img
                src={allBuyerPhotos[lightboxIndex].url}
                alt={allBuyerPhotos[lightboxIndex].title}
                className="max-h-[72vh] w-auto object-contain"
              />
            </div>

            <div className="text-center font-sans text-xs text-[#8A8D95] space-y-1">
              <p className="font-bold text-white text-sm sm:text-base">{allBuyerPhotos[lightboxIndex].title}</p>
              <p className="text-gray-400">Uploaded by {allBuyerPhotos[lightboxIndex].author}</p>
              {allBuyerPhotos.length > 1 && (
                <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-white/10 text-[10px] font-mono font-bold text-white uppercase tracking-widest">
                  PHOTO {lightboxIndex + 1} OF {allBuyerPhotos.length}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ALL BUYER PHOTOS GALLERY MODAL */}
      {showAllPhotosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0D0E11] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#131419]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0B3DFF] shadow-[0_0_10px_#0B3DFF]" />
                  <h3 className="text-base font-headline uppercase font-bold text-white tracking-wider">
                    BUYER PHOTO GALLERY
                  </h3>
                </div>
                <p className="text-[11px] text-[#8A8D95] font-mono uppercase tracking-widest mt-0.5">
                  SHOWING ALL {allBuyerPhotos.length} PHOTOS UPLOADED BY SPIRIT BEINGS
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllPhotosModal(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-[#8A8D95] hover:text-white transition-colors cursor-pointer"
                title="Close gallery"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Grid Container */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] scrollbar-thin">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {allBuyerPhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setShowAllPhotosModal(false);
                      setLightboxIndex(idx);
                    }}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40 cursor-pointer shadow-md hover:border-[#0B3DFF]/60 transition-all duration-300"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-left">
                      <p className="text-[11px] font-bold text-white truncate">{photo.author}</p>
                      <p className="text-[9px] text-gray-300 truncate">{photo.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
