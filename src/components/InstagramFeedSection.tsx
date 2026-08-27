import React from 'react';
import { Instagram, ExternalLink, Heart, MessageCircle } from 'lucide-react';

interface InstagramPost {
  id: string;
  image: string;
  likes: string;
  comments: string;
  caption: string;
  link: string;
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig_1',
    image: '/products/product-sec2.png',
    likes: '2.4K',
    comments: '142',
    caption: 'Chosen One Drop Shoulder Tee — Heavyweight 280 GSM combed cotton archive release. #SpiritBeing',
    link: 'https://instagram.com',
  },
  {
    id: 'ig_2',
    image: '/products/product-main.jpg',
    likes: '1.9K',
    comments: '98',
    caption: 'Oversized streetwear cuts designed for the chosen ones. Est. 2026 India. #ChristianStreetwear',
    link: 'https://instagram.com',
  },
  {
    id: 'ig_3',
    image: '/products/product-sec1.jpg',
    likes: '3.1K',
    comments: '215',
    caption: 'Back typography preview & reverse wash details. Available in limited quantities online.',
    link: 'https://instagram.com',
  },
  {
    id: 'ig_4',
    image: '/products/product-sec3.png',
    likes: '1.6K',
    comments: '84',
    caption: 'Faith. Identity. Purpose. The uniform for the generation. #SpiritBeingStudio',
    link: 'https://instagram.com',
  },
  {
    id: 'ig_5',
    image: '/archive/image 1328.png',
    likes: '2.8K',
    comments: '176',
    caption: 'Faith Over Fear drop sleeve collection live on spiritbeing.studio',
    link: 'https://instagram.com',
  },
  {
    id: 'ig_6',
    image: '/archive/image 1330.png',
    likes: '2.1K',
    comments: '110',
    caption: 'Kingdom Heritage boxy fit tee with cobalt print details. #StreetwearArchive',
    link: 'https://instagram.com',
  },
];

export const InstagramFeedSection: React.FC = () => {
  return (
    <section className="w-full bg-black pt-8 md:pt-10 relative z-10 font-sans">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] shadow-sm">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Instagram className="w-5 h-5 text-black" />
              </div>
            </div>
            <div>
              <h3 className="font-anton text-xl md:text-2xl text-white uppercase tracking-normal flex items-center gap-2 justify-center md:justify-start">
                <span>@SPIRITBEING.STUDIO</span>
              </h3>
              <p className="text-xs text-gray-400 font-sans tracking-wide">
                INSTAGRAM ADVERTISING & ARCHIVE COMMUNITY
              </p>
            </div>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>FOLLOW ON INSTAGRAM</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Instagram Posts Horizontal Feed Strip */}
        <div className="w-full overflow-x-auto scrollbar-none pb-4">
          <div className="flex gap-4 min-w-full">
            {INSTAGRAM_POSTS.map((post) => {
              const isPng = post.image.endsWith('.png');
              return (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-56 sm:w-64 md:w-72 shrink-0 aspect-square rounded-[20px] bg-[#e8e5de] relative group overflow-hidden border border-black/10 shadow-xs cursor-pointer block"
                >
                  <img
                    src={post.image}
                    alt={post.caption}
                    className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out ${
                      isPng ? 'object-contain p-4' : 'object-cover object-center'
                    }`}
                  />

                  {/* Hover Instagram Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white">
                    <div className="flex justify-end">
                      <Instagram className="w-5 h-5 text-white/80" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-sans line-clamp-2 text-white/90 leading-snug">
                        {post.caption}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-bold pt-1 border-t border-white/20">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 fill-white" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4 fill-white" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
