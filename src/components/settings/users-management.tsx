"use client"

import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, MoreVertical, Shield, User, Star, Search, X, ShieldCheck, Mail, AlertTriangle, ShieldAlert, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/simple-toast';
import { supabase } from '@/lib/supabase';

interface AdminUser {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  lastActive: string;
}

const ROLES = [
  { name: "Super Admin", color: "bg-red-500/20 text-red-500 border-red-500/30", description: "Accès total au système" },
  { name: "Admin Fédération", color: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30", description: "Gestion des compétitions et clubs" },
  { name: "Gestionnaire Ligue", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", description: "Gestion des classements et matchs" },
  { name: "Club Admin", color: "bg-primary/20 text-primary border-primary/30", description: "Accès limité à son propre club" },
];

export function UsersManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Popups state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Add User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Club Admin');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- CHARGEMENT SUPABASE ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*, roles(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      if (data) {
        const mappedUsers: AdminUser[] = data.map((u: any) => ({
          id: u.id,
          name: u.full_name,
          role: u.roles?.name || 'Sans rôle',
          email: u.email,
          status: u.status,
          lastActive: "Jamais"
        }));
        setUsers(mappedUsers);
      }
    } catch (err) {
      console.error("Error fetching admin users:", err);
      toast("Erreur lors de la récupération des administrateurs.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered Users List
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create User Action
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      toast("Veuillez remplir tous les champs.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast("Format d'e-mail invalide.", "error");
      return;
    }

    try {
      const { data: roleData } = await supabase.from('roles').select('id').eq('name', newRole).single();

      const { error } = await supabase
        .from('users')
        .insert({
          full_name: newName,
          email: newEmail,
          role_id: roleData?.id || null,
          status: "Actif"
        });
      
      if (error) throw error;

      setIsAddModalOpen(false);
      
      // Reset Form
      setNewName('');
      setNewEmail('');
      setNewRole('Club Admin');

      toast(`Administrateur ${newName} ajouté avec succès !`, "success");
      fetchUsers();
    } catch (err) {
      console.error("Error adding admin user:", err);
      toast("Erreur lors de l'ajout de l'administrateur.", "error");
    }
  };

  // Toggle User Status Action
  const handleToggleStatus = async (user: AdminUser) => {
    try {
      const nextStatus = user.status === "Actif" ? "Inactif" : "Actif";
      const { error } = await supabase
        .from('users')
        .update({ status: nextStatus })
        .eq('id', user.id);
      
      if (error) throw error;

      toast(`Statut de ${user.name} mis à jour : ${nextStatus}`, "success");
      setActiveDropdownId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error toggling admin status:", err);
      toast("Erreur lors de la mise à jour du statut.", "error");
    }
  };

  // Delete User Action
  const handleDeleteUser = async (id: string, name: string) => {
    const mainSuperAdmin = users.reduce((prev, curr) => (prev.id < curr.id) ? prev : curr, users[0]);
    if (id === mainSuperAdmin?.id) {
      toast("Le Super Admin principal ne peut pas être supprimé.", "error");
      setActiveDropdownId(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      toast(`L'administrateur ${name} a été révoqué.`, "success");
      setActiveDropdownId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting admin user:", err);
      toast("Erreur lors de la révocation de l'accès.", "error");
    }
  };

  // Update Role Action
  const handleUpdateRole = async (role: string) => {
    if (!selectedUser) return;
    
    try {
      const { data: roleData } = await supabase.from('roles').select('id').eq('name', role).single();

      const { error } = await supabase
        .from('users')
        .update({ role_id: roleData?.id || null })
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      
      toast(`Le rôle de ${selectedUser.name} a été modifié vers : ${role}`, "success");
      setIsEditRoleOpen(false);
      setSelectedUser(null);
      setActiveDropdownId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating admin role:", err);
      toast("Erreur lors du changement de rôle.", "error");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Rechercher par nom, email ou rôle..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={14} />
              </button>
            )}
         </div>
         <Button 
           onClick={() => setIsAddModalOpen(true)}
           className="bg-primary text-black font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-2xl shadow-lg hover:scale-105 transition-all"
         >
            <UserPlus className="mr-2 h-4 w-4" /> Ajouter un administrateur
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Users List */}
         <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-2">
               <User size={14} className="text-primary" /> Utilisateurs du Dashboard ({filteredUsers.length})
            </h4>
            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                           <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Utilisateur</th>
                           <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Rôle</th>
                           <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-500">Statut</th>
                           <th className="px-6 py-4"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-bold uppercase text-xs tracking-wider">
                              Aucun utilisateur trouvé
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((user) => (
                             <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-primary">
                                         {user.name.split(' ').map(n => n[0]).join('')}
                                      </div>
                                      <div>
                                         <p className="text-xs font-black text-white uppercase tracking-tight">{user.name}</p>
                                         <p className="text-[9px] text-slate-500">{user.email}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <span className={cn(
                                      "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border",
                                      ROLES.find(r => r.name === user.role)?.color || "bg-white/5 text-slate-400 border-white/5"
                                   )}>
                                      {user.role}
                                   </span>
                                </td>
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-2">
                                      <div className={cn("w-1.5 h-1.5 rounded-full", user.status === 'Actif' ? 'bg-emerald-500' : 'bg-slate-500')} />
                                      <span className="text-[9px] font-bold text-slate-400 uppercase">{user.status}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                   <button 
                                     onClick={() => setActiveDropdownId(activeDropdownId === user.id ? null : user.id)}
                                     className="p-2 rounded-lg text-slate-600 hover:text-white hover:bg-white/5 transition-all"
                                   >
                                      <MoreVertical size={14} />
                                   </button>
                                   
                                   {/* Context Actions Dropdown */}
                                   {activeDropdownId === user.id && (
                                     <div 
                                       ref={dropdownRef}
                                       className="absolute right-6 mt-1 w-48 bg-[#0b1b15] border border-white/10 rounded-xl shadow-2xl py-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-200"
                                     >
                                        <button 
                                          onClick={() => {
                                            setSelectedUser(user);
                                            setIsEditRoleOpen(true);
                                            setActiveDropdownId(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-xs font-bold text-slate-300 hover:text-primary hover:bg-white/5 transition-colors uppercase tracking-wider"
                                        >
                                           Modifier le rôle
                                        </button>
                                        <button 
                                          onClick={() => handleToggleStatus(user)}
                                          className="w-full text-left px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-wider"
                                        >
                                           {user.status === 'Actif' ? 'Suspendre' : 'Réactiver'}
                                        </button>
                                         {user.role !== 'Super Admin' && (
                                          <button 
                                            onClick={() => handleDeleteUser(user.id, user.name)}
                                            className="w-full text-left px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors uppercase tracking-wider border-t border-white/5 mt-1"
                                          >
                                             Révoquer l'accès
                                          </button>
                                        )}
                                     </div>
                                   )}
                                </td>
                             </tr>
                          ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Roles Summary */}
         <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 px-2">
               <Shield size={14} className="text-primary" /> Hiérarchie des Rôles
            </h4>
            <div className="space-y-3">
               {ROLES.map((role) => (
                  <div key={role.name} className="glass-card p-4 rounded-xl border border-white/5 space-y-2 hover:border-white/10 transition-all cursor-default group">
                     <div className="flex items-center justify-between">
                        <span className={cn("px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border", role.color)}>
                           {role.name}
                        </span>
                        <Star size={12} className="text-slate-700 group-hover:text-primary transition-colors" />
                     </div>
                     <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{role.description}</p>
                  </div>
               ))}
            </div>

            <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl space-y-3">
               <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Audit de Sécurité</h5>
               <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  Le dernier changement de permissions a été effectué par <span className="text-primary font-bold">Mamadou Touré</span> le 12/05/2026.
               </p>
               <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">
                  Voir les logs d'activité
               </button>
            </div>
         </div>
      </div>

      {/* 1. Ajouter un Administrateur Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="glass-card p-8 rounded-3xl border border-white/10 w-full max-w-md space-y-6 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent" />
              
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <UserPlus className="text-primary h-5 w-5" />
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Nouvel Administrateur</h3>
                 </div>
                 <button 
                   onClick={() => setIsAddModalOpen(false)}
                   className="p-1 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"
                 >
                    <X size={18} />
                 </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Nom Complet</label>
                    <input 
                      type="text" 
                      required
                      placeholder="ex: Seydou Keïta"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Adresse E-mail</label>
                    <input 
                      type="email" 
                      required
                      placeholder="ex: s.keita@femafoot.ml"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Rôle Système</label>
                    <select 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full h-12 bg-[#0b1b15] border border-white/10 rounded-xl px-3 text-sm text-white focus:outline-none appearance-none font-bold"
                    >
                       {ROLES.map(r => (
                         <option key={r.name} className="bg-[#0b1b15]" value={r.name}>{r.name}</option>
                       ))}
                    </select>
                 </div>

                 <div className="pt-4 flex items-center gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 h-12 border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/5"
                    >
                       Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-transform"
                    >
                       Créer l'accès
                    </Button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* 2. Modifier le Rôle Modal */}
      {isEditRoleOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="glass-card p-8 rounded-3xl border border-white/10 w-full max-w-md space-y-6 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent" />
              
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500 h-5 w-5" />
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Attribuer un Rôle</h3>
                 </div>
                 <button 
                   onClick={() => {
                     setIsEditRoleOpen(false);
                     setSelectedUser(null);
                   }}
                   className="p-1 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"
                 >
                    <X size={18} />
                 </button>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Utilisateur Sélectionné</p>
                 <h4 className="text-sm font-black text-white uppercase">{selectedUser.name}</h4>
                 <p className="text-[10px] text-slate-400">{selectedUser.email}</p>
              </div>

              <div className="space-y-3">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Sélectionnez le nouveau rôle</p>
                 <div className="space-y-2">
                    {ROLES.map((role) => (
                      <button
                        key={role.name}
                        onClick={() => handleUpdateRole(role.name)}
                        className={cn(
                          "w-full p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between group",
                          selectedUser.role === role.name 
                            ? "bg-primary text-black border-primary" 
                            : "bg-white/5 border-white/5 text-slate-300 hover:border-white/10 hover:bg-white/10"
                        )}
                      >
                         <div>
                            <span className={cn(
                              "text-xs font-black uppercase tracking-wide",
                              selectedUser.role === role.name ? "text-black" : "text-white"
                            )}>
                               {role.name}
                            </span>
                            <p className={cn(
                              "text-[9px] mt-0.5 font-medium leading-none",
                              selectedUser.role === role.name ? "text-black/70" : "text-slate-500"
                            )}>
                               {role.description}
                            </p>
                         </div>
                         {selectedUser.role === role.name && (
                           <Check size={16} strokeWidth={3} className="text-black" />
                         )}
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
