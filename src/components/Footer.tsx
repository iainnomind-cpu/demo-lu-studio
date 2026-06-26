import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const socialLinks = [
    { label: 'LU Calzado', handle: '@lu.calzado', accent: '#D4628A', href: '#' },
    { label: 'LU Boutique', handle: '@lu.boutique', accent: '#C9A882', href: '#' },
    { label: 'Atenea Collection', handle: '@atenea.collection', accent: '#B89EC4', href: '#' },
  ];

  return (
    <footer className="bg-[#1A1A1A] text-white w-full">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 pt-16 pb-12 grid grid-cols-1 md:grid-cols-12 gap-12">

        {/* Brand Column */}
        <div className="md:col-span-4 flex flex-col gap-5">
          <Link to="/" className="w-fit hover:opacity-80 transition-opacity">
            <Logo className="text-[38px]" dark />
          </Link>
          <p className="text-white/50 text-sm leading-relaxed max-w-[260px]">
            Tu destino para el look perfecto. Calzado, ropa y joyería seleccionados con estilo, desde Tamazula para todo México.
          </p>
          {/* WhatsApp CTA */}
          <a
            href="#"
            className="inline-flex items-center gap-2 mt-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-sm font-medium px-4 py-2.5 rounded-full w-fit transition-all duration-200"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Escríbenos en WhatsApp
          </a>
        </div>

        {/* Redes Sociales */}
        <div className="md:col-span-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 mb-6">Redes Sociales</h4>
          <div className="flex flex-col gap-4">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} className="flex items-center gap-3 group">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: s.accent + '22', border: `1px solid ${s.accent}44` }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={s.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill={s.accent} stroke="none"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">{s.label}</p>
                  <p className="text-xs" style={{ color: s.accent }}>{s.handle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div className="md:col-span-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 mb-6">Encuéntranos</h4>
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white/60 text-[18px]">location_on</span>
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Tamazula de Gordiano</p>
                <p className="text-white/40 text-xs mt-0.5">Jalisco, México</p>
              </div>
            </div>

            <a href="mailto:contacto@lustudio.mx" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-white/60 text-[18px]">mail</span>
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">Envíanos un correo</p>
                <p className="text-white/40 text-xs mt-0.5">contacto@lustudio.mx</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-white/30 text-xs tracking-wide">© 2024 LU Studio. Todos los derechos reservados.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-white/30 hover:text-white/60 text-xs transition-colors">Política de Privacidad</a>
          <a href="#" className="text-white/30 hover:text-white/60 text-xs transition-colors">Términos de Uso</a>
        </div>
      </div>
    </footer>
  );
}
