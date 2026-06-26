import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductSection from '../components/ProductSection';
import FeaturesBanner from '../components/FeaturesBanner';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import Cart from '../components/Cart';
import { calzadoSection, boutiqueSection, joyeriaSection } from '../data/products';

export default function Storefront() {
  return (
    <div className="bg-background text-on-background font-body-main antialiased min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Spacer */}
        <div className="h-2xl" />

        {/* LU Calzado Section */}
        <ProductSection section={calzadoSection} />

        {/* Spacer */}
        <div className="h-2xl" />

        {/* LU Boutique Section */}
        <ProductSection section={boutiqueSection} />

        {/* Spacer */}
        <div className="h-2xl" />

        {/* Atenea Collection Section */}
        <ProductSection section={joyeriaSection} />
        
        {/* Spacer */}
        <div className="h-2xl" />
      </main>

      {/* Trust Signals Banner */}
      <FeaturesBanner />

      {/* Shopping Cart Drawer */}
      <Cart />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* Footer */}
      <Footer />
    </div>
  );
}
