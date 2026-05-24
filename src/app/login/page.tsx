"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, User, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/simple-toast"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  
  const router = useRouter()
  const { toast } = useToast()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setLoading(true)

    try {
      if (isSignUp) {
        if (password.length < 6) {
          setErrorMsg("Le mot de passe doit comporter au moins 6 caractères.")
          toast("Le mot de passe doit faire au moins 6 caractères.", "error")
          setLoading(false)
          return
        }

        // 1. Sign up user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name
            }
          }
        })

        if (authError) throw authError

        // Fetch default role (e.g., Admin Fédération)
        const { data: roleData } = await supabase
          .from("roles")
          .select("id")
          .eq("name", "Admin Fédération")
          .single()

        // 2. Insert into public.users for Femafoot administrative visibility
        const { error: dbError } = await supabase
          .from("users")
          .insert({
            auth_id: authData.user?.id,
            full_name: name,
            email,
            role_id: roleData?.id || null,
            status: "Actif"
          })

        if (dbError) {
          console.warn("Could not insert user record in users table:", dbError)
        }

        toast("Inscription réussie. Compte administrateur créé !", "success")
        router.push("/dashboard")
      } else {
        // Sign in user
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error

        toast("Connexion réussie. Bienvenue !", "success")
        router.push("/dashboard")
      }
    } catch (err: any) {
      console.error("Auth error:", err)
      setErrorMsg(err.message || "Une erreur est survenue lors de l'authentification.")
      toast("Échec de l'authentification.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-radial-gradient relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-white/10 relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative h-20 w-16 animate-bounce duration-[3s]">
            <Image 
              src="/images/logo.png" 
              alt="Logo FemaFoot" 
              fill
              priority
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">FemaFoot Admin</h1>
            <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">
              {isSignUp ? "Création de Compte Administrateur" : "Portail de Gestion Officiel"}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="font-semibold">{errorMsg}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-4">

            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">
                  Nom Complet
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="Abdoulaye Diarra"
                  />
                </div>
              </div>
            )}
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">
                Adresse Email Administrateur
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="admin@femafoot.ml"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 flex items-center justify-between">
                <span>Mot de Passe</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {isSignUp && (
                <p className={`text-[9px] font-semibold uppercase tracking-wider mt-1.5 px-1 transition-colors ${
                  password.length >= 6 ? "text-emerald-400" : "text-amber-500"
                }`}>
                  {password.length >= 6 ? "✓ Longueur de mot de passe valide (6+)" : "⚠ Le mot de passe doit faire au moins 6 caractères"}
                </p>
              )}
            </div>
            
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(203,160,65,0.3)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? <UserPlus className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                {isSignUp ? "Créer mon Compte" : "Se Connecter"}
              </>
            )}
          </Button>
        </form>

        {/* Mode Toggle Link */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setErrorMsg("")
            }}
            className="text-xs font-semibold text-primary hover:underline uppercase tracking-wider"
          >
            {isSignUp ? "Déjà membre ? Se connecter" : "Pas encore inscrit ? Créer un compte"}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-white/5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Fédération Malienne de Football © 2026
          </p>
        </div>

      </div>
    </div>
  )
}
