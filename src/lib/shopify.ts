import { Product, CartItem } from '../types';

interface ShopifyGraphQLResponse<T> {
  data: T;
  errors?: any[];
}

export async function fetchProductsFromShopify(
  domain: string,
  token: string,
  apiVersion: string
): Promise<Product[]> {
  const query = `
    query getProducts {
      products(first: 50) {
        edges {
          node {
            id
            handle
            title
            descriptionHtml
            description
            productType
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    // Basic formatting for the store domain (remove https:// if provided)
    const formattedDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    const response = await fetch(`https://${formattedDomain}/api/${apiVersion}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = (await response.json()) as ShopifyGraphQLResponse<any>;

    if (json.errors) {
      console.error('Shopify API Errors:', json.errors);
      throw new Error('Shopify API returned errors');
    }

    const rawProducts = json.data?.products?.edges || [];
    
    // Map Shopify product to our Product type
    return rawProducts.map(({ node }: any) => {
      const price = parseFloat(node.priceRange.minVariantPrice.amount);
      const images = node.images.edges.map((e: any) => e.node.url);
      const mainImage = images.length > 0 ? images[0] : 'https://placehold.co/600x800/f5f3f3/000?text=NO+IMAGE';
      
      const variants = node.variants.edges.map((e: any) => e.node);
      
      // We assume variant titles are sizes if they aren't "Default Title"
      const sizes = variants
        .map((v: any) => v.title)
        .filter((t: string) => t.toLowerCase() !== 'default title');

      const isAvailable = variants.some((v: any) => v.availableForSale);

      // We need a shopify variant ID map for checkout. 
      // The simplest way to handle size -> variant ID mapping is storing it on the product.
      // But for our generic cart, we'll map sizes back to variants during checkout creation.

      return {
        id: node.id,
        shopifyId: node.id,
        handle: node.handle,
        title: node.title,
        price: price,
        category: node.productType || 'Apparel',
        image: mainImage,
        additionalImages: images.slice(1),
        description: node.description,
        sizes: sizes.length > 0 ? sizes : ['ONE SIZE'],
        inStock: isAvailable,
        // We'll keep the raw variants array so we can find variant IDs for checkout
        shopifyVariants: variants,
      } as Product;
    });
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    return [];
  }
}

export async function createShopifyCheckout(
  domain: string,
  token: string,
  apiVersion: string,
  items: CartItem[]
): Promise<string | null> {
  // We need to map our cart items to Shopify variant IDs.
  // When we fetched products, we attached `shopifyVariants` (as an escape hatch).
  
  const lineItems = items.map(item => {
    // Find the variant matching the selected size
    let variantId = item.product.shopifyId; // Fallback to product ID (won't work for checkout but prevents crash)
    
    // Cast any to access the attached data
    const shopifyVariants = (item.product as any).shopifyVariants;
    if (shopifyVariants && shopifyVariants.length > 0) {
      const matchingVariant = shopifyVariants.find((v: any) => 
        v.title === item.selectedSize || 
        (item.selectedSize === 'ONE SIZE' && shopifyVariants.length === 1)
      );
      if (matchingVariant) {
        variantId = matchingVariant.id;
      } else {
        variantId = shopifyVariants[0].id;
      }
    }

    return {
      variantId,
      quantity: item.quantity
    };
  });

  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems
    }
  };

  try {
    const formattedDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    const response = await fetch(`https://${formattedDomain}/api/${apiVersion}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = (await response.json()) as ShopifyGraphQLResponse<any>;

    if (json.errors || json.data?.checkoutCreate?.checkoutUserErrors?.length > 0) {
      console.error('Shopify API Errors:', json.errors || json.data.checkoutCreate.checkoutUserErrors);
      return null;
    }

    return json.data.checkoutCreate.checkout.webUrl;
  } catch (error) {
    console.error('Error creating Shopify checkout:', error);
    return null;
  }
}
