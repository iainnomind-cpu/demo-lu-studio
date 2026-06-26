export interface ProductSize {
  label: string;
  available: boolean;
  highlighted?: boolean;
}

export type ProductBadge = 'nuevo' | 'tendencia' | 'oferta' | null;

export type ProductVariant = 'standard' | 'wide' | 'large-highlight';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageAlt: string;
  sizes: ProductSize[];
  badge: ProductBadge;
  variant: ProductVariant;
}

export interface CartItem extends Product {
  cartItemId: string; // Unique ID for cart item (in case same product added with different sizes)
  selectedSize?: string;
  quantity: number;
}

export type SectionAccentColor = 'calzado-blush' | 'boutique-sand' | 'atenea-lilac';

export interface CategoryTab {
  label: string;
  active: boolean;
}

export interface SectionData {
  id: string;
  title: string;
  accentColor: SectionAccentColor;
  categories: CategoryTab[];
  products: Product[];
  aspectRatio?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  hoverColor: string;
}
