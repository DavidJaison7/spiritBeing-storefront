import React, { useState } from 'react';
import { X } from 'lucide-react';
import './BlogView.css';

interface BlogViewProps {
  onClose: () => void;
}

const BLOG_POSTS = [
  {
    id: '01',
    tag: 'story',
    image: 'images/01.jpg',
    title: 'The Spirit Gives Life: The Story Behind The Drop',
    excerpt: 'Two figures, one body. The grey one lying still, the blue one rising out of it. This is the graphic that started Spirit Being, and 2 Corinthians 3:6 is the line that wouldn\'t leave us alone.',
    date: 'Aug 18, 2026',
    readTime: '5 min'
  },
  {
    id: '02',
    tag: 'faith',
    image: 'images/02.jpg',
    title: 'Why We Put Scripture On Streetwear',
    excerpt: 'A verse on a hoodie isn\'t decoration. It\'s a sentence someone reads on a train, in a queue, on a crosswalk. We talk about carrying the word into places a pulpit never reaches.',
    date: 'Aug 11, 2026',
    readTime: '4 min'
  },
  {
    id: '03',
    tag: 'design',
    image: 'images/03.jpg',
    title: 'Blue, Flame And Light: Our Colour Language',
    excerpt: 'Every brand picks a colour. Ours picked us. Electric blue reads as spirit, as fire that doesn\'t burn, as the coldest flame in the picture. Here\'s how we use it and where we refuse to.',
    date: 'Aug 04, 2026',
    readTime: '6 min'
  },
  {
    id: '04',
    tag: 'style',
    image: 'images/04.jpg',
    title: 'How To Style The Spirit Gives Life Tee',
    excerpt: 'Boxy drop-shoulder on top, volume at the bottom. Three ways to wear the blue tee without letting the graphic do all the talking, from washed baggies to a clean denim break.',
    date: 'Jul 28, 2026',
    readTime: '3 min'
  },
  {
    id: '05',
    tag: 'story',
    image: 'images/05.jpg',
    title: 'Faith. Identity. Purpose. What The Three Words Mean',
    excerpt: 'They sit under every logo we print. Not a tagline we bought from an agency, but the actual order we believe things happen in. Faith comes first, identity follows, purpose is the outcome.',
    date: 'Jul 21, 2026',
    readTime: '4 min'
  },
  {
    id: '06',
    tag: 'craft',
    image: 'images/06.jpg',
    title: 'Inside The Fabric: Our Heavyweight Cotton',
    excerpt: '240 GSM, combed and bio-washed, cut oversized on a boxy block. What that actually means for how a tee sits on your shoulders after twenty washes, and why we stopped chasing thicker.',
    date: 'Jul 14, 2026',
    readTime: '7 min'
  },
  {
    id: '07',
    tag: 'craft',
    image: 'images/07.jpg',
    title: 'From Sketch To Screenprint: Making The Levitation Graphic',
    excerpt: 'Eleven passes of ink, one of them a soft-hand blue that had to glow without cracking. A walk through the plates, the misprints we kept, and the test that finally held.',
    date: 'Jul 07, 2026',
    readTime: '6 min'
  },
  {
    id: '08',
    tag: 'faith',
    image: 'images/08.jpg',
    title: 'Streetwear Was Always Spiritual',
    excerpt: 'Before the resale apps and the queue culture, the street had its own liturgy: uniforms, symbols, belonging. Spirit Being isn\'t putting faith into streetwear. It\'s naming what was already there.',
    date: 'Jun 30, 2026',
    readTime: '5 min'
  },
  {
    id: '09',
    tag: 'design',
    image: 'images/09.jpg',
    title: 'The Chrome Balloon Type, Explained',
    excerpt: 'Soft, inflated, impossible to take too seriously. Our display lettering is deliberately playful against heavy subject matter, because grace isn\'t grim. Notes on how we build it.',
    date: 'Jun 23, 2026',
    readTime: '4 min'
  },
  {
    id: '10',
    tag: 'care',
    image: 'images/10.jpg',
    title: 'Care Guide: Keep The Print Alive',
    excerpt: 'Inside out, cold water, no tumble, no iron on the graphic. Four rules that will keep a blue flame looking like a blue flame three years from now instead of a grey ghost.',
    date: 'Jun 16, 2026',
    readTime: '3 min'
  }
];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'story', label: 'Story' },
  { id: 'faith', label: 'Faith' },
  { id: 'design', label: 'Design' },
  { id: 'style', label: 'Style' },
  { id: 'craft', label: 'Craft' },
  { id: 'care', label: 'Care' }
];

