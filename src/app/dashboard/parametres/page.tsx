"use client"

import React, { useState } from 'react'
import { Settings, Shield, Bell, Users, Palette, Cpu, Database, Landmark, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SettingsSidebar, SettingsSection } from '@/components/settings/settings-sidebar'
import { GeneralSettings } from '@/components/settings/general-settings'
import { FederationProfile } from '@/components/settings/federation-profile'
import { SecuritySettings } from '@/components/settings/security-settings'
import { NotificationSettings } from '@/components/settings/notification-settings'
import { UsersManagement } from '@/components/settings/users-management'
import { AppearanceSettings } from '@/components/settings/appearance-settings'
import { SystemSettings } from '@/components/settings/system-settings'
import { BackupSettings } from '@/components/settings/backup-settings'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case 'general': return <GeneralSettings />
      case 'federation': return <FederationProfile />
      case 'security': return <SecuritySettings />
      case 'notifications': return <NotificationSettings />
      case 'users': return <UsersManagement />
      case 'appearance': return <AppearanceSettings />
      case 'system': return <SystemSettings />
      case 'backups': return <BackupSettings />
      default: return <GeneralSettings />
    }
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'general': return 'Paramètres Généraux'
      case 'federation': return 'Profil Fédération'
      case 'security': return 'Sécurité & Accès'
      case 'notifications': return 'Notifications'
      case 'users': return 'Utilisateurs & Rôles'
      case 'appearance': return 'Apparence & UX'
      case 'system': return 'État du Système'
      case 'backups': return 'Sauvegardes & Data'
      default: return 'Paramètres'
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[80vh] animate-in fade-in duration-700">
      
      {/* Mobile Header Navigation */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#132820] border border-white/10 rounded-2xl">
         <div className="flex items-center gap-3 text-white">
            <Settings className="text-primary" />
            <h1 className="text-sm font-black uppercase tracking-tight">{getSectionTitle()}</h1>
         </div>
         <button 
           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
           className="p-2 rounded-xl bg-white/5 text-primary border border-white/5"
         >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
         </button>
      </div>

      {/* Sidebar - Desktop & Mobile Drawer */}
      <div className={cn(
        "lg:block flex-shrink-0",
        isMobileMenuOpen ? "block" : "hidden"
      )}>
        <div className="sticky top-8">
           <SettingsSidebar 
             activeSection={activeSection} 
             onSectionChange={(section) => {
               setActiveSection(section)
               setIsMobileMenuOpen(false)
             }} 
           />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-8 pb-20">
         <div className="hidden lg:block border-b border-white/5 pb-6">
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">{getSectionTitle()}</h1>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold opacity-60">Configuration Plateforme FemaFoot</p>
         </div>

         <div className="relative">
            {/* Transition effects could be added here */}
            {renderContent()}
         </div>
      </div>

    </div>
  )
}
