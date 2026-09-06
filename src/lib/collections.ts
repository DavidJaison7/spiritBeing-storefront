import { COLLECTIONS, COLLECTION_TAG_PREFIX } from '../data/collections';
import type { Collection, Product } from '../types';

export function getCollectionById(id: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.id === id);
}

export function getLiveCollections(): Collection[] {
  return COLLECTIONS.filter((c) => c.status === 'live').sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getMegaMenuCollections(): Collection[] {
  return [...COLLECTIONS].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Products belong to at most one editorial collection. */
export function getProductsByCollection(products: Product[], collectionId: string): Product[] {
  return products.filter((p) => p.collectionId === collectionId);
}

/**
 * Read collection id from Shopify product tags.
 * Tag format in Admin: sb-collection:essentials
 */
export function parseCollectionIdFromShopifyTags(tags: string[]): string | undefined {
  const match = tags.find((tag) => tag.startsWith(COLLECTION_TAG_PREFIX));
  if (!match) return undefined;
  let id = match.slice(COLLECTION_TAG_PREFIX.length).trim();
  // Legacy tag alias
  if (id === 'holy-ground') id = 'church-wear';
  return getCollectionById(id) ? id : undefined;
}

export function isValidCollectionId(id: string): boolean {
  return COLLECTIONS.some((c) => c.id === id);
}
