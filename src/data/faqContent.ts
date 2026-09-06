export type FaqBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'note'; text: string };

export interface FaqItem {
  question: string;
  blocks: FaqBlock[];
}

export interface FaqCategory {
  id: string;
  label: string;
  items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'brand',
    label: 'The brand',
    items: [
      {
        question: 'What is Spirit Being?',
        blocks: [
          {
            type: 'p',
            text: 'A streetwear label out of Chennai, built on the idea that you are spirit first and body second. The graphics carry that: scripture, symbols, and language pulled from faith and set in a street vocabulary.',
          },
          {
            type: 'p',
            text: "Clothes you'd wear anyway, that happen to say something you'd want said.",
          },
        ],
      },
      {
        question: 'Do I have to be religious to wear it?',
        blocks: [
          {
            type: 'p',
            text: "No. Wear it because the piece is good. If the words on it start a conversation, that's the point, and nobody is checking your credentials at the door.",
          },
        ],
      },
      {
        question: 'Where is everything made?',
        blocks: [
          {
            type: 'p',
            text: 'Cut, stitched, and printed in Tamil Nadu, in small units we visit ourselves. Runs stay small so we can check pieces by hand and keep the people making them paid fairly.',
          },
        ],
      },
      {
        question: 'Can we collaborate?',
        blocks: [
          {
            type: 'p',
            text: 'Artists, churches, musicians, photographers — send what you make to hello@spiritbeinggen.com with a line about what you have in mind. We read everything, and reply to what fits.',
          },
        ],
      },
    ],
  },
  {
    id: 'garments',
    label: 'Garments',
    items: [
      {
        question: 'How does the fit run?',
        blocks: [
          {
            type: 'p',
            text: 'Everything is cut boxy and oversized on purpose. If you normally wear a medium, a medium gives you the drop-shoulder look on the model. Want it closer to the body, take one size down.',
          },
          {
            type: 'p',
            text: 'Every product page has a flat-measurement chart in inches — chest, length, shoulder, sleeve. Measure a tee you already love and match it.',
          },
        ],
      },
      {
        question: 'What are the pieces made of?',
        blocks: [
          {
            type: 'ul',
            items: [
              'Tees — 240 GSM combed cotton, garment dyed, pre-shrunk.',
              'Heavyweight tees — 280 GSM with a ribbed collar that holds its shape.',
              'Hoodies and crews — 380 GSM brushed fleece, cotton-rich.',
            ],
          },
          { type: 'note', text: 'Prints are water-based or puff, cured in-house.' },
        ],
      },
      {
        question: 'How do I wash it without wrecking it?',
        blocks: [
          {
            type: 'ul',
            items: [
              'Machine wash cold, inside out, with like colours.',
              'Air dry in shade. Tumble drying is what shrinks garment-dyed cotton.',
              'Iron on the reverse. Never directly on the print.',
              'Skip the dry clean and the bleach.',
            ],
          },
        ],
      },
      {
        question: 'Will a sold-out piece come back?',
        blocks: [
          {
            type: 'p',
            text: "Usually not. Each drop is a fixed run, and when a size is gone it's gone. A few core pieces get a second cut, and those get announced on Instagram first.",
          },
          {
            type: 'p',
            text: "Add your email to the restock alert on the product page and you'll hear before the site does.",
          },
        ],
      },
      {
        question: 'How do drops work?',
        blocks: [
          {
            type: 'p',
            text: 'New collections are teased on @spiritbeinggen about a week out, with the exact date and time. The drop goes live on the site at that moment. No password, no raffle — first come, first served.',
          },
        ],
      },
    ],
  },
  {
    id: 'shipping',
    label: 'Shipping',
    items: [
      {
        question: 'Where do you ship?',
        blocks: [
          {
            type: 'p',
            text: 'Across India, and internationally to most countries. Orders leave our studio in Chennai.',
          },
        ],
      },
      {
        question: 'When will it reach me?',
        blocks: [
          {
            type: 'ul',
            items: [
              'Dispatch within 48 hours of the order, except on pre-orders.',
              'Metro cities — 2 to 4 working days.',
              'Rest of India — 4 to 7 working days.',
              'International — 7 to 12 working days.',
            ],
          },
          { type: 'note', text: 'Pre-order pieces ship on the date printed on the product page.' },
        ],
      },
      {
        question: 'Is shipping free?',
        blocks: [
          {
            type: 'p',
            text: 'Free everywhere in India, on every order. International shipping is calculated at checkout based on your address and weight.',
          },
        ],
      },
      {
        question: 'How do I track my order?',
        blocks: [
          {
            type: 'p',
            text: "You get a tracking link by email and on WhatsApp the moment the parcel is picked up. If it hasn't arrived within a few hours of the dispatch confirmation, check your spam folder, then write to us.",
          },
        ],
      },
      {
        question: 'Are there customs charges on international orders?',
        blocks: [
          {
            type: 'p',
            text: "Import duties and local taxes are set by your country and paid by you on delivery. We can't calculate them in advance. Your local customs office can give you the rate for apparel before you order.",
          },
          {
            type: 'p',
            text: "If a parcel is refused and sent back, we'll refund the product value once it reaches us, minus the shipping both ways.",
          },
        ],
      },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    items: [
      {
        question: 'How do I know my order went through?',
        blocks: [
          {
            type: 'p',
            text: 'A confirmation email lands within minutes, carrying an order number that looks like #SB-2481. No number, no order. If money left your account without one, send us a screenshot and we\'ll trace it same day.',
          },
        ],
      },
      {
        question: 'Can I change the size or address?',
        blocks: [
          {
            type: 'p',
            text: "Yes, as long as the order still shows as unfulfilled. Mail orders@spiritbeinggen.com with your order number and the change. Once the label is printed nothing can be edited.",
          },
        ],
      },
      {
        question: 'Can I cancel?',
        blocks: [
          {
            type: 'p',
            text: 'Cancellations are possible up to dispatch. After that the order is on its way and becomes an exchange instead.',
          },
        ],
      },
      {
        question: 'What payment methods work?',
        blocks: [
          {
            type: 'ul',
            items: [
              'UPI, credit and debit cards, net banking, and popular wallets.',
              'Cash on delivery across India on orders under ₹5,000.',
              'International cards and PayPal at checkout.',
            ],
          },
        ],
      },
      {
        question: "My discount code isn't applying.",
        blocks: [
          {
            type: 'p',
            text: "Codes go in the box on the checkout page, not the cart drawer, and only one runs per order. Drop codes expire when the drop closes. If it still refuses, send the code and we'll apply it manually.",
          },
        ],
      },
    ],
  },
  {
    id: 'exchanges',
    label: 'Exchanges',
    items: [
      {
        question: 'Can I exchange for another size?',
        blocks: [
          {
            type: 'p',
            text: "You have 7 days from delivery. Start the request from your order email, and we'll arrange a pickup wherever our courier reaches.",
          },
          {
            type: 'p',
            text: 'The piece has to come back unworn, unwashed, with tags on. Anything that fails the quality check is sent back to you.',
          },
        ],
      },
      {
        question: 'How long does an exchange take?',
        blocks: [
          {
            type: 'p',
            text: "Roughly 7 to 10 working days from the day the piece reaches our studio. You'll get a confirmation when it's checked, and a fresh tracking link when the replacement ships.",
          },
        ],
      },
      {
        question: 'Do you refund to my bank account?',
        blocks: [
          {
            type: 'p',
            text: 'Runs are small, so approved returns come back as store credit rather than cash. The credit never expires and works on any future drop.',
          },
          {
            type: 'p',
            text: 'Failed transactions are the exception. If money was taken and no order number was created, it reverses to your account in 5 to 7 working days.',
          },
        ],
      },
      {
        question: 'My piece arrived damaged or wrong.',
        blocks: [
          {
            type: 'p',
            text: "That one's on us. Mail orders@spiritbeinggen.com within 48 hours with your order number and photos of the issue. We recall the parcel and send the correct piece out at no cost.",
          },
        ],
      },
    ],
  },
];
