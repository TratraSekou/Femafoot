"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { Plus, Newspaper, CheckCircle2, FileEdit, Eye, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/simple-toast'
import { NewsFilters } from '@/components/actualites/news-filters'
import { NewsCard, FeaturedNewsCard } from '@/components/actualites/news-card'
import { NewsEditorModal } from '@/components/actualites/news-editor-modal'
import { NewsDetailsDrawer } from '@/components/actualites/news-details-drawer'
import { NewsArticle, NewsStatus } from '@/components/actualites/types'
import { supabase } from '@/lib/supabase'

export default function ActualitesPage() {
  const { toast } = useToast()
  
  // States
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  // -- RÉCUPÉRATION DES ARTICLES DEPUIS SUPABASE --
  async function fetchArticles() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('news')
        .select('*, users!author_id(full_name)')
        .order('published_at', { ascending: false })
      if (error) throw error
      if (data) {
        const mapped: NewsArticle[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          content: item.content,
          category: item.category,
          author: item.users?.full_name || 'Admin',
          publishDate: item.published_at,
          views: item.views,
          status: item.status as NewsStatus,
          coverImage: item.cover_image,
          tags: item.tags || []
        }))
        setArticles(mapped)
      }
    } catch (err) {
      console.error("Error fetching articles:", err)
      toast("Erreur lors de la récupération des actualités.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  // Memoized Filtering
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCategory = selectedCategory === 'all' || article.category === selectedCategory
      const matchStatus = selectedStatus === 'all' || article.status === selectedStatus
      return matchSearch && matchCategory && matchStatus
    })
  }, [articles, searchQuery, selectedCategory, selectedStatus])

  const featuredArticle = filteredArticles[0]
  const otherArticles = filteredArticles.slice(1)

  // Actions
  const handleCreate = () => {
    setSelectedArticle(null)
    setIsEditorOpen(true)
  }

  const handleEdit = (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsEditorOpen(true)
  }

  const handleView = async (article: NewsArticle) => {
    setSelectedArticle(article)
    setIsDrawerOpen(true)
    
    // Incrémenter les vues dans Supabase en tâche de fond (non bloquant)
    try {
      await supabase
        .from('news')
        .update({ views: article.views + 1 })
        .eq('id', article.id)
      
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, views: a.views + 1 } : a))
    } catch (err) {
      console.error("Error updating views:", err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)
      if (error) throw error
      setArticles(prev => prev.filter(a => a.id !== id))
      toast("L'article a été supprimé avec succès.", "success")
    } catch (err) {
      console.error("Error deleting article:", err)
      toast("Erreur lors de la suppression de l'article.", "error")
    }
  }

  const handleSave = async (data: NewsArticle) => {
    try {
      const dbPayload = {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        published_at: data.publishDate || new Date().toISOString(),
        views: data.views || 0,
        status: data.status,
        cover_image: data.coverImage,
        tags: data.tags || []
      }

      const exists = articles.find(a => a.id === data.id)
      if (exists) {
        const { error } = await supabase
          .from('news')
          .update(dbPayload)
          .eq('id', data.id)
        if (error) throw error
        
        toast("Article mis à jour !", "success")
      } else {
        const { data: inserted, error } = await supabase
          .from('news')
          .insert(dbPayload)
          .select()
        if (error) throw error
        toast("Nouvel article publié !", "success")
      }
      setIsEditorOpen(false)
      fetchArticles() // Re-fetch to get accurate mappings and dates
    } catch (err) {
      console.error("Error saving article:", err)
      toast("Erreur lors de l'enregistrement de l'article.", "error")
    }
  }

  const stats = useMemo(() => {
    const published = articles.filter(a => a.status === 'Publié').length
    const drafts = articles.filter(a => a.status === 'Brouillon').length
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0)
    const activeCategories = new Set(articles.map(a => a.category)).size
    return { published, drafts, totalViews, activeCategories }
  }, [articles])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Actualités</h1>
          <p className="text-slate-400 mt-1">Gérez la communication officielle et les médias de la fédération.</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest h-12 px-8 rounded-2xl shadow-[0_0_20px_rgba(203,160,65,0.3)] transition-all hover:scale-105"
        >
          <Plus className="mr-2 h-5 w-5" />
          Publier une actualité
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Publiés" value={loading ? "..." : stats.published} icon={<CheckCircle2 className="text-emerald-500" />} />
        <StatCard title="Brouillons" value={loading ? "..." : stats.drafts} icon={<FileEdit className="text-amber-500" />} />
        <StatCard title="Total Vues" value={loading ? "..." : stats.totalViews.toLocaleString()} icon={<Eye className="text-blue-500" />} />
        <StatCard title="Catégories" value={loading ? "..." : stats.activeCategories} icon={<TrendingUp className="text-primary" />} />
        <StatCard title="Cette Semaine" value={loading ? "..." : "+4"} icon={<Newspaper className="text-purple-500" />} highlight />
      </div>

      {/* Filter Bar */}
      <NewsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Featured Article */}
      {loading ? (
        <div className="glass-card p-8 rounded-3xl animate-pulse space-y-6">
          <div className="h-64 bg-white/5 rounded-2xl w-full" />
          <div className="space-y-3">
            <div className="h-6 bg-white/10 rounded w-1/3" />
            <div className="h-4 bg-white/5 rounded w-2/3" />
          </div>
        </div>
      ) : featuredArticle && !searchQuery && selectedCategory === 'all' && selectedStatus === 'all' && (
        <section className="space-y-4">
           <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">À la une</h2>
           <FeaturedNewsCard article={featuredArticle} onView={handleView} />
        </section>
      )}

      {/* Grille d'articles */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Dernières publications</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 rounded-2xl animate-pulse space-y-4">
                <div className="h-40 bg-white/5 rounded-xl w-full" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(featuredArticle && !searchQuery && selectedCategory === 'all' && selectedStatus === 'all' ? otherArticles : filteredArticles).map((article) => (
              <NewsCard 
                key={article.id} 
                article={article} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center glass-card rounded-3xl border border-white/5 border-dashed">
             <Newspaper size={48} className="mx-auto text-slate-500 mb-4 opacity-50" />
             <h3 className="text-white font-bold">Aucun article trouvé</h3>
             <p className="text-slate-400 text-sm mt-2">Essayez d'ajuster vos filtres ou de créer une nouvelle publication.</p>
          </div>
        )}
      </section>

      {/* Modals & Drawers */}
      <NewsEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        article={selectedArticle}
      />

      <NewsDetailsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        article={selectedArticle}
      />

    </div>
  )
}

function StatCard({ title, value, icon, highlight = false }: { title: string; value: string | number; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={cn(
      "glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-2 transition-all hover:border-white/10",
      highlight && "bg-primary/5 border-primary/20"
    )}>
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
           {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</p>
        <p className="text-xl font-black text-white">{value}</p>
      </div>
    </div>
  )
}
