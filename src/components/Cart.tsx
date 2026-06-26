import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { calzadoSection, boutiqueSection } from '../data/products';

type CheckoutStep = 'cart' | 'info' | 'payment' | 'success';

export default function Cart() {
  const { isCartOpen, setIsCartOpen, cartItems, addToCart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
    address: '',
    notes: '',
    howFound: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  });

  if (!isCartOpen) return null;

  const formatPrice = (price: number) =>
    `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const shippingCost = cartTotal >= 1500 ? 0 : 149;
  const grandTotal = cartTotal + shippingCost;

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      // 1. Buscar cliente existente por email o crear uno nuevo
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', formData.email)
        .single();

      let customerId: string;

      if (existingCustomer) {
        // Actualizar datos del cliente existente
        await supabase.from('customers').update({
          full_name: formData.fullName,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state} C.P. ${formData.zipCode}`,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          notes: formData.notes,
          how_found: formData.howFound,
        }).eq('id', existingCustomer.id);
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.address}, ${formData.city}, ${formData.state} C.P. ${formData.zipCode}`,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            notes: formData.notes,
            how_found: formData.howFound,
          })
          .select()
          .single();
        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // 2. Crear Orden
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          total: grandTotal,
          subtotal: cartTotal,
          shipping: shippingCost,
          status: 'pending',
          payment_method: 'simulated_card',
          notes: formData.notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Insertar Items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        size: item.selectedSize || null,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      setOrderId(orderData.id.split('-')[0].toUpperCase());
      setStep('success');
      clearCart();
    } catch (error) {
      console.error('Error processing order', error);
      alert('Hubo un error al procesar tu pedido. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAll = () => {
    setStep('cart');
    setIsCartOpen(false);
    setFormData({ fullName: '', email: '', phone: '', city: '', state: '', zipCode: '', address: '', notes: '', howFound: '', cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '' });
  };

  // Sugerencias
  const allProducts = [...calzadoSection.products, ...boutiqueSection.products];
  const recommendedProducts = allProducts
    .filter(p => !cartItems.some(item => item.id === p.id))
    .slice(0, 2);

  const stepTitles: Record<CheckoutStep, string> = {
    cart: 'Tu Carrito',
    info: 'Información de Envío',
    payment: 'Método de Pago',
    success: '¡Pedido Confirmado!',
  };

  // Validación por paso
  const canGoToPayment = formData.fullName && formData.email && formData.phone && formData.address && formData.city && formData.state && formData.zipCode;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={closeAll}
      ></div>

      <div className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-surface shadow-2xl z-[70] flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {step !== 'cart' && step !== 'success' && (
              <button
                onClick={() => setStep(step === 'payment' ? 'info' : 'cart')}
                className="text-secondary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            )}
            <h2 className="font-product-title text-[22px] text-primary">{stepTitles[step]}</h2>
          </div>
          <button onClick={closeAll} className="text-secondary hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Progress bar */}
        {step !== 'cart' && step !== 'success' && (
          <div className="px-lg pt-4 pb-2">
            <div className="flex gap-2">
              <div className={`h-1 flex-1 rounded-full ${step === 'info' || step === 'payment' ? 'bg-primary' : 'bg-outline-variant/30'}`}></div>
              <div className={`h-1 flex-1 rounded-full ${step === 'payment' ? 'bg-primary' : 'bg-outline-variant/30'}`}></div>
            </div>
            <div className="flex justify-between text-[11px] text-secondary mt-1">
              <span>Datos</span>
              <span>Pago</span>
            </div>
          </div>
        )}

        {/* ====== STEP: CARRITO ====== */}
        {step === 'cart' && (
          <div className="flex-1 overflow-y-auto p-lg">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-md">
                <span className="material-symbols-outlined text-[64px] text-outline-variant">shopping_bag</span>
                <p className="font-body-main text-secondary">Tu carrito está vacío.</p>
                {recommendedProducts.length > 0 && (
                  <div className="mt-xl w-full text-left border-t border-outline-variant/30 pt-lg">
                    <h3 className="font-product-title text-[16px] text-primary mb-md">Sugerencias para ti</h3>
                    <div className="space-y-md">
                      {recommendedProducts.map(product => (
                        <div key={product.id} className="flex gap-md items-center text-left">
                          <img src={product.image} className="w-16 h-16 rounded-md object-cover bg-surface-container-low" />
                          <div className="flex-1">
                            <h4 className="font-product-title text-[14px] text-primary line-clamp-1">{product.name}</h4>
                            <span className="font-price-active font-bold text-[14px] text-primary">{formatPrice(product.price)}</span>
                          </div>
                          <button onClick={() => addToCart(product, product.sizes?.[0]?.label)} className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col min-h-full">
                <div className="space-y-lg mb-xl">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="flex gap-md border-b border-outline-variant/20 pb-md last:border-0">
                      <div className="w-20 h-20 bg-surface-container-low rounded-md overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.imageAlt} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-product-title text-[15px] text-primary line-clamp-1">{item.name}</h3>
                            {item.selectedSize && <p className="text-[12px] text-secondary">Talla: {item.selectedSize}</p>}
                          </div>
                          <button onClick={() => removeFromCart(item.cartItemId)} className="text-red-400 hover:text-red-600">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                        </div>
                        <div className="mt-auto flex justify-between items-center">
                          <div className="flex items-center border border-outline-variant rounded-md">
                            <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="px-2 py-1 text-secondary">−</button>
                            <span className="px-2 w-8 text-center text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="px-2 py-1 text-secondary">+</button>
                          </div>
                          <span className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {recommendedProducts.length > 0 && (
                  <div className="mt-auto pt-lg border-t border-outline-variant/30">
                    <h3 className="font-product-title text-[15px] text-primary mb-md">Completa tu look</h3>
                    <div className="space-y-md">
                      {recommendedProducts.map(product => (
                        <div key={product.id} className="flex gap-md items-center">
                          <img src={product.image} className="w-14 h-14 rounded-md object-cover bg-surface-container-low" />
                          <div className="flex-1">
                            <h4 className="font-product-title text-[13px] text-primary line-clamp-1">{product.name}</h4>
                            <span className="font-bold text-[13px] text-primary">{formatPrice(product.price)}</span>
                          </div>
                          <button onClick={() => addToCart(product, product.sizes?.[0]?.label)} className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ====== STEP: DATOS DEL CLIENTE ====== */}
        {step === 'info' && (
          <div className="flex-1 overflow-y-auto p-lg space-y-5">
            <div>
              <label className="block text-sm font-bold text-primary mb-1">Nombre Completo *</label>
              <input required type="text" placeholder="María López García"
                className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Correo Electrónico *</label>
                <input required type="email" placeholder="tu@correo.com"
                  className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Teléfono / WhatsApp *</label>
                <input required type="tel" placeholder="33 1234 5678"
                  className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-1">Dirección de Envío *</label>
              <input required type="text" placeholder="Calle, Número, Colonia"
                className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Ciudad *</label>
                <input required type="text" placeholder="Tamazula"
                  className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Estado *</label>
                <input required type="text" placeholder="Jalisco"
                  className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-1">C.P. *</label>
                <input required type="text" placeholder="49650"
                  className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-1">¿Cómo nos encontraste?</label>
              <select
                className="w-full border border-outline-variant rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                value={formData.howFound} onChange={e => setFormData({...formData, howFound: e.target.value})}
              >
                <option value="">Selecciona una opción</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="google">Google</option>
                <option value="recomendacion">Recomendación</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-primary mb-1">Notas del Pedido (Opcional)</label>
              <textarea placeholder="Ej: Entregar después de las 3pm, es un regalo, etc."
                className="w-full border border-outline-variant rounded-md px-4 py-3 h-16 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </div>

            {/* Botón continuar */}
            <button
              onClick={() => canGoToPayment && setStep('payment')}
              disabled={!canGoToPayment}
              className="w-full bg-primary text-white py-3 rounded-md font-bold uppercase tracking-widest disabled:opacity-40 hover:bg-primary/90 transition-colors mt-2"
            >
              Continuar al Pago
            </button>
          </div>
        )}

        {/* ====== STEP: PAGO SIMULADO ====== */}
        {step === 'payment' && (
          <div className="flex-1 overflow-y-auto p-lg space-y-5">
            {/* Resumen de compra */}
            <div className="bg-surface-container-lowest rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-bold text-primary mb-2">Resumen de tu pedido</h3>
              {cartItems.map(item => (
                <div key={item.cartItemId} className="flex justify-between text-sm">
                  <span className="text-secondary">{item.name} {item.selectedSize ? `(${item.selectedSize})` : ''} × {item.quantity}</span>
                  <span className="text-primary font-bold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-outline-variant/30 pt-2 mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Subtotal</span>
                  <span className="text-primary">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Envío</span>
                  <span className={`${shippingCost === 0 ? 'text-green-600 font-bold' : 'text-primary'}`}>
                    {shippingCost === 0 ? '¡GRATIS!' : formatPrice(shippingCost)}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-[11px] text-secondary">Envío gratis en compras mayores a $1,500</p>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-outline-variant/30 pt-2">
                  <span className="text-primary">Total</span>
                  <span className="text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Envío a */}
            <div className="bg-surface-container-lowest rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-primary">{formData.fullName}</p>
                  <p className="text-xs text-secondary mt-1">{formData.address}</p>
                  <p className="text-xs text-secondary">{formData.city}, {formData.state} C.P. {formData.zipCode}</p>
                  <p className="text-xs text-secondary mt-1">{formData.phone} · {formData.email}</p>
                </div>
                <button onClick={() => setStep('info')} className="text-primary text-sm underline">Editar</button>
              </div>
            </div>

            {/* Tarjeta simulada */}
            <div>
              <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">credit_card</span>
                Datos de Tarjeta (Simulación)
              </h3>
              <div className="space-y-3">
                <div>
                  <input type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                    className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary tracking-widest"
                    value={formData.cardNumber}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, '').substring(0, 16);
                      const formatted = v.replace(/(.{4})/g, '$1 ').trim();
                      setFormData({...formData, cardNumber: formatted});
                    }}
                  />
                </div>
                <div>
                  <input type="text" placeholder="Nombre en la tarjeta"
                    className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    value={formData.cardName} onChange={e => setFormData({...formData, cardName: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/AA" maxLength={5}
                    className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    value={formData.cardExpiry}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g, '').substring(0, 4);
                      if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
                      setFormData({...formData, cardExpiry: v});
                    }}
                  />
                  <input type="text" placeholder="CVV" maxLength={4}
                    className="w-full border border-outline-variant rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    value={formData.cardCvv} onChange={e => setFormData({...formData, cardCvv: e.target.value.replace(/\D/g, '').substring(0, 4)})} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-[11px] text-secondary bg-green-50 p-3 rounded-lg">
                <span className="material-symbols-outlined text-green-600 text-[16px]">lock</span>
                <span>Tus datos están protegidos. Esta es una simulación de pago segura. No se realizará ningún cargo real.</span>
              </div>
            </div>

            {/* Botón Pagar */}
            <button
              onClick={handleCheckout}
              disabled={isSubmitting || !formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCvv}
              className="w-full bg-primary text-white py-4 rounded-md font-bold uppercase tracking-widest disabled:opacity-40 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  Procesando pago...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Pagar {formatPrice(grandTotal)}
                </>
              )}
            </button>
          </div>
        )}

        {/* ====== STEP: ÉXITO ====== */}
        {step === 'success' && (
          <div className="flex-1 overflow-y-auto p-lg flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce-in">
              <span className="material-symbols-outlined text-[48px]">check_circle</span>
            </div>
            <h3 className="font-product-title text-[28px] text-primary">¡Gracias por tu compra!</h3>
            <p className="text-secondary max-w-[280px]">
              Tu pedido <span className="font-bold text-primary">#{orderId}</span> ha sido recibido exitosamente.
            </p>
            <div className="bg-surface-container-lowest rounded-lg p-4 w-full text-left space-y-2 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                <span className="text-primary font-bold">{formData.fullName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-[16px] text-secondary">mail</span>
                <span className="text-secondary">{formData.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                <span className="text-secondary">{formData.city}, {formData.state}</span>
              </div>
            </div>
            <p className="text-sm text-secondary mt-2">
              Nos pondremos en contacto contigo vía WhatsApp para coordinar el envío.
            </p>
            <button onClick={closeAll} className="bg-primary text-white px-8 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors mt-4">
              Seguir Comprando
            </button>
          </div>
        )}

        {/* Footer del carrito (solo en step cart) */}
        {step === 'cart' && cartItems.length > 0 && (
          <div className="p-lg border-t border-outline-variant/30 bg-surface-container-lowest">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-primary">Subtotal</span>
              <span className="font-bold text-[20px] text-primary">{formatPrice(cartTotal)}</span>
            </div>
            {cartTotal >= 1500 && (
              <p className="text-xs text-green-600 font-bold mb-3">🎉 ¡Envío GRATIS en tu pedido!</p>
            )}
            <button
              onClick={() => setStep('info')}
              className="w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-primary/90 transition-colors uppercase tracking-widest text-[14px] shadow-md"
            >
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}
