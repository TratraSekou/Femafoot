"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { User, Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  logout: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 1. Get initial session
    async function getInitialSession() {
      try {
        const { data: { session: activeSession } } = await supabase.auth.getSession()
        setSession(activeSession)
        setUser(activeSession?.user ?? null)
      } catch (err) {
        console.error("Error checking auth session:", err)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)

      if (event === "SIGNED_OUT") {
        router.push("/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
