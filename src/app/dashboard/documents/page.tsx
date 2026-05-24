"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { Plus, Database, FolderOpen, Download, Clock, Shield, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/simple-toast'
import { DocumentFilters } from '@/components/documents/document-filters'
import { DocumentCard } from '@/components/documents/document-card'
import { DocumentUploadModal } from '@/components/documents/document-upload-modal'
import { DocumentDetailsDrawer } from '@/components/documents/document-details-drawer'
import { FemaDocument, DocumentStats } from '@/components/documents/types'
import { supabase } from '@/lib/supabase'

export default function DocumentsPage() {
  const { toast } = useToast()
  
  // States
  const [documents, setDocuments] = useState<FemaDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<FemaDocument | null>(null)
  const [editingDoc, setEditingDoc] = useState<FemaDocument | null>(null)

  // --- CHARGEMENT SUPABASE ---
  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error

      if (data) {
        const mappedDocs: FemaDocument[] = data.map((d: any) => ({
          id: d.id.toString(),
          name: d.title,
          category: d.category,
          size: d.file_size || "1.5 MB",
          type: (d.file_url?.split('.').pop()?.toUpperCase() as any) || "PDF",
          uploadDate: d.created_at,
          author: "Secrétariat Général",
          downloads: 12, // valeur virtuelle
          status: (d.status === "Public" || d.status === "Privé" || d.status === "Archivé" || d.status === "Brouillon" ? d.status : "Public") as any,
          description: "",
          tags: []
        }))
        setDocuments(mappedDocs)
      }
    } catch (err) {
      console.error("Error fetching documents:", err)
      toast("Erreur lors de la récupération des documents.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  // Memoized Filtering
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCategory = selectedCategory === 'all' || doc.category === selectedCategory
      const matchType = selectedType === 'all' || doc.type === selectedType
      const matchStatus = selectedStatus === 'all' || doc.status === selectedStatus
      return matchSearch && matchCategory && matchType && matchStatus
    }).sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
  }, [documents, searchQuery, selectedCategory, selectedType, selectedStatus])

  // Stats
  const stats: DocumentStats = useMemo(() => {
    const total = documents.length
    const categories = new Set(documents.map(d => d.category)).size
    const downloads = documents.reduce((sum, d) => sum + d.downloads, 0)
    const recent = documents.filter(d => {
      const diffTime = Math.abs(new Date().getTime() - new Date(d.uploadDate).getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 7
    }).length
    const archived = documents.filter(d => d.status === 'Privé').length
    return { total, categories, downloads, recent, archived }
  }, [documents])

  // Actions
  const handleView = (doc: FemaDocument) => {
    setSelectedDoc(doc)
    setIsDrawerOpen(true)
  }

  const handleDownload = async (doc: FemaDocument) => {
    try {
      toast(`Téléchargement de "${doc.name}" lancé...`, "success")
      // Mise à jour virtuelle locale rapide de l'état
      setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, downloads: d.downloads + 1 } : d))
    } catch (err) {
      console.error("Error updating download count:", err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', Number(id))
      
      if (error) throw error
      toast("Le document a été supprimé.", "success")
      fetchDocuments()
    } catch (err) {
      console.error("Error deleting document:", err)
      toast("Erreur lors de la suppression du document.", "error")
    }
  }

  const handleEdit = (doc: FemaDocument) => {
    setEditingDoc(doc)
    setIsUploadOpen(true)
  }

  const handleSave = async (doc: FemaDocument) => {
    try {
      // Map frontend status to database constraint status
      let dbStatus = 'Validé'
      if (doc.status === 'Brouillon' || doc.status === 'Privé') {
        dbStatus = 'Brouillon'
      }

      const dbPayload = {
        title: doc.name,
        category: doc.category,
        file_size: doc.size,
        file_url: doc.name.toLowerCase().endsWith('.pdf') ? `https://suvvnhiivatenpbwhrps.supabase.co/storage/v1/object/public/documents/${doc.name}` : `https://suvvnhiivatenpbwhrps.supabase.co/storage/v1/object/public/documents/${doc.name}.pdf`,
        status: dbStatus,
        type: doc.type
      }

      // Check if doc.id is numeric (existing document) instead of finding randomly generated strings
      const isExisting = !isNaN(Number(doc.id)) && documents.some(d => d.id === doc.id)

      if (isExisting) {
        const { error } = await supabase
          .from('documents')
          .update(dbPayload)
          .eq('id', Number(doc.id))
        
        if (error) throw error
        toast("Document mis à jour !", "success")
      } else {
        const { error } = await supabase
          .from('documents')
          .insert(dbPayload)
        
        if (error) throw error
        toast("Document téléversé avec succès !", "success")
      }
      setIsUploadOpen(false)
      fetchDocuments()
    } catch (err) {
      console.error("Error saving document:", err)
      toast("Erreur lors de la sauvegarde du document.", "error")
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Documents</h1>
          <p className="text-slate-400 mt-1">Accédez au centre de ressources et documents officiels de la FemaFoot.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingDoc(null)
            setIsUploadOpen(true)
          }}
          className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest h-12 px-8 rounded-2xl shadow-[0_0_20px_rgba(203,160,65,0.3)] transition-all hover:scale-105"
        >
          <Plus className="mr-2 h-5 w-5" />
          Ajouter un document
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Documents" value={stats.total} icon={<Database className="text-blue-500" />} />
        <StatCard title="Catégories" value={stats.categories} icon={<FolderOpen className="text-primary" />} />
        <StatCard title="Téléchargés" value={stats.downloads} icon={<Download className="text-emerald-500" />} />
        <StatCard title="Nouveaux" value={stats.recent} icon={<Clock className="text-amber-500" />} highlight />
        <StatCard title="Archivés" value={stats.archived} icon={<Shield className="text-red-500" />} />
      </div>

      {/* Filter Bar */}
      <DocumentFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Documents Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Bibliothèque numérique</h2>
           <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{filteredDocs.length} Documents trouvés</span>
        </div>

        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredDocs.map((doc) => (
              <DocumentCard 
                key={doc.id} 
                document={doc}
                onView={handleView}
                onDownload={handleDownload}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center glass-card rounded-3xl border border-white/5 border-dashed">
             <Database size={48} className="mx-auto text-slate-500 mb-4 opacity-50" />
             <h3 className="text-white font-bold text-lg">Aucun document ne correspond</h3>
             <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Vérifiez vos termes de recherche ou vos filtres pour trouver ce que vous cherchez.</p>
          </div>
        )}
      </section>

      {/* Modals & Drawers */}
      <DocumentUploadModal 
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false)
          setEditingDoc(null)
        }}
        onSave={handleSave}
        document={editingDoc}
      />

      <DocumentDetailsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        document={selectedDoc}
        onDownload={handleDownload}
      />

    </div>
  )
}

function StatCard({ title, value, icon, highlight = false }: { title: string; value: string | number; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={cn(
      "glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-3 transition-all duration-300 hover:border-white/10 group",
      highlight && "bg-primary/5 border-primary/20"
    )}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
           {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-0.5">{title}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
    </div>
  )
}
