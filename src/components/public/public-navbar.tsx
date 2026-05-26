"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Search, Globe, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

const navLinks = [
  { name: "Actualités", href: "#news" },
  { name: "Matchs & Live", href: "#matches" },
  { name: "Compétitions", href: "#competitions" },
  { name: "Clubs & Joueurs", href: "#clubs" },
  { name: "Boutique", href: "#shop" },
  { name: "Billetterie", href: "#tickets" },
]

export function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 md:w-12 md:h-12 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-transform group-hover:scale-105">
                  <Image 
                    src="/images/logo.png" 
                    alt="Logo FemaFoot" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-white font-black leading-none text-lg tracking-wide uppercase">FemaFoot</span>
                  <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest">Officiel</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="text-slate-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                <Search className="w-5 h-5" />
              </button>
              
              <div className="h-6 w-px bg-white/10" />
              
              <button className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>FR</span>
              </button>

              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white border-0 shadow-[0_0_20px_rgba(34,197,94,0.3)] rounded-full px-6 font-bold uppercase tracking-wider text-xs h-10">
                  Espace Admin
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-slate-950 border-l border-white/10 z-[70] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
                  <span className="text-white font-black uppercase tracking-wide">Menu</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl text-slate-300 font-semibold hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors"
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                ))}
              </div>

              <div className="p-4 border-t border-white/5 flex flex-col gap-3 bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <button className="flex-1 flex justify-center items-center gap-2 p-3 rounded-xl bg-white/5 text-slate-300 font-semibold text-sm hover:bg-white/10 transition-colors">
                    <Search className="w-4 h-4" />
                    Rechercher
                  </button>
                  <button className="flex items-center justify-center gap-1 p-3 rounded-xl bg-white/5 text-slate-300 font-bold text-sm hover:bg-white/10 transition-colors">
                    <Globe className="w-4 h-4" />
                    FR
                  </button>
                </div>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white border-0 shadow-lg shadow-green-500/20 rounded-xl h-12 font-bold uppercase tracking-wider">
                    Espace Administrateur
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
