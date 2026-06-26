import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import WhatsAppButton from '../components/WhatsAppButton';
import Cart from '../components/Cart';
import type { SectionAccentColor } from '../types';

export default function Collection() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mapeamos el id de la URL al id real de la categoría en Supabase si difieren
  const categoryId = id === 'atenea' ? 'joyeria' : id;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    async function fetchCollection() {
      try {
        setLoading(true);
        
        // 1. Fetch category info
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .single();
          
        if (catError) {
          console.warn('Categoría no encontrada en BD, usando datos por defecto.');
          // Fallback en caso de que la BD esté vacía o no se haya hecho el "Seed"
          const fallbackTitles: Record<string, string> = {
            'calzado': 'LU Calzado',
            'boutique': 'LU Boutique',
            'joyeria': 'Atenea Collection'
          };
          setCategory({ id: categoryId, title: fallbackTitles[categoryId as string] || 'Colección' });
        } else {
          setCategory(catData);
        }

        // 2. Fetch products for this category
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId);

        if (prodError) throw prodError;

        if (prodData && prodData.length > 0) {
          const formattedProducts = prodData.map(p => ({
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
        } else {
          // Fallback a los datos locales si la BD está vacía
          const localData = await import('../data/products');
          let localProducts: any[] = [];
          if (categoryId === 'calzado') localProducts = localData.calzadoSection.products;
          if (categoryId === 'boutique') localProducts = localData.boutiqueSection.products;
          if (categoryId === 'joyeria') localProducts = localData.joyeriaSection.products;
          setProducts(localProducts);
        }
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    }

    if (categoryId) {
      fetchCollection();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex justify-center items-center">
          <p className="text-secondary text-lg">Cargando colección...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col justify-center items-center space-y-4">
          <h2 className="font-display-lg text-2xl text-primary">Colección no encontrada</h2>
          <Link to="/" className="text-secondary underline hover:text-primary">Volver al inicio</Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Estilos basados en la categoría
  const accentColorMap: Record<string, SectionAccentColor> = {
    'calzado': 'calzado-blush',
    'boutique': 'boutique-sand',
    'joyeria': 'atenea-lilac'
  };
  const accentColor: SectionAccentColor = accentColorMap[categoryId || 'calzado'] || 'calzado-blush';
  const isJoyeria = categoryId === 'joyeria';
  const gridClass = isJoyeria
    ? 'grid grid-cols-1 md:grid-cols-3 gap-grid-gutter md:gap-lg'
    : 'grid grid-cols-2 md:grid-cols-4 gap-grid-gutter md:gap-lg';

  return (
    <div className="bg-background text-on-background font-body-main antialiased min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Banner de Colección */}
        <div className="w-full bg-surface-container-lowest border-b border-outline-variant/30 py-24 px-lg text-center relative overflow-hidden">
           {/* Fondo difuminado decorativo */}
           <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-${accentColor}/20 rounded-full blur-[100px] -z-10 opacity-50`}></div>
           
           <h1 className="font-display-lg text-[40px] md:text-[56px] text-primary relative z-10">{category.title}</h1>
           <p className="font-body-main text-secondary mt-4 max-w-[600px] mx-auto relative z-10">
             Explora nuestra colección completa. Piezas seleccionadas cuidadosamente para resaltar tu estilo único.
           </p>
        </div>

        {/* Grid de Productos */}
        <div className="max-w-7xl mx-auto px-lg py-16">
          <div className="mb-8 flex justify-between items-center text-sm text-secondary">
             <span>Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}</span>
             {/* Aquí se podría agregar un select para ordenar */}
          </div>
          
          {products.length === 0 ? (
            <div className="py-20 text-center text-secondary border border-dashed border-outline-variant rounded-md">
              Aún no hay productos en esta colección.
            </div>
          ) : (
            <div className={gridClass}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  accentColor={accentColor}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Cart />
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
