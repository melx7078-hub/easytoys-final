import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, CreditCard, Shield, Truck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t-[8px] border-primary-600 text-slate-300">
      {/* Services bar */}
      <div className="bg-slate-800 py-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Truck className="w-8 h-8 text-primary-500" />
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Envío Discreto</h4>
            <p className="text-xs text-slate-400">Entrega rápida y empaquetado anónimo</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-8 h-8 text-primary-500" />
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Pago Seguro</h4>
            <p className="text-xs text-slate-400">Tramos cifrados con seguridad SSL</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CreditCard className="w-8 h-8 text-primary-500" />
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Paga Más Tarde</h4>
            <p className="text-xs text-slate-400">Flexibilidad de pago y facilidades</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <div className="text-2xl font-black tracking-tighter text-primary-500 flex items-center mb-6">
            <div className="w-6 h-6 rounded-full bg-primary-600 mr-2 flex items-center justify-center text-white text-sm">
              e
            </div>
            easytoys
          </div>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Tu tienda erótica online n.º 1. Más de 2000 artículos en stock y envío neutral de la forma más rápida y segura.
          </p>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-6">Atención al Cliente</h4>
          <ul className="space-y-3 font-medium">
            <li><a href="#" className="hover:text-primary-500 transition-colors">Contacto</a></li>
            <li><a href="#" className="hover:text-primary-500 transition-colors">Preguntas Frecuentes</a></li>
            <li><a href="#" className="hover:text-primary-500 transition-colors">Envíos y Entregas</a></li>
            <li><a href="#" className="hover:text-primary-500 transition-colors">Devoluciones</a></li>
            <li><a href="#" className="hover:text-primary-500 transition-colors">Métodos de Pago</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-6">Legal y Más</h4>
          <ul className="space-y-3 font-medium">
            <li><a href="#" className="hover:text-primary-500 transition-colors">Términos y Condiciones</a></li>
            <li><a href="#" className="hover:text-primary-500 transition-colors">Política de Privacidad</a></li>
            <li><a href="#" className="hover:text-primary-500 transition-colors">Uso de Cookies</a></li>
            <li><a href="#" className="hover:text-primary-500 transition-colors">Sobre Nosotros</a></li>
            <li><a href="#" className="hover:text-primary-500 transition-colors">Affiliate Program</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-6">Síguenos</h4>
          <div className="flex gap-4 mb-8">
            <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
          <h4 className="text-white font-bold uppercase tracking-widest mb-4">Métodos de Pago</h4>
          <div className="flex gap-2 flex-wrap">
            {/* Payment method placeholders */}
            <div className="w-12 h-8 bg-slate-800 rounded"></div>
            <div className="w-12 h-8 bg-slate-800 rounded"></div>
            <div className="w-12 h-8 bg-slate-800 rounded"></div>
            <div className="w-12 h-8 bg-slate-800 rounded"></div>
          </div>
        </div>

      </div>

      <div className="bg-slate-950 py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-500 border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} EasyToys Final. All rights reserved.</p>
      </div>
    </footer>
  );
}
