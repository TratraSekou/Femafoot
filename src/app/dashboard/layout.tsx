"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import Image from "next/image"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-radial-gradient flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />
        <div className="relative flex flex-col items-center gap-6 z-10">
          <div className="relative h-24 w-20 animate-pulse duration-1000">
            <Image 
              src="/images/logo.png" 
              alt="Logo FemaFoot" 
              fill
              priority
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-100" />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-200" />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-300" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Chargement Sécurisé...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen w-full flex-col bg-transparent overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-64 md:block flex-shrink-0">
          <div className="fixed inset-y-0 z-20 w-64">
            <Sidebar />
          </div>
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
