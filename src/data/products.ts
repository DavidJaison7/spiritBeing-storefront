import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    shopifyId: 'gid://shopify/Product/8291048123',
    handle: 'the-spirit-gives-life-tee',
    title: 'The Spirit Gives Life Tee',
    subtitle: 'Heavyweight Oversized Tee',
    price: 899,
    category: 'Apparel',
    image: '/products/the-spirit-gives-life/blue/main-fixedslide.png',
    additionalImages: [
      '/products/the-spirit-gives-life/blue/1.png',
      '/products/the-spirit-gives-life/blue/2.png',
      '/products/the-spirit-gives-life/blue/3.png',
      '/products/the-spirit-gives-life/blue/4.png'
    ],
    colorImageMap: {
      'Blue': [
        '/products/the-spirit-gives-life/blue/main-fixedslide.png',
        '/products/the-spirit-gives-life/blue/1.png',
        '/products/the-spirit-gives-life/blue/2.png',
        '/products/the-spirit-gives-life/blue/3.png',
        '/products/the-spirit-gives-life/blue/4.png'
      ],
      'Black': [
        '/products/the-spirit-gives-life/black/main.png',
        '/products/the-spirit-gives-life/black/1.png',
        '/products/the-spirit-gives-life/black/2.png',
        '/products/the-spirit-gives-life/black/3.png',
        '/products/the-spirit-gives-life/black/4.png'
      ]
    },
    description: 'Heavyweight combed cotton drop-shoulder boxy tee with high-density Christian streetwear back typography: "The Spirit Gives Life. The written law cannot give life, but the Spirit brings life." (2 Corinthians 3:6). Pre-shrunk premium oversized cut designed for daily presence.',
    tagline: 'THE SPIRIT GIVES LIFE',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'Black'],
    color: 'ELECTRIC BLUE',
    material: '100% COMBED COTTON (280 GSM)',
    origin: 'MADE IN INDIA',
    inStock: true,
    isFeatured: true,
    likesCount: 348
  },
  {
    id: 'prod_2',
    shopifyId: 'gid://shopify/Product/8291048124',
    handle: 'spirit-being-graffiti-tee',
    title: 'Spirit Being Graffiti Tee',
    subtitle: 'Drop Shoulder Bubble Print Tee',
    price: 899,
    category: 'Apparel',
    image: '/carousel-model-2.png',
    additionalImages: [
      '/carousel-model-2.png'
    ],
    description: 'Relaxed drop-shoulder silhouette featuring a heavy puff bubble text graphic: "Spirit Being". Premium organic cotton streetwear fit representing our true identity as new creations.',
    tagline: 'SPIRIT BEING',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    color: 'INK BLACK',
    material: '100% ORGANIC COTTON (260 GSM)',
    origin: 'MADE IN INDIA',
    inStock: true,
    isFeatured: true,
    likesCount: 284
  },
  {
    id: 'prod_3',
    shopifyId: 'gid://shopify/Product/8291048125',
    handle: 'new-creation-oversized-tee',
    title: 'New Creation Oversized Tee',
    subtitle: 'Acid Wash Heavyweight Tee',
    price: 899,
    category: 'Apparel',
    image: '/products/new-creation-main.png',
    additionalImages: [
      '/products/new-creation-2.png',
      '/products/new-creation-3.jpeg'
    ],
    description: 'Vintaged acid wash drop-shoulder streetwear tee featuring a detailed frame graphic on the back: "New Creation. The old has passed away; behold, the new has come." (2 Corinthians 5:17). Engineered with an ultra-soft acid wash finish and reinforced ribbed collar.',
    tagline: 'NEW CREATION',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    color: 'ACID WASH BLACK',
    material: '260 GSM HEAVY COTTON',
    origin: 'MADE IN INDIA',
    inStock: true,
    isFeatured: true,
    likesCount: 412
  },
  {
    id: 'prod_4',
    shopifyId: 'gid://shopify/Product/8291048126',
    handle: 'fear-not-gold-lion-tee',
    title: 'Fear Not Gold Lion Tee',
    subtitle: 'Oversized Streetwear Tee',
    price: 899,
    category: 'Apparel',
    image: '/carousel-model-4.png',
    additionalImages: [
      '/carousel-model-4.png'
    ],
    description: 'Deep black heavyweight tee featuring a high-density gold print of a lion and lamb: "Fear Not, for I am with you; be not dismayed, for I am your God; I will strengthen you." (Isaiah 41:10). Premium boxy drop-shoulder cut.',
    tagline: 'FEAR NOT',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    color: 'MATTE BLACK',
    material: '100% COMBED COTTON (280 GSM)',
    origin: 'MADE IN INDIA',
    inStock: true,
    isFeatured: true,
    likesCount: 196
  },
  {
    id: 'prod_5',
    shopifyId: 'gid://shopify/Product/8291048127',
    handle: 'holy-spirit-dove-tee',
    title: 'Holy Spirit Dove Tee',
    subtitle: 'Signature Drop Shoulder Tee',
    price: 899,
    category: 'Apparel',
    image: '/carousel-model-5.png',
    additionalImages: [
      '/carousel-model-5.png'
    ],
    description: 'Electric blue drop-shoulder tee with a majestic dove print: "Holy Spirit. The same Spirit who raised Christ from the dead lives in you." (Romans 8:11). Soft premium ringspun cotton.',
    tagline: 'HOLY SPIRIT',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue'],
    color: 'ELECTRIC BLUE',
    material: '100% RINGSPUN COTTON (260 GSM)',
    origin: 'MADE IN INDIA',
    inStock: true,
    isFeatured: true,
    likesCount: 310
  },
  {
    id: 'prod_6',
    shopifyId: 'gid://shopify/Product/8291048128',
    handle: 'christ-generations-tee',
    title: 'Christ Generations Tee',
    subtitle: 'Boxy Fit Heavyweight Tee',
    price: 899,
    category: 'Apparel',
    image: '/carousel-model-6.png',
    additionalImages: [
      '/carousel-model-6.png'
    ],
    description: 'Signature matte black drop-shoulder streetwear tee featuring blue back wing graphics: "Spirit Being + Christ Generations. For as many as are led by the Spirit of God, these are sons of God." (Romans 8:14). designed for presence and purpose.',
    tagline: 'CHRIST GENERATIONS',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    color: 'MATTE BLACK',
    material: '280 GSM HEAVY COTTON',
    origin: 'MADE IN INDIA',
    inStock: true,
    isFeatured: true,
    likesCount: 524
  }
];
