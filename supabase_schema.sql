-- Esquema de base de datos para LU Fashion Hub

-- 1. Categorías
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Productos
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  sizes JSONB DEFAULT '[]'::jsonb, -- Array de { label: "23", available: true, highlighted: false }
  badge TEXT, -- 'nuevo', 'tendencia', 'oferta', null
  variant TEXT DEFAULT 'standard', -- 'standard', 'wide', 'large-highlight'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Clientes (CRM)
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Pedidos (Orders)
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'shipped', 'delivered', 'cancelled'
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Items del Pedido
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  size TEXT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Habilitar RLS (Seguridad)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (Cualquiera puede leer productos y categorías)
CREATE POLICY "Lectura pública de categorías" ON categories FOR SELECT USING (true);
CREATE POLICY "Lectura pública de productos" ON products FOR SELECT USING (true);

-- Políticas de escritura/lectura protegida (Solo admin logueado)
-- Nota: Para escribir, el usuario debe estar autenticado en Supabase Auth.
CREATE POLICY "Admins pueden hacer todo en categorias" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins pueden hacer todo en productos" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins pueden hacer todo en customers" ON customers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins pueden hacer todo en orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins pueden hacer todo en order_items" ON order_items FOR ALL USING (auth.role() = 'authenticated');

-- Permitir a usuarios anónimos CREAR pedidos y clientes (Checkout)
CREATE POLICY "Cualquiera puede insertar clientes" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Cualquiera puede insertar pedidos" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Cualquiera puede insertar items de pedido" ON order_items FOR INSERT WITH CHECK (true);
