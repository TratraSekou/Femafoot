"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight, Calendar, User, Tag } from "lucide-react"

type NewsItem = {
  id: string
  title: string
  excerpt: string
  cover_image: string | null
  category: string
  published_at: string
  author?: { full_name: string } | null
}

interface NewsSectionProps {
  news: NewsItem[]
}

export function NewsSection({ news }: NewsSectionProps) {
  // If no news, show some placeholders or hide section. We'll show placeholders if empty for demo.
  const displayNews = news.length > 0 ? news : [
    {
      id: "1",
      title: "Les Aigles du Mali se qualifient pour la prochaine CAN avec brio",
      excerpt: "Une victoire éclatante 3-0 qui assure la première place du groupe et confirme les ambitions de l'équipe nationale.",
      cover_image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop",
      category: "Équipe Nationale",
      published_at: new Date().toISOString(),
      author: { full_name: "Service Presse FemaFoot" }
    },
    {
      id: "2",
      title: "Nouveau partenariat stratégique pour le développement du football féminin",
      excerpt: "La fédération signe un accord historique pour multiplier par trois les investissements dans la ligue féminine d'ici 2028.",
      cover_image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1000&auto=format&fit=crop",
      category: "Institutionnel",
      published_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "3",
      title: "Ligue 1 Orange : Le Djoliba AC prend la tête du championnat",
      excerpt: "Au terme d'un derby palpitant, les Rouges s'imposent et prennent 3 points d'avance sur le Stade Malien.",
      cover_image: "https://images.unsplash.com/photo-1518605368461-1e1292234955?q=80&w=1000&auto=format&fit=crop",
      category: "Championnat",
      published_at: new Date(Date.now() - 172800000).toISOString(),
    }
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  const mainArticle = displayNews[0]
  const secondaryArticles = displayNews.slice(1, 4)

  return (
    <section id="news" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 bg-green-500 rounded-full" />
              À la Une
            </h2>
            <p className="text-slate-400 mt-2 font-medium">Toute l'actualité officielle de la fédération.</p>
          </div>
          <Link href="/actualites" className="flex items-center gap-2 text-green-400 font-bold uppercase tracking-wider text-sm hover:text-green-300 transition-colors group">
            Toutes les actualités
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Main Article (Left, spans 7 cols on large screens) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 group cursor-pointer"
          >
            <div className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden">
              <Image 
                src={mainArticle.cover_image || "/images/placeholder-news.jpg"} 
                alt={mainArticle.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col gap-4">
                <span className="px-3 py-1 rounded-md bg-green-500 text-white text-[10px] font-black uppercase tracking-widest w-fit">
                  {mainArticle.category}
                </span>
                
                <h3 className="text-2xl md:text-4xl font-black text-white leading-tight group-hover:text-green-400 transition-colors">
                  {mainArticle.title}
                </h3>
                
                <p className="text-slate-300 line-clamp-2 md:line-clamp-3 text-sm md:text-base font-light">
                  {mainArticle.excerpt}
                </p>

                <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(mainArticle.published_at)}</span>
                  {mainArticle.author && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {mainArticle.author.full_name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Secondary Articles Grid (Right, spans 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {secondaryArticles.map((article, index) => (
              <motion.div 
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 group cursor-pointer bg-slate-900/50 hover:bg-slate-900 rounded-2xl p-3 border border-white/5 transition-colors"
              >
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <Image 
                    src={article.cover_image || "/images/placeholder-news.jpg"} 
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <div className="flex flex-col justify-center flex-1 py-1 pr-2">
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {article.category}
                  </span>
                  <h4 className="text-white font-bold leading-snug line-clamp-2 mb-2 group-hover:text-green-400 transition-colors">
                    {article.title}
                  </h4>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-auto">
                    <Calendar className="w-3 h-3" /> {formatDate(article.published_at)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
