export default function Hero() {
  return (
    <section className="relative w-full h-[520px] md:h-[600px] overflow-hidden">
      {/* Background Image (High Res Generated) */}
      <img
        alt="Editorial fashion collection"
        className="absolute inset-0 w-full h-full object-cover object-[right_center] z-0"
        src="/hero-bg.png"
      />
      
      {/* Floating Card (Efecto Post-it Realista) */}
      <div className="absolute left-6 md:left-24 top-1/2 -translate-y-1/2 w-[300px] md:w-[400px] p-8 md:p-12 bg-[#fffff8] shadow-[6px_12px_28px_rgba(0,0,0,0.12)] -rotate-2 hover:-rotate-1 transition-transform duration-300 z-10 flex flex-col border border-gray-100/60 rounded-sm before:content-[''] before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2 before:w-20 before:h-6 before:bg-white/50 before:backdrop-blur-sm before:border before:border-gray-200/50 before:shadow-sm before:rotate-[-2deg] before:z-20">
        
        <div className="w-8 h-[2px] bg-calzado-blush mb-4"></div>
        
        <span className="text-[10px] font-label-utility text-calzado-blush font-bold uppercase tracking-[0.2em] mb-4 block">
          ✦ ENVÍOS A TODO MÉXICO
        </span>
        
        <h1 className="font-display-lg italic font-bold text-primary text-[42px] md:text-[50px] leading-[1.05] mb-6 tracking-tight">
          Tu look<br />completo.<br />
          <span className="block mt-1 text-[32px] md:text-[38px] text-primary/90">En un solo lugar.</span>
        </h1>
        
        <p className="font-body-main text-secondary text-[13px] leading-[1.6] mb-8 pr-4">
          Calzado, ropa y joyería seleccionados para ti.
        </p>
        
        <a
          className="text-[11px] font-bold text-primary uppercase tracking-[0.15em] hover:text-calzado-blush transition-colors flex items-center gap-2"
          href="#calzado"
        >
          EXPLORAR COLECCIÓN <span className="text-[16px] font-normal">→</span>
        </a>
      </div>
    </section>
  );
}
