import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const navItems = [
  { href: '#calzado', label: 'Calzado', accent: '#D4628A', icon: '✦' },
  { href: '#boutique', label: 'Boutique', accent: '#C9A882', icon: '✦' },
  { href: '#atenea', label: 'Atenea', accent: '#B89EC4', icon: '✦' },
  { href: '#locales', label: 'Locales', accent: '#666', icon: '◇' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { setIsCartOpen, cartCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <div className="top-0 sticky z-50 w-full">
      {/* ═══ Announcement Bar ═══ */}
      {announcementVisible && (
        <div className="bg-[#1A1A1A] text-white overflow-hidden relative">
          <div className="py-2.5 flex items-center h-full">
            <div className="animate-marquee inline-flex items-center gap-3 px-12 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase">
              <span className="text-[#D4628A] animate-pulse">✦</span>
              <span className="whitespace-nowrap">Envíos gratis en pedidos mayores a $1,500 MXN</span>
              <span className="hidden md:inline text-white/20">|</span>
              <span className="hidden md:inline whitespace-nowrap text-white/70">Todo México</span>
              <span className="text-[#C9A882]">✦</span>
            </div>
          </div>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[12px] text-white/40 hover:text-white/80">close</span>
          </button>
          {/* Shimmer accent */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4628A]/40 to-transparent" />
        </div>
      )}

      {/* ═══ Main Header ═══ */}
      <header
        className={`w-full transition-all duration-500 ease-out relative ${
          scrolled
            ? 'bg-white/95 backdrop-blur-2xl shadow-[0_1px_20px_rgba(0,0,0,0.06)]'
            : 'bg-white/80 backdrop-blur-lg'
        }`}
      >
        <div className="flex items-center justify-between px-5 md:px-10 w-full max-w-7xl mx-auto h-[64px] md:h-[72px]">
          
          {/* Mobile Menu Trigger */}
          <button
            className="md:hidden text-primary hover:opacity-70 transition-opacity"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          {/* Brand Logo */}
          <Link className="flex-1 md:flex-none flex justify-center md:justify-start group" to="/">
            <div className="transition-all duration-300 group-hover:scale-[1.02]">
              <Logo className="text-[28px] md:text-[34px]" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-[12px] font-semibold tracking-[0.08em] uppercase transition-all duration-250 group"
                style={{ color: hoveredNav === item.href ? item.accent : '#777' }}
                onMouseEnter={() => setHoveredNav(item.href)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                {item.label}
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: item.accent,
                    width: hoveredNav === item.href ? '70%' : '0%',
                  }}
                />
              </a>
            ))}
          </nav>

          {/* Trailing Icons */}
          <div className="flex items-center gap-0.5 text-[#1A1A1A]">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors group">
              <span className="material-symbols-outlined text-[20px] text-[#555] group-hover:text-[#1A1A1A] transition-colors">search</span>
            </button>

            <button className="w-10 h-10 hidden md:flex items-center justify-center rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors group">
              <span className="material-symbols-outlined text-[20px] text-[#555] group-hover:text-[#D4628A] transition-colors">favorite_border</span>
            </button>

            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 active:bg-black/10 transition-colors relative group"
              onClick={() => setIsCartOpen(true)}
            >
              <span className="material-symbols-outlined text-[20px] text-[#555] group-hover:text-[#1A1A1A] transition-colors">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-[16px] bg-[#D4628A] text-white text-[8px] font-bold flex items-center justify-center rounded-full ring-2 ring-white px-0.5 animate-[scaleIn_0.2s_ease-out]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 w-full h-[1px]">
          <div className={`h-full bg-gradient-to-r from-transparent via-black/[0.06] to-transparent transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-40'}`} />
        </div>
      </header>

      {/* ═══ Mobile Drawer ═══ */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${mobileMenuOpen ? 'visible' : 'invisible'}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        {/* Backdrop */}
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} />

        {/* Drawer Panel */}
        <nav
          className={`absolute top-0 left-0 h-full w-[300px] bg-white flex flex-col shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="h-[72px] px-6 flex items-center justify-between border-b border-gray-100/80">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Logo className="text-[26px]" />
            </Link>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-[18px] text-[#999]">close</span>
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 flex flex-col py-3 px-4 overflow-y-auto">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#BBB] px-3 mt-4 mb-3">Colecciones</p>
            {navItems.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3.5 px-3 py-3.5 rounded-xl text-[#333] font-medium text-[15px] hover:bg-gray-50 transition-all duration-200 group"
                style={{
                  transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  opacity: mobileMenuOpen ? 1 : 0,
                  transition: `transform 400ms ${150 + i * 60}ms cubic-bezier(0.32,0.72,0,1), opacity 300ms ${150 + i * 60}ms ease`,
                }}
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: item.accent + '18', color: item.accent }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                <span className="material-symbols-outlined text-[16px] text-[#CCC] ml-auto group-hover:text-[#999] group-hover:translate-x-0.5 transition-all">chevron_right</span>
              </a>
            ))}

            {/* Divider */}
            <div className="h-px bg-gray-100 my-4 mx-3" />

            {/* Secondary links */}
            <a href="#" className="flex items-center gap-3.5 px-3 py-3 rounded-xl text-[#777] text-[14px] hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">favorite_border</span>
              Favoritos
            </a>
            <a href="#" className="flex items-center gap-3.5 px-3 py-3 rounded-xl text-[#777] text-[14px] hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              Rastrear Pedido
            </a>
          </div>

          {/* Drawer Footer */}
          <div className="p-5 border-t border-gray-100/80 bg-gray-50/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#333]">¿Necesitas ayuda?</p>
                <p className="text-[11px] text-[#999]">Escríbenos por WhatsApp</p>
              </div>
            </div>
            <p className="text-[10px] text-[#BBB] tracking-wider text-center">Tamazula de Gordiano · Jalisco, México</p>
          </div>
        </nav>
      </div>
    </div>
  );
}
