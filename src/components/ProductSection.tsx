import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { SectionData, CategoryTab } from '../types';
import ProductCard from './ProductCard';
import { supabase } from '../lib/supabase';

interface ProductSectionProps {
  section: SectionData;
}

const accentBorderMap: Record<string, string> = {
  'calzado-blush': 'border-calzado-blush',
  'boutique-sand': 'border-boutique-sand',
  'atenea-lilac': 'border-atenea-lilac',
};

const accentBgLineMap: Record<string, string> = {
  'calzado-blush': 'bg-calzado-blush',
  'boutique-sand': 'bg-boutique-sand',
  'atenea-lilac': 'bg-atenea-lilac',
};

const accentBgTabMap: Record<string, string> = {
  'calzado-blush': 'bg-calzado-blush/10',
  'boutique-sand': 'bg-boutique-sand/10',
  'atenea-lilac': 'bg-atenea-lilac/10',
};

export default function ProductSection({ section }: ProductSectionProps) {
  const [categories, setCategories] = useState<CategoryTab[]>(section.categories);
  const [products, setProducts] = useState<any[]>(section.products || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt to fetch fresh data from Supabase
    async function loadProducts() {
      try {
        setLoading(true);
        // Map section.id to category_id
        const catId = section.id === 'calzado' ? 'calzado' : section.id === 'boutique' ? 'boutique' : 'joyeria';
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', catId);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedProducts = data.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            originalPrice: p.original_price,
            image: p.image,
            imageAlt: p.image_alt,
            sizes: p.sizes,
            badge: p.badge,
            variant: p.variant
          }));
          setProducts(formattedProducts);
        }
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, [section.id]);

  const handleCategoryClick = (index: number) => {
    setCategories(
      categories.map((cat, i) => ({
        ...cat,
        active: i === index,
      }))
    );
  };

  const isJoyeria = section.id === 'atenea';
  const gridClass = isJoyeria
    ? 'grid grid-cols-1 md:grid-cols-3 gap-grid-gutter md:gap-lg'
    : 'grid grid-cols-2 md:grid-cols-4 gap-grid-gutter md:gap-lg';

  return (
    <section
      className={`max-w-7xl mx-auto px-md md:px-lg relative ${isJoyeria ? 'pb-2xl' : ''}`}
      id={section.id}
    >
      {/* Accent top line */}
      <div className={`absolute top-0 left-0 w-full h-[3px] ${accentBgLineMap[section.accentColor]} opacity-90 rounded-t`} />

      {/* Header */}
      <div className="pt-xl pb-lg flex flex-col md:flex-row justify-between items-baseline gap-sm">
        <h2 className="font-headline-section-mobile md:font-headline-section text-headline-section-mobile md:text-headline-section text-primary tracking-wide">
          {section.title}
        </h2>
        <div className="w-full md:w-auto overflow-x-auto hide-scrollbar">
          <div className={`flex space-x-sm pb-2 md:pb-0 ${accentBgTabMap[section.accentColor]} px-sm py-xs rounded`}>
            {categories.map((cat, index) => (
              <span
                key={cat.label}
                className={`text-label-utility font-label-utility uppercase tracking-widest px-sm py-xs cursor-pointer transition-colors ${
                  cat.active
                    ? `text-primary border-b-2 ${accentBorderMap[section.accentColor]}`
                    : 'text-secondary hover:text-primary'
                }`}
                onClick={() => handleCategoryClick(index)}
              >
                {cat.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading && products.length === 0 ? (
        <div className="flex justify-center py-12 text-secondary">Actualizando catálogo...</div>
      ) : (
        <div className={gridClass}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              accentColor={section.accentColor}
              aspectRatio={section.aspectRatio}
            />
          ))}
        </div>
      )}

      {/* View Collection Button */}
      <div className="mt-lg flex justify-center">
        <Link 
          to={`/collection/${section.id}`} 
          className="bg-transparent text-primary border border-primary px-xl py-sm rounded hover:bg-surface-container transition-colors font-body-main text-body-main flex items-center gap-xs"
        >
          Ver toda la colección{' '}
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
