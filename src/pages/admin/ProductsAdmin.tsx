import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';

// Tallas predefinidas por categoría
const SHOE_SIZES = ['22', '23', '24', '25', '26', '27', '28'];
const CLOTHING_SIZES = ['XCH', 'CH', 'S', 'M', 'L', 'XL', 'XXL'];
const PANT_SIZES = ['26', '27', '28', '29', '30', '31', '32', '34'];

interface ProductForm {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category_id: string;
  badge: string;
  variant: string;
  selectedSizes: string[];
  imageFile: File | null;
  imagePreview: string;
  existingImage: string;
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  category_id: 'calzado',
  badge: '',
  variant: 'standard',
  selectedSizes: [],
  imageFile: null,
  imagePreview: '',
  existingImage: '',
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(title)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('Esto importará los productos locales a la base de datos. ¿Continuar?')) return;
    setLoading(true);
    try {
      const { calzadoSection, boutiqueSection, joyeriaSection } = await import('../../data/products');
      const categories = [
        { id: 'calzado', title: 'LU Calzado', accent_color: 'bg-calzado-blush' },
        { id: 'boutique', title: 'LU Boutique', accent_color: 'bg-boutique-sand' },
        { id: 'joyeria', title: 'Atenea Collection', accent_color: 'bg-atenea-lilac' },
      ];
      for (const cat of categories) {
        await supabase.from('categories').upsert(cat);
      }
      const allProducts = [
        ...calzadoSection.products.map(p => ({ ...p, category_id: 'calzado' })),
        ...boutiqueSection.products.map(p => ({ ...p, category_id: 'boutique' })),
        ...joyeriaSection.products.map(p => ({ ...p, category_id: 'joyeria' })),
      ];
      const productsToInsert = allProducts.map(p => ({
        id: p.id,
        category_id: p.category_id,
        name: p.name,
        description: p.description || '',
        price: p.price,
        original_price: p.originalPrice || null,
        image: p.image,
        image_alt: p.imageAlt,
        sizes: p.sizes || [],
        badge: p.badge || null,
        variant: p.variant || 'standard',
      }));
      await supabase.from('products').upsert(productsToInsert);
      alert('¡Productos importados correctamente!');
      fetchProducts();
    } catch (error) {
      console.error('Error seeding data', error);
      alert('Error importando datos. Revisa la consola.');
      setLoading(false);
    }
  };

  // Obtener las tallas disponibles según la categoría
  function getSizesForCategory(catId: string) {
    if (catId === 'calzado') return SHOE_SIZES;
    if (catId === 'boutique') return CLOTHING_SIZES;
    return []; // joyería no tiene tallas
  }

  function getSizeLabel(catId: string) {
    if (catId === 'calzado') return 'Números (Tallas)';
    if (catId === 'boutique') return 'Tallas de Ropa';
    return '';
  }

  const toggleSize = (size: string) => {
    setForm(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter(s => s !== size)
        : [...prev.selectedSizes, size],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const openEditForm = (product: any) => {
    setEditingId(product.id);
    const existingSizes = (product.sizes || []).map((s: any) => s.label);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price || ''),
      originalPrice: product.original_price ? String(product.original_price) : '',
      category_id: product.category_id || 'calzado',
      badge: product.badge || '',
      variant: product.variant || 'standard',
      selectedSizes: existingSizes,
      imageFile: null,
      imagePreview: '',
      existingImage: product.image || '',
    });
    setShowForm(true);
  };

  const openNewForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert('Nombre y precio son obligatorios.');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = form.existingImage;

      // Subir imagen si hay una nueva
      if (form.imageFile) {
        const fileExt = form.imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, form.imageFile);

        if (uploadError) {
          // Si el bucket no existe, usar URL pública de la imagen
          console.warn('No se pudo subir la imagen al storage. Usando URL local.', uploadError);
          // Crear un data URL como fallback
          imageUrl = form.imagePreview;
        } else {
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          imageUrl = urlData.publicUrl;
        }
      }

      // Construir las tallas en el formato que usa ProductCard
      const sizesArray = form.selectedSizes.map((label, i) => ({
        label,
        available: true,
        highlighted: i === 0,
      }));

      // Asegurar que TODAS las categorías existan en la BD
      const allCategories = [
        { id: 'calzado', title: 'LU Calzado', accent_color: 'bg-calzado-blush' },
        { id: 'boutique', title: 'LU Boutique', accent_color: 'bg-boutique-sand' },
        { id: 'joyeria', title: 'Atenea Collection', accent_color: 'bg-atenea-lilac' },
      ];
      for (const cat of allCategories) {
        await supabase.from('categories').upsert(cat);
      }

      // Auto-importar productos locales si la BD está vacía (primera vez)
      if (!editingId) {
        const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
        if (count === 0 || count === null) {
          try {
            const { calzadoSection, boutiqueSection, joyeriaSection } = await import('../../data/products');
            const localProducts = [
              ...calzadoSection.products.map(p => ({ ...p, category_id: 'calzado' })),
              ...boutiqueSection.products.map(p => ({ ...p, category_id: 'boutique' })),
              ...joyeriaSection.products.map(p => ({ ...p, category_id: 'joyeria' })),
            ];
            const toInsert = localProducts.map(p => ({
              id: p.id,
              category_id: p.category_id,
              name: p.name,
              description: p.description || '',
              price: p.price,
              original_price: p.originalPrice || null,
              image: p.image,
              image_alt: p.imageAlt,
              sizes: p.sizes || [],
              badge: p.badge || null,
              variant: p.variant || 'standard',
            }));
            await supabase.from('products').upsert(toInsert);
          } catch (seedErr) {
            console.warn('No se pudieron importar los productos locales:', seedErr);
          }
        }
      }

      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        original_price: form.originalPrice ? parseFloat(form.originalPrice) : null,
        category_id: form.category_id,
        image: imageUrl,
        image_alt: form.name,
        sizes: sizesArray,
        badge: form.badge || null,
        variant: form.variant,
      };

      if (editingId) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingId);
        if (error) throw error;
      } else {
        const newId = `${form.category_id}-${Date.now()}`;
        const { error } = await supabase.from('products').insert({ id: newId, ...productData });
        if (error) throw error;
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product', error);
      alert('Error al guardar el producto. Revisa la consola.');
    } finally {
      setSaving(false);
    }
  };

  const availableSizes = getSizesForCategory(form.category_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">Gestión de Productos</h2>
        <div className="flex gap-2">
          {products.length === 0 && (
            <button onClick={handleSeed} className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              <span>Importar Catálogo Inicial</span>
            </button>
          )}
          <button onClick={openNewForm} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* ===== FORMULARIO MODAL ===== */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Encabezado del formulario */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center z-10">
              <h3 className="text-lg font-bold text-primary">
                {editingId ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Imagen */}
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Imagen del Producto</label>
                <div
                  className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {(form.imagePreview || form.existingImage) ? (
                    <div className="relative">
                      <img
                        src={form.imagePreview || form.existingImage}
                        alt="Vista previa"
                        className="w-full max-h-[250px] object-contain rounded-lg mx-auto"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">Cambiar imagen</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8">
                      <span className="material-symbols-outlined text-[48px] text-outline-variant mb-2 block">add_photo_alternate</span>
                      <p className="text-secondary text-sm">Haz clic para seleccionar una imagen</p>
                      <p className="text-outline-variant text-xs mt-1">JPG, PNG o WebP (máx. 5MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Nombre del Producto *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Sandalia Minimalista Blush"
                  className="w-full border border-outline-variant rounded-md px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Descripción</label>
                <textarea
                  placeholder="Ej: Piel sintética premium con acabado mate"
                  className="w-full border border-outline-variant rounded-md px-4 py-3 h-20 resize-none text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Precio y Precio original (en fila) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Precio (MXN) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">$</span>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="899.00"
                      className="w-full border border-outline-variant rounded-md pl-8 pr-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Precio Original (Opcional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="1,200.00"
                      className="w-full border border-outline-variant rounded-md pl-8 pr-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      value={form.originalPrice}
                      onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                    />
                  </div>
                  <p className="text-xs text-secondary mt-1">Si tiene descuento, pon el precio original aquí.</p>
                </div>
              </div>

              {/* Categoría y Etiqueta (en fila) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Categoría *</label>
                  <select
                    className="w-full border border-outline-variant rounded-md px-4 py-3 text-primary bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    value={form.category_id}
                    onChange={e => setForm({ ...form, category_id: e.target.value, selectedSizes: [] })}
                  >
                    <option value="calzado">🥿 LU Calzado</option>
                    <option value="boutique">👗 LU Boutique</option>
                    <option value="joyeria">💎 Atenea Collection (Joyería)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Etiqueta</label>
                  <select
                    className="w-full border border-outline-variant rounded-md px-4 py-3 text-primary bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    value={form.badge}
                    onChange={e => setForm({ ...form, badge: e.target.value })}
                  >
                    <option value="">Sin etiqueta</option>
                    <option value="nuevo">🆕 Nuevo</option>
                    <option value="tendencia">🔥 Tendencia</option>
                    <option value="oferta">💰 Oferta</option>
                    <option value="exclusivo">⭐ Exclusivo</option>
                  </select>
                </div>
              </div>

              {/* Variante visual */}
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Estilo de Tarjeta</label>
                <div className="flex gap-3">
                  <label className={`flex-1 border-2 rounded-lg px-4 py-3 cursor-pointer flex items-center gap-2 transition-all ${form.variant === 'standard' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/30'}`}>
                    <input type="radio" name="variant" value="standard" checked={form.variant === 'standard'} onChange={e => setForm({ ...form, variant: e.target.value })} className="accent-primary" />
                    <div>
                      <span className="text-sm font-bold text-primary">Estándar</span>
                      <p className="text-xs text-secondary">Tarjeta normal con tallas</p>
                    </div>
                  </label>
                  <label className={`flex-1 border-2 rounded-lg px-4 py-3 cursor-pointer flex items-center gap-2 transition-all ${form.variant === 'wide' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/30'}`}>
                    <input type="radio" name="variant" value="wide" checked={form.variant === 'wide'} onChange={e => setForm({ ...form, variant: e.target.value })} className="accent-primary" />
                    <div>
                      <span className="text-sm font-bold text-primary">Destacado</span>
                      <p className="text-xs text-secondary">Tarjeta ancha sin tallas visibles</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tallas (dinámico según categoría) */}
              {availableSizes.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">{getSizeLabel(form.category_id)}</label>
                  <p className="text-xs text-secondary mb-3">Selecciona las tallas disponibles para este producto.</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`min-w-[48px] h-10 rounded-md border-2 text-sm font-bold transition-all ${
                          form.selectedSizes.includes(size)
                            ? 'border-primary bg-primary text-white'
                            : 'border-outline-variant text-secondary hover:border-primary/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {form.selectedSizes.length > 0 && (
                    <p className="text-xs text-secondary mt-2">
                      Seleccionadas: <span className="font-bold text-primary">{form.selectedSizes.join(', ')}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-outline-variant text-secondary py-3 rounded-md font-bold hover:bg-surface-container-lowest transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-white py-3 rounded-md font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">check</span>
                      {editingId ? 'Guardar Cambios' : 'Crear Producto'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== HEADER Y MÉTRICAS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-center">
          <span className="text-secondary text-sm font-bold">Total Productos</span>
          <span className="text-2xl font-bold text-primary">{products.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-center border-l-4 border-l-calzado-blush">
          <span className="text-secondary text-sm font-bold">LU Calzado</span>
          <span className="text-2xl font-bold text-primary">{products.filter(p => p.category_id === 'calzado').length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-center border-l-4 border-l-boutique-sand">
          <span className="text-secondary text-sm font-bold">LU Boutique</span>
          <span className="text-2xl font-bold text-primary">{products.filter(p => p.category_id === 'boutique').length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-center border-l-4 border-l-atenea-lilac">
          <span className="text-secondary text-sm font-bold">Atenea Collection</span>
          <span className="text-2xl font-bold text-primary">{products.filter(p => p.category_id === 'joyeria').length}</span>
        </div>
      </div>

      {/* ===== CONTROLES Y FILTROS ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex overflow-x-auto w-full sm:w-auto gap-2 pb-2 sm:pb-0 hide-scrollbar">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'all' ? 'bg-primary text-white' : 'bg-surface-container-lowest text-secondary hover:bg-outline-variant/20'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setActiveTab('calzado')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'calzado' ? 'bg-calzado-blush text-primary' : 'bg-surface-container-lowest text-secondary hover:bg-outline-variant/20'}`}
          >
            🥿 Calzado
          </button>
          <button 
            onClick={() => setActiveTab('boutique')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'boutique' ? 'bg-boutique-sand text-primary' : 'bg-surface-container-lowest text-secondary hover:bg-outline-variant/20'}`}
          >
            👗 Boutique
          </button>
          <button 
            onClick={() => setActiveTab('joyeria')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'joyeria' ? 'bg-atenea-lilac text-primary' : 'bg-surface-container-lowest text-secondary hover:bg-outline-variant/20'}`}
          >
            💎 Joyería
          </button>
        </div>
        
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
          <input 
            type="text" 
            placeholder="Buscar producto..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* ===== TABLA DE PRODUCTOS ===== */}
      <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/30 text-sm font-bold text-secondary uppercase tracking-wider">
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Tallas</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-secondary">Cargando...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-secondary">No hay productos registrados aún.</td></tr>
              ) : (() => {
                const filteredProducts = products.filter(p => {
                  const matchesTab = activeTab === 'all' || p.category_id === activeTab;
                  const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchesTab && matchesSearch;
                });

                if (filteredProducts.length === 0) {
                  return <tr><td colSpan={5} className="p-8 text-center text-secondary">No se encontraron productos con estos filtros.</td></tr>;
                }

                return filteredProducts.map(product => (
                  <tr key={product.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md object-cover bg-surface-container-low flex-shrink-0 shadow-sm" />
                        <div>
                          <span className="font-bold text-primary block">{product.name}</span>
                          {product.badge && (
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1 inline-block">{product.badge}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-secondary text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product.category_id === 'calzado' ? 'bg-calzado-blush text-primary' : 
                        product.category_id === 'boutique' ? 'bg-boutique-sand text-primary' : 
                        'bg-atenea-lilac text-primary'
                      }`}>
                        {product.categories?.title || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-secondary">
                      {product.sizes && product.sizes.length > 0
                        ? <div className="flex flex-wrap gap-1">
                            {product.sizes.map((s: any) => (
                              <span key={s.label} className="border border-outline-variant/50 px-1.5 py-0.5 rounded text-xs">{s.label}</span>
                            ))}
                          </div>
                        : '—'}
                    </td>
                    <td className="p-4 font-bold text-primary">
                      ${product.price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      {product.original_price && (
                        <span className="block text-xs text-secondary line-through font-normal">
                          ${product.original_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEditForm(product)} className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Editar">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="w-8 h-8 flex items-center justify-center text-error hover:bg-error/10 rounded-md transition-colors" title="Eliminar">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
