import { Product } from '../types';
import heroImg from '../assets/images/hero_streetwear_editorial_1791204113530.jpg';
import hoodieImg from '../assets/images/product_heavy_hoodie_1791204137126.jpg';
import cargoImg from '../assets/images/product_cargo_trousers_1791204153639.jpg';
import bomberImg from '../assets/images/product_leather_bomber_1791204167728.jpg';
import sneakersImg from '../assets/images/product_street_sneakers_1791206271791.jpg';
import varsityImg from '../assets/images/product_varsity_jacket_1791206284661.jpg';
import graphicTeeImg from '../assets/images/product_graphic_tee_1791206297016.jpg';

export const HERO_IMAGE = heroImg;
export const DEFAULT_PLACEHOLDER_IMAGE = hoodieImg;

export const PRESET_IMAGES = [
  {
    label: 'Oversized Black Hoodie',
    url: hoodieImg,
  },
  {
    label: 'Graphic Street Tee',
    url: graphicTeeImg,
  },
  {
    label: 'Cargo Pants Olive',
    url: cargoImg,
  },
  {
    label: 'Varsity Jacket Black & Gold',
    url: varsityImg,
  },
  {
    label: 'Street Sneakers Lug Sole',
    url: sneakersImg,
  },
  {
    label: 'Denim / Flight Jacket',
    url: bomberImg,
  },
];

const STORAGE_KEY = 'marshall_products_v3';
const PRODUCTS_EVENT = 'marshall_products_updated';

