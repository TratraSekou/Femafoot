import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Globe, MessageCircle, Image as ImageIcon, Video, MapPin, Phone, Mail, ChevronRight } from "lucide-react"

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full opacity-[0.03] pointer-events-none">
        <Image src="/images/logo.png" alt="Decoration" fill className="object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-14 h-14 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <Image 
                  src="/images/logo.png" 
                  alt="Logo FemaFoot" 
                  fill 
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black leading-none text-2xl tracking-wide uppercase">FemaFoot</span>
                <span className="text-green-500 text-[11px] font-bold uppercase tracking-widest">Fédération Malienne</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              La Fédération Malienne de Football est l'instance dirigeante du football au Mali. Elle organise les compétitions nationales et gère les équipes nationales.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all">
                <ImageIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-green-500 hover:text-white hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all">
                <Video className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Compétitions
            </h3>
            <ul className="flex flex-col gap-3">
              {['Ligue 1 Orange', 'Coupe du Mali', 'Ligue 2', 'Football Féminin', 'Jeunes (U17, U20)'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-slate-400 hover:text-green-400 transition-colors flex items-center gap-2 group text-sm">
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-green-500" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Fédération
            </h3>
            <ul className="flex flex-col gap-3">
              {['Actualités', 'Organisation', 'Documents Officiels', 'Boutique', 'Billetterie', 'Espace Médias'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-slate-400 hover:text-green-400 transition-colors flex items-center gap-2 group text-sm">
                    <ChevronRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-green-500" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Contact
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-green-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-slate-400 text-sm">
                  ACI 2000, Bamako, Mali<br />
                  BP: 1234
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-green-500">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-slate-400 text-sm">+223 20 22 45 67</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-green-500">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-slate-400 text-sm">contact@femafoot.ml</span>
              </li>
            </ul>
          </div>

        </div>



        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
          <p className="text-slate-500 text-xs font-medium">
            &copy; {currentYear} Fédération Malienne de Football. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Mentions Légales</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">Politique de Confidentialité</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
