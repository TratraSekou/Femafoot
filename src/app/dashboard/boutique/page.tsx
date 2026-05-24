"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { Plus, ShoppingBag, Package, TrendingUp, AlertTriangle, Clock, Search, Zap, ListFilter, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/simple-toast'
import { BoutiqueFilters } from '@/components/boutique/boutique-filters'
import { ProductCard } from '@/components/boutique/product-card'
import { OrderCard } from '@/components/boutique/order-card'
import { ProductEditorModal } from '@/components/boutique/product-editor-modal'
import { ProductDetailsDrawer } from '@/components/boutique/product-details-drawer'
import { OrderDetailsDrawer } from '@/components/boutique/order-details-drawer'
import { Product, Order, BoutiqueStats, OrderStatus } from '@/components/boutique/types'
import { supabase } from '@/lib/supabase'

export default function BoutiquePage() {
  const { toast } = useToast()
  
  // States
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'catalogue' | 'commandes'>('catalogue')
  
  // Filters States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStockStatus, setSelectedStockStatus] = useState('all')
  const [selectedSize, setSelectedSize] = useState('all')
  const [showPopularOnly, setShowPopularOnly] = useState(false)

  // Modals States
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // --- CHARGEMENT DES DONNÉES & EXPIRATIONS ---
  const fetchData = async () => {
    try {
      setLoading(true)
      // 1. Déclencher la fonction d'expiration automatique sur Supabase
      await supabase.rpc('release_expired_orders')

      // 2. Récupérer les produits
      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false })
      
      if (prodErr) throw prodErr

      // 3. Récupérer les commandes
      const { data: dbOrders, error: orderErr } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            quantity,
            price,
            size,
            product:products(id, name)
          )
        `)
        .order('created_at', { ascending: false })
      
      if (orderErr) throw orderErr

      // 4. Mappage des produits
      if (dbProducts) {
        const mappedProducts: Product[] = dbProducts.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          category: p.category,
          price: Number(p.price),
          sizes: p.sizes?.length ? p.sizes : ["S", "M", "L", "XL"],
          stock: p.stock,
          reserved: p.reserved,
          image: (p.images && p.images[0]) ? p.images[0] : "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
          description: p.description,
          isPopular: p.stock > 10
        }))
        setProducts(mappedProducts)
      }

      // 5. Mappage des commandes
      if (dbOrders) {
        const mappedOrders: Order[] = dbOrders.map((o: any) => {
          const firstItem = Array.isArray(o.order_items) && o.order_items.length > 0 ? o.order_items[0] : {}
          return {
            id: o.id.toString(),
            productId: (firstItem.product?.id || '').toString(),
            productName: firstItem.product?.name || 'Produit inconnu',
            quantity: firstItem.quantity || 1,
            clientName: o.client_name,
            clientPhone: o.client_phone,
            clientNeighborhood: o.client_neighborhood,
            clientEmail: o.client_email || '',
            date: o.created_at,
            status: o.status === 'EN TRAITEMENT' ? 'EN ATTENTE' : o.status as OrderStatus,
            expiresAt: o.expires_at
          }
        })
        setOrders(mappedOrders)
      }

    } catch (err) {
      console.error("Error fetching boutique data:", err)
      toast("Erreur lors de la récupération des données de la boutique.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- ACTIONS PRODUITS ---
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderDrawerOpen(true)
  }

  const handleSaveProduct = async (product: Product) => {
    try {
      const dbPayload = {
        name: product.name,
        description: product.description,
        price: product.price,
        images: [product.image],
        stock: product.stock,
        category: product.category,
        reserved: product.reserved || 0
      }

      const exists = products.find(p => p.id === product.id)
      if (exists) {
        const { error } = await supabase
          .from('products')
          .update(dbPayload)
          .eq('id', Number(product.id))
        if (error) throw error
        toast("Produit mis à jour !", "success")
      } else {
        const { error } = await supabase
          .from('products')
          .insert(dbPayload)
        if (error) throw error
        toast("Nouveau produit ajouté au catalogue !", "success")
      }
      setIsEditorOpen(false)
      fetchData()
    } catch (err) {
      console.error("Error saving product:", err)
      toast("Erreur lors de la sauvegarde du produit.", "error")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', Number(id))
      if (error) throw error
      toast("Produit supprimé du catalogue.", "success")
      fetchData()
    } catch (err) {
      console.error("Error deleting product:", err)
      toast("Erreur lors de la suppression.", "error")
    }
  }

  const handleOrderSimulation = async (product: Product) => {
    if (product.stock <= 0) {
      toast("Stock insuffisant !", "error")
      return
    }

    try {
      // 1. Décrémenter stock et incrémenter réservé
      const { error: prodErr } = await supabase
        .from('products')
        .update({
          stock: product.stock - 1,
          reserved: product.reserved + 1
        })
        .eq('id', Number(product.id))
      
      if (prodErr) throw prodErr

      // 2. Créer la commande
      const { data: newOrder, error: orderErr } = await supabase
        .from('orders')
        .insert({
          client_name: "Simulation Admin",
          client_email: "sim.admin@femafoot.ml",
          client_phone: "+223 77 88 99 00",
          client_neighborhood: "Quartier du Fleuve",
          total: product.price,
          status: 'EN TRAITEMENT'
        })
        .select()
        .single()
      
      if (orderErr) throw orderErr

      // 3. Créer l'order item
      const { error: itemErr } = await supabase
        .from('order_items')
        .insert({
          order_id: newOrder.id,
          product_id: Number(product.id),
          quantity: 1,
          price: product.price,
          size: "M"
        })

      if (itemErr) throw itemErr

      toast(`Réservation de 24h créée pour ${product.name}.`, "success")
      fetchData()
    } catch (err) {
      console.error("Error creating simulation:", err)
      toast("Erreur lors de la simulation de commande.", "error")
    }
  }

  // --- ACTIONS COMMANDES ---
  const handleValidateOrder = async (id: string) => {
    try {
      const order = orders.find(o => o.id === id)
      if (!order) return

      // 1. Marquer la commande comme validée
      const { error: orderErr } = await supabase
        .from('orders')
        .update({ status: 'VALIDÉE' })
        .eq('id', Number(id))
      if (orderErr) throw orderErr

      // 2. Décrémenter le stock réservé du produit associé
      const product = products.find(p => p.id === order.productId)
      if (product) {
        await supabase
          .from('products')
          .update({ reserved: Math.max(0, product.reserved - order.quantity) })
          .eq('id', Number(product.id))
      }

      toast("Commande validée avec succès !", "success")
      fetchData()
    } catch (err) {
      console.error("Error validating order:", err)
      toast("Erreur lors de la validation.", "error")
    }
  }

  const handleCancelOrder = async (id: string) => {
    try {
      const order = orders.find(o => o.id === id)
      if (!order) return

      // 1. Marquer la commande comme annulée
      const { error: orderErr } = await supabase
        .from('orders')
        .update({ status: 'ANNULÉE' })
        .eq('id', Number(id))
      if (orderErr) throw orderErr

      // 2. Remettre le produit en stock et enlever du stock réservé
      const product = products.find(p => p.id === order.productId)
      if (product) {
        await supabase
          .from('products')
          .update({
            stock: product.stock + order.quantity,
            reserved: Math.max(0, product.reserved - order.quantity)
          })
          .eq('id', Number(product.id))
      }

      toast("Commande annulée. Le stock a été remis à jour.", "success")
      fetchData()
    } catch (err) {
      console.error("Error cancelling order:", err)
      toast("Erreur lors de l'annulation.", "error")
    }
  }

  const handleRestockOrder = (id: string) => {
    toast("Stock déjà synchronisé.", "success")
  }

  // --- FILTERING ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory
      const matchPopular = !showPopularOnly || p.isPopular
      const matchSize = selectedSize === 'all' || p.sizes.includes(selectedSize)
      const matchStock = selectedStockStatus === 'all' || (
        selectedStockStatus === 'disponible' ? p.stock > 5 :
        selectedStockStatus === 'faible' ? (p.stock <= 5 && p.stock > 0) :
        p.stock === 0
      )
      return matchSearch && matchCategory && matchPopular && matchSize && matchStock
    })
  }, [products, searchQuery, selectedCategory, selectedStockStatus, selectedSize, showPopularOnly])

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.productName.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [orders, searchQuery])

  // Stats
  const stats: BoutiqueStats = useMemo(() => {
    const totalProducts = products.length
    const pendingOrders = orders.filter(o => o.status === 'EN ATTENTE' || o.status === 'EN TRAITEMENT').length
    const revenue = orders.filter(o => o.status === 'VALIDÉE').length * 25000 // Multiplied by average price
    const lowStock = products.filter(p => p.stock <= 5 && p.stock > 0).length
    const reservedItems = products.reduce((acc, p) => acc + p.reserved, 0)
    return { totalProducts, pendingOrders, revenue, lowStock, reservedItems }
  }, [products, orders])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Boutique Officielle</h1>
          <p className="text-slate-400 mt-1">Gérez le catalogue des produits et les réservations de commandes.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
             variant="outline"
             onClick={() => setActiveTab(activeTab === 'catalogue' ? 'commandes' : 'catalogue')}
             className="h-12 px-6 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
           >
              {activeTab === 'catalogue' ? (
                <>
                  <ClipboardList className="mr-2 h-5 w-5 text-primary" /> Voir Commandes
                </>
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-5 w-5 text-primary" /> Voir Catalogue
                </>
              )}
           </Button>
           <Button 
            onClick={() => {
              setSelectedProduct(null)
              setIsEditorOpen(true)
            }}
            className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest h-12 px-8 rounded-2xl shadow-[0_0_20px_rgba(203,160,65,0.3)] transition-all hover:scale-105"
           >
             <Plus className="mr-2 h-5 w-5" />
             Ajouter un produit
           </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Articles" value={stats.totalProducts} icon={<Package className="text-blue-500" />} />
        <StatCard title="En attente" value={stats.pendingOrders} icon={<Clock className="text-amber-500" />} highlight={stats.pendingOrders > 0} />
        <StatCard title="Revenus" value={`${(stats.revenue / 1000000).toFixed(1)}M`} icon={<TrendingUp className="text-emerald-500" />} />
        <StatCard title="Stock faible" value={stats.lowStock} icon={<AlertTriangle className={cn(stats.lowStock > 0 ? "text-red-500" : "text-slate-500")} />} />
        <StatCard title="Réservés" value={stats.reservedItems} icon={<ShoppingBag className="text-primary" />} />
      </div>

      {/* Filter Bar */}
      <BoutiqueFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStockStatus={selectedStockStatus}
        setSelectedStockStatus={setSelectedStockStatus}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        showPopularOnly={showPopularOnly}
        setShowPopularOnly={setShowPopularOnly}
      />

      {/* Tabs Content */}
      <div className="space-y-6">
         <div className="flex items-center gap-4 border-b border-white/5 pb-1">
            <button 
              onClick={() => setActiveTab('catalogue')}
              className={cn(
                "pb-3 px-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative",
                activeTab === 'catalogue' ? "text-primary" : "text-slate-500 hover:text-slate-300"
              )}
            >
               Catalogue
               {activeTab === 'catalogue' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(203,160,65,0.5)]" />}
            </button>
            <button 
              onClick={() => setActiveTab('commandes')}
              className={cn(
                "pb-3 px-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative",
                activeTab === 'commandes' ? "text-primary" : "text-slate-500 hover:text-slate-300"
              )}
            >
               Commandes & Réservations
               {activeTab === 'commandes' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(203,160,65,0.5)]" />}
            </button>
         </div>

         {activeTab === 'catalogue' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
               {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onView={(p) => { setSelectedProduct(p); setIsDrawerOpen(true); }}
                    onEdit={(p) => { setSelectedProduct(p); setIsEditorOpen(true); }}
                    onDelete={handleDeleteProduct}
                    onOrder={handleOrderSimulation}
                  />
               ))}
               {filteredProducts.length === 0 && (
                  <div className="col-span-full py-20 text-center glass-card rounded-3xl border border-white/5 border-dashed">
                     <ShoppingBag size={48} className="mx-auto text-slate-500 mb-4 opacity-30" />
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun produit ne correspond à vos critères</p>
                  </div>
               )}
            </div>
         ) : (
            <div className="space-y-4">
               {filteredOrders.map(order => (
                  <OrderCard 
                    key={order.id}
                    order={order}
                    onView={handleViewOrder}
                    onValidate={handleValidateOrder}
                    onCancel={handleCancelOrder}
                    onRestock={handleRestockOrder}
                  />
               ))}
               {filteredOrders.length === 0 && (
                  <div className="py-20 text-center glass-card rounded-3xl border border-white/5 border-dashed">
                     <Clock size={48} className="mx-auto text-slate-500 mb-4 opacity-30" />
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucune commande en cours</p>
                  </div>
               )}
            </div>
         )}
      </div>

      {/* Modals */}
      <ProductEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />

      <ProductDetailsDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={selectedProduct}
        productOrders={orders.filter(o => o.productId === selectedProduct?.id)}
        onOrder={handleOrderSimulation}
      />

      <OrderDetailsDrawer 
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        order={selectedOrder}
        onValidate={handleValidateOrder}
        onCancel={handleCancelOrder}
      />

    </div>
  )
}

function StatCard({ title, value, icon, highlight = false }: { title: string; value: string | number; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={cn(
      "glass-card p-5 rounded-2xl border border-white/5 flex flex-col gap-3 transition-all duration-300 hover:border-white/10 group",
      highlight && "bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(203,160,65,0.1)]"
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