export const BlogView: React.FC<BlogViewProps> = ({ onClose }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState<typeof BLOG_POSTS[0] | null>(null);

  const filteredPosts = BLOG_POSTS.filter(post =>
    activeFilter === 'all' || post.tag === activeFilter
  );

  return (
    <section className="pt-24 pb-32 bg-[#fbf9f9] min-h-screen text-black" id="sbb">
      <header className="max-w-[1680px] mx-auto px-6 md:px-10 mb-12">
        <nav className="text-[11px] tracking-[0.26em] uppercase text-gray-400 flex items-center gap-2 mb-6">
          <button onClick={onClose} className="hover:text-black transition-colors">Home</button>
          <span>/</span>
          <span className="text-gray-800">Blogs</span>
        </nav>

        <h1 className="text-4xl sm:text-6xl font-anton uppercase text-black tracking-normal mt-6">
          The <span className="text-[#0B3DFF] font-yellowtail text-5xl sm:text-7xl capitalize font-normal">Journal</span>
        </h1>

        <p className="mt-4 max-w-[52ch] text-xs sm:text-sm leading-relaxed text-gray-500">
          Stories, scripture and process notes from the Spirit Being studio. Faith. Identity. Purpose.
        </p>

        <div className="flex flex-wrap gap-2 mt-8">
          {FILTERS.map(filter => (
            <button
              key={filter.id}
              className={`border rounded-full px-4 py-2 text-[10.5px] tracking-[0.2em] uppercase cursor-pointer transition-all ${activeFilter === filter.id
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-white text-gray-500 border-black/10 hover:border-black/30 hover:text-black'
                }`}
              onClick={() => setActiveFilter(filter.id)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-[1680px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {filteredPosts.map(post => (
            <button key={post.id} className="text-left group flex flex-col cursor-pointer" type="button" onClick={() => setSelectedPost(post)}>
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100 mb-4 w-full shadow-sm group-hover:shadow-md transition-shadow">
                <span className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[9px] tracking-[0.22em] uppercase text-black rounded-full shadow-sm">
                  {post.tag}
                </span>
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 px-1">
                <h3 className="font-sans font-bold text-[15px] sm:text-base leading-snug tracking-tight text-black group-hover:text-[#0B3DFF] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <span className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-gray-500 mt-1">
                  {post.date} <span>&bull;</span> {post.readTime}
                  <span className="ml-auto text-[#0B3DFF] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">&#8594;</span>
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredPosts.length > 0 && (
          <div className="flex justify-center mt-16">
            <button className="border border-black text-black bg-transparent rounded-full px-10 py-4 text-[11px] tracking-[0.24em] uppercase hover:bg-black hover:text-white transition-all cursor-pointer">
              Load more
            </button>
          </div>
        )}
      </div>

      {/* Blog Post Full View */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[100] bg-[#fbf9f9] overflow-y-auto w-full h-full"
          data-lenis-prevent="true"
        >
          <div className="max-w-[1680px] mx-auto px-6 md:px-10 py-6 md:py-10">
            {/* Header/Nav for post */}
            <nav className="text-[11px] tracking-[0.26em] uppercase text-gray-400 flex items-center gap-2 mb-8">
              <button onClick={() => setSelectedPost(null)} className="hover:text-black transition-colors flex items-center gap-2 cursor-pointer">
                <span aria-hidden="true">&#8592;</span> Back to Journal
              </button>
            </nav>

            {/* Hero Image */}
            <div className="w-full aspect-[21/9] md:aspect-[2.5/1] bg-gray-100 rounded-[2rem] overflow-hidden mb-12 shadow-sm">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Excerpt */}
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-sans font-bold text-black tracking-tight mb-6">
                {selectedPost.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-3xl mx-auto">
                {selectedPost.excerpt}
              </p>
            </div>

            {/* Content Area */}
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
              {/* Left Column: Text */}
              <div className="lg:col-span-2 prose prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-[14px] md:prose-p:text-[15px] prose-headings:text-black prose-headings:font-bold prose-headings:tracking-tight max-w-none">
                <p>
                  Even before they notice the graphic on your T-shirt or the silhouette of your cargos, the first thing someone notices is colour.
                </p>
                <p>
                  It's immediate. It's instinctive. And in many cases, it's the first impression your outfit makes.
                </p>
                <p>
                  That is the reason the colour has emerged as certainty among the most effective instruments in contemporary streetwear. No longer is it only about wearing black because it is safe or bright colors because they are in vogue. Streetwear is a lot more on the ball today. They use colour to communicate personality, mood, confidence and creativity.
                </p>
                <p>
                  This is where the psychology of colours in fashion becomes fascinating.
                </p>
                <p>
                  Each shade has an emotional connotation. Browns appear stable and grounded, blues are trustworthy, greens are calming, and a strong red color stands out as energetic. Knowing these little hints doesn't mean having to conform to a set of rules when it comes to styling, it just means you will be making better choices.
                </p>
                <p>
                  At BLUORNG, colour is a key element rather than just a design element. From a washed over T-shirt and a graphic print to a basic every day essential, the right color can tell a story before you say a word.
                </p>
                <p>
                  Let's take a look at the importance of colour psychology fashion in today's streetwear and how it plays such an important role in the current times.
                </p>

                <h3 className="mt-10 mb-4 text-xl">Why Colour is One of the First Things People Notice?</h3>
                <p>
                  Colour is processed by the brain quicker than patterns, text or details.
                  People subconsciously form their impressions about an outfit in a matter of seconds based on its colour palette. Colour evokes an emotional reaction, long before the person notices the fit or the styling.
                </p>
                <p>
                  The monochrome black outfit looks entirely different from the outfit built around earthy browns or washed blues. Because colours have a natural tendency of expressing emotion.
                </p>
                <p>
                  Colour is another way of expressing oneself in streetwear where it is the heart of the culture. Some prefer to stick with muted neutral colors, while some try to stand out with bright hues to showcase a sense of confidence and individuality.
                </p>
                <p>There is no right or wrong approach.</p>
                <p>Colours are a genuine reflection of your personality.</p>

                <h3 className="mt-10 mb-4 text-xl">What Colour Psychology Means in Fashion?</h3>
                <p>
                  So, what exactly is colour psychology fashion?
                  In simple words, it is the science of the effect of color on emotions, perceptions and behavior.
                  Fashion designers have always known that colours shape how clothing is viewed and experienced.
                </p>
                <p>For example:</p>
                <ul className="list-disc pl-5 text-gray-600 mb-6 space-y-2">
                  <li>Dark colours are seen as powerful and sophisticated.</li>
                  <li>Earth tones add a sense of warmth and authenticity.</li>
                  <li>Blues are calm and reliable.</li>
                  <li>White reflects simplicity and freshness.</li>
                  <li>Brighter shades exude positivity and vigour.</li>
                </ul>
                <p>
                  These connections aren't universal, but are surprisingly similar in all cultures.
                </p>
                <p>
                  The psychology of colours in fashion does not suggest wearing only one color as it represents a particular emotion. Instead, it invites you to take the time to learn about the mood that your clothes evoke.
                </p>
                <p>
                  Streetwear today has taken that notion to heart, fusing colour with silhouette, texture, and graphics to produce a style that is expressive of oneself.
                </p>
              </div>

              {/* Right Column: Image */}
              <div className="lg:col-span-1">
                <div className="w-full aspect-[4/5] bg-gray-100 rounded-[2rem] overflow-hidden sticky top-10 shadow-sm hidden lg:block">
                  <img src={selectedPost.image} alt="sidebar graphic" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
