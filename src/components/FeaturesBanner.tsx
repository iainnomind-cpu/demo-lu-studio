export default function FeaturesBanner() {
  const features = [
    {
      icon: 'local_shipping',
      title: 'Envíos a todo México',
      description: 'Recibe tus compras en la puerta de tu casa de forma rápida y segura.',
    },
    {
      icon: 'verified_user',
      title: 'Compra 100% Segura',
      description: 'Tus datos están protegidos con la más alta seguridad en cada transacción.',
    },
    {
      icon: 'cached',
      title: 'Cambios Garantizados',
      description: '¿No te quedó? Tienes hasta 15 días para realizar cambios de talla o modelo.',
    },
    {
      icon: 'support_agent',
      title: 'Atención Personalizada',
      description: 'Estamos contigo en cada paso. Escríbenos si necesitas asesoría.',
    },
  ];

  return (
    <section className="py-xl px-lg w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-sm group">
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <span className="material-symbols-outlined text-[32px]">{feature.icon}</span>
            </div>
            <h3 className="font-product-title text-[18px] text-primary">{feature.title}</h3>
            <p className="font-body-main text-[14px] text-secondary leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
