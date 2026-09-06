import type { Collection } from '../types';

/**
 * Editorial collection catalog (presentation layer).
 *
 * Inventory lives in Shopify. Assign each product to ONE collection via Admin tag:
 *   sb-collection:essentials
 *   sb-collection:bible
 *   sb-collection:church-wear
 *   … (id must match `Collection.id` below)
 */
export const COLLECTIONS: Collection[] = [
  {
    id: 'essentials',
    title: 'Spiritbeing Essentials',
    tagline: 'Core pieces for every day.',
    description: 'Logo-centric, high comfort. Everyday spirit-being staples.',
    status: 'live',
    heroImage: '/assets/Collections/webp/essentials.webp',
    megaMenuImage: '/assets/Collections/webp/essentials.webp',
    megaMenuTileClass: 't-essentials',
    sortOrder: 1,
    shopifyTag: 'sb-collection:essentials',
  },
  {
    id: 'bible',
    title: 'Bible Basics',
    tagline: 'Scripture as typography on plain garments.',
    description: 'Word-forward tees built for daily wear and quiet conviction.',
    status: 'live',
    heroImage: '/assets/Collections/webp/bible-basics.webp',
    megaMenuImage: '/assets/Collections/webp/bible-basics.webp',
    megaMenuTileClass: 't-bible',
    sortOrder: 2,
    shopifyTag: 'sb-collection:bible',
  },
  {
    id: 'little',
    title: 'Little Beings',
    tagline: 'Kids. Nurturing little spirit beings.',
    description: 'Soft, bold pieces for the next generation of spirit beings.',
    status: 'coming-soon',
    heroImage: '/assets/Collections/webp/little-beings.webp',
    megaMenuImage: '/assets/Collections/webp/little-beings.webp',
    megaMenuTileClass: 't-little',
    sortOrder: 3,
    shopifyTag: 'sb-collection:little',
  },
  {
    id: 'nomad',
    title: 'Nomad Beings',
    tagline: 'Travel. “spiritual nomad”.',
    description: 'Road-ready fits for believers on the move.',
    status: 'coming-soon',
    heroImage: '/assets/Collections/webp/nomad-beings.webp',
    megaMenuImage: '/assets/Collections/webp/nomad-beings.webp',
    megaMenuTileClass: 't-nomad',
    sortOrder: 4,
    shopifyTag: 'sb-collection:nomad',
  },
  {
    id: 'armoured',
    title: 'Armoured Beings',
    tagline: 'Gym & performance. Armour of God.',
    description: 'Performance-minded pieces rooted in Ephesians 6.',
    status: 'coming-soon',
    heroImage: '/assets/Collections/webp/armoured-beings.webp',
    megaMenuImage: '/assets/Collections/webp/armoured-beings.webp',
    megaMenuTileClass: 't-armoured',
    sortOrder: 5,
    shopifyTag: 'sb-collection:armoured',
  },
  {
    id: 'books',
    title: 'The Book Series',
    tagline: 'A design style featured across every collection drop.',
    description: 'Psalms, Proverbs, Isaiah — typography systems from Scripture.',
    status: 'coming-soon',
    heroImage: '/assets/Collections/webp/book-series.webp',
    megaMenuImage: '/assets/Collections/webp/book-series.webp',
    megaMenuTileClass: 't-books',
    sortOrder: 6,
    shopifyTag: 'sb-collection:books',
    isBlueTile: true,
    chips: ['Psalms', 'Proverbs', 'Isaiah'],
  },
  {
    id: 'church-wear',
    title: 'Church Wear',
    tagline: 'Yahweh hoodies. Pew to pavement.',
    description:
      'Church-ready hoodies and pieces for worship, fellowship, and everyday faith — sacred spaces meet streetwear.',
    status: 'coming-soon',
    heroImage: '/assets/Collections/webp/holy-ground.png',
    megaMenuImage: '/assets/Collections/webp/holy-ground.png',
    megaMenuTileClass: 't-church',
    sortOrder: 7,
    shopifyTag: 'sb-collection:church-wear',
  },
];

export const COLLECTION_TAG_PREFIX = 'sb-collection:';