// 12 Exact Demo Products requested
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Oversized Black Hoodie',
    price: 1299,
    image: hoodieImg,
    category: 'Hoodies',
    description: 'Heavyweight 480 GSM French Terry cotton hoodie with a double-layered structured hood, dropped shoulders, and relaxed boxy drape.',
    details: [
      '480 GSM custom French Terry cotton',
      'Dropped shoulder boxy silhouette',
      'Double-needle lockstitch seams',
      'Pumice stone wash treatment',
      'True oversized streetwear fit'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNewArrival: true,
    isFeatured: true,
    stock: 24,
    sku: 'MSW-HD-001',
    createdAt: '2026-10-01T10:00:00.000Z'
  },
  {
    id: 'prod-02',
    name: 'Graphic Street Tee',
    price: 799,
    image: graphicTeeImg,
    category: 'T-Shirts',
    description: '300 GSM combed cotton t-shirt with signature metallic gold typography screenprint. Thick non-stretch rib collar and blind-stitched cuffs.',
    details: [
      '300 GSM heavyweight jersey cotton',
      'Screenprinted metallic gold ink',
      'Thick 1.25" rib knit collar',
      'Pre-shrunk relaxed boxy cut',
      'Reinforced neck tape'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNewArrival: true,
    isFeatured: true,
    stock: 40,
    sku: 'MSW-TS-002',
    createdAt: '2026-10-01T12:00:00.000Z'
  },
  {
    id: 'prod-03',
    name: 'Cargo Pants Olive',
    price: 1499,
    image: cargoImg,
    category: 'Pants',
    description: 'Relaxed tactical cargo trousers in dark olive ripstop fabric. Features 6 functional accordion utility pockets and adjustable ankle drawcords.',
    details: [
      'Technical water-repellent ripstop cotton',
      'Dual gusseted 3D cargo pockets',
      'Adjustable bungee toggle cuffs',
      'Pleated knee articulation',
      'Matte black anodized hardware'
    ],
    sizes: ['30', '32', '34', '36'],
    isNewArrival: false,
    isFeatured: true,
    stock: 18,
    sku: 'MSW-PA-003',
    createdAt: '2026-09-28T14:30:00.000Z'
  },
  {
    id: 'prod-04',
    name: 'Denim Jacket Washed',
    price: 2199,
    image: bomberImg,
    category: 'Outerwear',
    description: '14oz rigid selvedge denim jacket finished with an artisan vintage wash. Heavy antique brass button closures and twin chest flap pockets.',
    details: [
      '14oz heavyweight washed denim',
      'Antique brass branded shanks',
      'Drop shoulder vintage box cut',
      'Double welt side hand pockets',
      'Adjustable waist tabs'
    ],
    sizes: ['M', 'L', 'XL'],
    isNewArrival: true,
    isFeatured: true,
    stock: 12,
    sku: 'MSW-OW-004',
    createdAt: '2026-10-02T16:00:00.000Z'
  },
  {
    id: 'prod-05',
    name: 'Urban Cap',
    price: 499,
    image: heroImg,
    category: 'Accessories',
    description: 'Structured 6-panel unstructured dad cap with curved brim, tonal front 3D embroidery, and an antique brass buckle slide strap.',
    details: [
      '100% heavy washed cotton twill',
      'High-density tonal 3D embroidery',
      'Adjustable metal clasp strapback',
      'Breathable embroidered eyelets',
      'Universal fit'
    ],
    sizes: ['ONE SIZE'],
    isNewArrival: false,
    isFeatured: false,
    stock: 50,
    sku: 'MSW-AC-005',
    createdAt: '2026-09-25T11:00:00.000Z'
  },
  {
    id: 'prod-06',
    name: 'Street Sneakers',
    price: 2499,
    image: sneakersImg,
    category: 'Footwear',
    description: 'High-end architectural chunky sneakers featuring a sculpted lugged commando outsole, premium box calf leather panels, and cushioned interior.',
    details: [
      'Full-grain leather and technical mesh upper',
      '50mm vulcanized commando lug sole',
      'High rebound EVA foam insole',
      'Reflective 3M heel pull tab',
      'Round waxed athletic laces'
    ],
    sizes: ['40', '41', '42', '43', '44'],
    isNewArrival: true,
    isFeatured: true,
    stock: 15,
    sku: 'MSW-FW-006',
    createdAt: '2026-10-03T10:00:00.000Z'
  },
  {
    id: 'prod-07',
    name: 'Flannel Shirt Red',
    price: 1199,
    image: heroImg,
    category: 'Outerwear',
    description: 'Brushed heavyweight cotton flannel shirt in signature red and black tartan check. Designed with a generous oversized overshirt silhouette.',
    details: [
      'Double-brushed 320 GSM cotton flannel',
      'Twin chest patch utility pockets',
      'Camp collar styling with curved hem',
      'Tortoiseshell button closures',
      'Thermal insulative weave'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNewArrival: false,
    isFeatured: false,
    stock: 22,
    sku: 'MSW-OW-007',
    createdAt: '2026-09-27T10:00:00.000Z'
  },
  {
    id: 'prod-08',
    name: 'Printed Hoodie Beige',
    price: 1399,
    image: hoodieImg,
    category: 'Hoodies',
    description: 'Warm oat beige hoodie constructed from 450 GSM fleece with high-density puff print detailing across the back and front kangaroo pocket.',
    details: [
      '450 GSM premium cotton-poly fleece',
      'High-density 3D puff print graphics',
      'Seamless crossover hood neckline',
      'Ribbed side expansion gussets',
      'Deep ergonomic kangaroo pouch'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNewArrival: true,
    isFeatured: true,
    stock: 26,
    sku: 'MSW-HD-008',
    createdAt: '2026-10-04T09:00:00.000Z'
  },
  {
    id: 'prod-09',
    name: 'Varsity Jacket',
    price: 2999,
    image: varsityImg,
    category: 'Outerwear',
    description: 'Heavyweight wool-blend varsity jacket with vegan leather contrast sleeves, chenille collegiate street patches, and quilted thermal cupro lining.',
    details: [
      'Heavy wool-blend body with leather sleeves',
      'Custom chenille embroidered patches',
      'High-density striped rib knit trims',
      'Snap-button front closure',
      'Interior zip chest security pocket'
    ],
    sizes: ['M', 'L', 'XL'],
    isNewArrival: true,
    isFeatured: true,
    stock: 9,
    sku: 'MSW-OW-009',
    createdAt: '2026-10-04T14:00:00.000Z'
  },
  {
    id: 'prod-10',
    name: 'Minimal White Tee',
    price: 699,
    image: graphicTeeImg,
    category: 'T-Shirts',
    description: 'Clean crisp optic white everyday essential t-shirt cut in a boxy relaxed fit from 260 GSM combed cotton with subtle tonal neck embroidery.',
    details: [
      '260 GSM single jersey combed cotton',
      'Pre-shrunk to maintain proportions',
      'Blind-hemmed sleeve and hem finish',
      'Subtle tonal Marshall embroidery at nape',
      'Ribbed crewneck collar'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNewArrival: false,
    isFeatured: false,
    stock: 55,
    sku: 'MSW-TS-010',
    createdAt: '2026-09-22T08:00:00.000Z'
  },
  {
    id: 'prod-11',
    name: 'Street Shorts',
    price: 899,
    image: cargoImg,
    category: 'Pants',
    description: 'Above-the-knee heavy French Terry sweat shorts with an elasticized waistband, long dipped drawcords, and deep zip-fastened pockets.',
    details: [
      '400 GSM custom cotton loopback terry',
      'Raw cut hem with reinforced stitch',
      'Extended thick braided drawstrings',
      'Concealed YKK zippered side pockets',
      'Relaxed dropped crotch fit'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNewArrival: false,
    isFeatured: true,
    stock: 35,
    sku: 'MSW-PA-011',
    createdAt: '2026-09-26T11:00:00.000Z'
  },
  {
    id: 'prod-12',
    name: 'Zip Hoodie Grey',
    price: 1499,
    image: hoodieImg,
    category: 'Hoodies',
    description: 'Heather grey heavyweight full-zip hoodie with industrial silver two-way zipper, thermal waffle-lined hood, and split front pouch pockets.',
    details: [
      '460 GSM heavyweight heather fleece',
      'Heavy-gauge #8 two-way silver metal zip',
      'Waffle-knit thermal hood lining',
      'Double-stitched kangaroo split pockets',
      'Relaxed vintage boxy cut'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNewArrival: true,
    isFeatured: true,
    stock: 20,
    sku: 'MSW-HD-012',
    createdAt: '2026-10-05T07:30:00.000Z'
  }
];

export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  } catch (err) {
    console.error('Failed to read products from localStorage:', err);
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent(PRODUCTS_EVENT, { detail: products }));
  } catch (err) {
    console.error('Failed to save products to localStorage:', err);
  }
}

export function getProductById(id: string): Product | undefined {
  const products = getStoredProducts();
  return products.find(p => p.id === id);
}

export function addProduct(newProductData: Omit<Product, 'id' | 'createdAt' | 'sku'> & { sku?: string }): Product {
  const products = getStoredProducts();
  const id = `prod-${Date.now()}`;
  const sku = newProductData.sku || `MSW-${newProductData.category.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  
  const product: Product = {
    ...newProductData,
    id,
    sku,
    createdAt: new Date().toISOString(),
  };

  const updated = [product, ...products];
  saveProducts(updated);
  return product;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;

  const updatedProduct = { ...products[index], ...updates };
  products[index] = updatedProduct;
  saveProducts([...products]);
  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  const products = getStoredProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

export function resetProducts(): Product[] {
  saveProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}

export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<Product[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredProducts());
    }
  };

  window.addEventListener(PRODUCTS_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(PRODUCTS_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
