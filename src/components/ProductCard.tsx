import { useCart } from '../context/CartContext';
import type { Product, SectionAccentColor } from '../types';

interface ProductCardProps {
  product: Product;
  accentColor: SectionAccentColor;
  aspectRatio?: string;
}

const accentColorMap: Record<SectionAccentColor, string> = {
  'calzado-blush': 'hover:text-calzado-blush',
  'boutique-sand': 'hover:text-boutique-sand',
  'atenea-lilac': 'hover:text-atenea-lilac',
};

const accentBgMap: Record<SectionAccentColor, string> = {
  'calzado-blush': 'bg-calzado-blush',
  'boutique-sand': 'bg-boutique-sand',
  'atenea-lilac': 'bg-atenea-lilac',
};

function formatPrice(price: number): string {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function BadgeLabel({ badge }: { badge: Product['badge'] }) {
  if (!badge) return null;

  if (badge === 'oferta') {
    return (
      <div className="absolute top-sm left-sm z-10 bg-error-container border border-error text-error px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase shadow-sm">
        Oferta
      </div>
    );
  }

  const text = badge === 'nuevo' ? 'Nuevo' : 'Tendencia';
  return (
    <div className="absolute top-sm left-sm z-10 bg-surface-container-lowest border border-outline-variant text-primary px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase shadow-sm">
      {text}
    </div>
  );
}

export default function ProductCard({ product, accentColor, aspectRatio }: ProductCardProps) {
  const hoverColor = accentColorMap[accentColor];
  const { addToCart } = useCart();

  const handleAddToCart = (size?: string) => {
    // Si no hay talla seleccionada pero el producto tiene tallas, toma la primera disponible
    const selectedSize = size || product.sizes?.find(s => s.available)?.label;
    addToCart(product, selectedSize);
  };

  // === LARGE HIGHLIGHT VARIANT (Joyería featured) ===
  if (product.variant === 'large-highlight') {
    return (
      <article className="product-card group relative bg-surface flex flex-col border border-outline-variant/30 rounded-lg overflow-hidden md:col-span-2 md:row-span-2">
        <button
          className={`absolute top-sm right-sm z-10 text-secondary ${hoverColor} bg-surface-container-lowest/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          <span className="material-symbols-outlined text-[24px]">favorite</span>
        </button>
        <div className="aspect-square md:aspect-auto md:h-full bg-surface-container-low overflow-hidden relative">
          <img
            alt={product.imageAlt}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            src={product.image}
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-md bg-gradient-to-t from-black/60 to-transparent text-white">
          <h3 className="font-product-title text-[24px] mb-xs shadow-sm">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="font-price-active text-[20px] font-bold">{formatPrice(product.price)}</span>
            <button
              onClick={() => handleAddToCart()}
              className={`w-10 h-10 rounded-full ${accentBgMap[accentColor]} text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm hover:scale-105 active:scale-95`}
              title="Agregar al carrito"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  // === WIDE VARIANT (Calzado featured) ===
  if (product.variant === 'wide') {
    return (
      <article className="product-card group relative bg-surface flex flex-col border border-outline-variant/30 rounded-lg overflow-hidden md:col-span-2 md:flex-row">
        <BadgeLabel badge={product.badge} />
        <button
          className={`absolute top-sm right-sm z-10 text-secondary ${hoverColor} bg-surface-container-lowest/80 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          <span className="material-symbols-outlined text-[20px]">favorite</span>
        </button>
        <div className="aspect-square md:aspect-auto md:w-1/2 bg-surface-container-low overflow-hidden relative">
          <img
            alt={product.imageAlt}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            src={product.image}
          />
        </div>
        <div className="p-sm md:p-md flex flex-col flex-grow justify-center bg-surface-container-lowest md:w-1/2">
          <div>
            <h3 className="font-product-title text-product-title md:text-[22px] text-primary line-clamp-2 mb-xs md:mb-sm">
              {product.name}
            </h3>
            {product.description && (
              <p className="font-body-main text-[14px] text-secondary mb-md">{product.description}</p>
            )}
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="font-price-active text-[20px] font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={() => handleAddToCart()}
              className={`w-10 h-10 rounded-full ${accentBgMap[accentColor]} text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm hover:scale-105 active:scale-95`}
              title="Agregar al carrito"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  // === STANDARD VARIANT ===
  const aspect = aspectRatio === '3/4' ? 'aspect-[3/4]' : 'aspect-square';

  return (
    <article className="product-card group relative bg-surface flex flex-col border border-outline-variant/30 rounded-lg overflow-hidden transition-shadow hover:shadow-md">
      <BadgeLabel badge={product.badge} />
      <button
        className={`absolute top-sm right-sm z-10 text-secondary ${hoverColor} bg-surface-container-lowest/80 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity`}
      >
        <span className="material-symbols-outlined text-[20px]">favorite</span>
      </button>
      
      {/* Botón flotante de "Agregar rápido" en la imagen para pantallas grandes */}
      <div className="absolute inset-x-0 bottom-1/3 flex justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto">
        <button 
          onClick={() => handleAddToCart()}
          className="bg-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-[12px] uppercase tracking-wider hover:bg-primary shadow-lg pointer-events-auto transform translate-y-4 group-hover:translate-y-0 transition-all"
        >
          Agregar al Carrito
        </button>
      </div>

      <div className={`${aspect} bg-surface-container-low overflow-hidden relative`}>
        <img
          alt={product.imageAlt}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          src={product.image}
        />
      </div>
      <div className="p-sm flex flex-col flex-grow justify-between bg-surface-container-lowest z-20">
        <div>
          <h3 className="font-product-title text-product-title text-primary line-clamp-1 mb-xs">{product.name}</h3>
          {product.description && (
            <p className="font-body-main text-[13px] text-secondary line-clamp-1 mb-sm">{product.description}</p>
          )}
        </div>
        <div className={`flex items-center justify-between ${product.description ? '' : 'mt-sm'}`}>
          <div className={product.originalPrice ? 'flex flex-col' : ''}>
            <span className="font-price-active text-price-active text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-[12px] text-secondary line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          {product.sizes && product.sizes.length > 0 ? (
            <div className="flex space-x-1">
              {product.sizes.map((size) =>
                !size.available ? (
                  <div
                    key={size.label}
                    className="w-6 h-6 flex items-center justify-center rounded border border-outline-variant text-[10px] text-outline-variant line-through relative"
                    title="Agotado"
                  >
                    <span className="absolute inset-0 flex items-center justify-center">{size.label}</span>
                  </div>
                ) : (
                  <button
                    key={size.label}
                    onClick={() => handleAddToCart(size.label)}
                    title={`Agregar talla ${size.label} al carrito`}
                    className={`w-6 h-6 flex items-center justify-center rounded border border-outline-variant text-[10px] text-primary transition-colors hover:bg-primary hover:text-white hover:border-primary ${
                      size.highlighted ? 'bg-surface-variant' : ''
                    }`}
                  >
                    {size.label}
                  </button>
                )
              )}
            </div>
          ) : (
            /* Botón de agregar para items sin tallas explícitas (ej. Joyería) */
            <button 
              onClick={() => handleAddToCart()}
              className={`text-secondary ${hoverColor} transition-colors hover:scale-110`}
              title="Agregar al carrito"
            >
              <span className="material-symbols-outlined text-[24px]">add_shopping_cart</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
