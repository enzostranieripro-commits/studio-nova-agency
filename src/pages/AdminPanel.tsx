import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Users, Calendar, FileText, BarChart3, Settings,
  Trash2, Download, RefreshCw, Search, Activity, Wifi, WifiOff,
  TrendingUp, Clock, CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'dashboard' | 'leads' | 'bookings' | 'products' | 'diagnostics' | 'settings';

const AdminPanel = () => {
  const [tab, setTab]                 = useState<Tab>('dashboard');
  const [leads, setLeads]             = useState<any[]>([]);
  const [bookings, setBookings]       = useState<any[]>([]);
  const [products, setProducts]       = useState<any[]>([]);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [search, setSearch]           = useState('');
  const [isLive, setIsLive]           = useState(false);
  const [newBadge, setNewBadge]       = useState<string | null>(null);

  /* ── Fetch all ── */
  const fetchAll = useCallback(async () => {
    const [l, b, p, d] = await Promise.all([
      supabase.from('audit_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('product_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('diagnostics').select('*').order('created_at', { ascending: false }),
    ]);
    setLeads(l.data || []);
    setBookings(b.data || []);
    setProducts(p.data || []);
    setDiagnostics(d.data || []);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Real-time subscriptions ── */
  useEffect(() => {
    let liveCount = 0;

    const handleStatus = (status: string) => {
      if (status === 'SUBSCRIBED') {
        liveCount++;
        if (liveCount >= 1) setIsLive(true);
      } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        setIsLive(false);
      }
    };

    const ch1 = supabase
      .channel('audit_requests_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_requests' }, payload => {
        if (payload.eventType === 'INSERT') {
          const n = payload.new as any;
          setLeads(prev => [n, ...prev]);
          setNewBadge('leads');
          toast.success(`🔔 Nouveau lead : ${n.prenom} ${n.nom}`);
          setTimeout(() => setNewBadge(null), 5000);
        }
        if (payload.eventType === 'DELETE') {
          setLeads(prev => prev.filter((l: any) => l.id !== payload.old.id));
        }
      })
      .subscribe(handleStatus);

    const ch2 = supabase
      .channel('bookings_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
        if (payload.eventType === 'INSERT') {
          const n = payload.new as any;
          setBookings(prev => [n, ...prev]);
          setNewBadge('bookings');
          toast.success(`📅 Nouveau RDV : ${n.date} à ${n.time}`);
          setTimeout(() => setNewBadge(null), 5000);
        }
        if (payload.eventType === 'UPDATE') {
          setBookings(prev => prev.map((b: any) => b.id === (payload.new as any).id ? payload.new : b));
        }
        if (payload.eventType === 'DELETE') {
          setBookings(prev => prev.filter((b: any) => b.id !== payload.old.id));
        }
      })
      .subscribe();

    const ch3 = supabase
      .channel('product_requests_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_requests' }, payload => {
        if (payload.eventType === 'INSERT') {
          const n = payload.new as any;
          setProducts(prev => [n, ...prev]);
          setNewBadge('products');
          toast.success(`📦 Nouvelle demande d'offre : ${n.product}`);
          setTimeout(() => setNewBadge(null), 5000);
        }
        if (payload.eventType === 'DELETE') {
          setProducts(prev => prev.filter((p: any) => p.id !== payload.old.id));
        }
      })
      .subscribe();

    const ch4 = supabase
      .channel('diagnostics_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'diagnostics' }, payload => {
        if (payload.eventType === 'INSERT') {
          setDiagnostics(prev => [payload.new, ...prev]);
        }
        if (payload.eventType === 'DELETE') {
          setDiagnostics(prev => prev.filter((d: any) => d.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ch1);
      supabase.removeChannel(ch2);
      supabase.removeChannel(ch3);
      supabase.removeChannel(ch4);
    };
  }, []);

  /* ── Helpers ── */
  const exportCSV = (data: any[], name: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(r => headers.map(h => `"${r[h] ?? ''}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${name}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('Confirmer la suppression ?')) return;
    await (supabase.from(table as any) as any).delete().eq('id', id);
    toast.success('Élément supprimé');
  };

  const updateBookingStatus = async (id: string, status: string) => {
    await (supabase.from('bookings') as any).update({ status }).eq('id', id);
    toast.success('Statut mis à jour');
  };

  const deleteAll = async (table: string) => {
    if (!confirm(`Supprimer TOUTES les données de ${table} ?`)) return;
    await (supabase.from(table as any) as any).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    toast.success('Données supprimées');
  };

  const filteredLeads = useMemo(() =>
    leads.filter(l => `${l.prenom} ${l.nom} ${l.email} ${l.secteur}`.toLowerCase().includes(search.toLowerCase())),
    [leads, search]
  );

  /* ── KPIs ── */
  const totalLeads    = leads.length;
  const totalBookings = bookings.length;
  const convRate      = totalLeads > 0 ? Math.round((totalBookings / totalLeads) * 100) : 0;
  const today         = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === today).length;
  const confirmedRDV  = bookings.filter(b => b.status === 'confirmed').length;

  const feed = [
    ...leads.map(l => ({ ...l, _type: 'lead' })),
    ...bookings.map(b => ({ ...b, _type: 'booking' })),
    ...products.map(p => ({ ...p, _type: 'product' })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 12);

  const sectorCounts = leads.reduce((acc: Record<string, number>, l) => {
    acc[l.secteur || 'Autre'] = (acc[l.secteur || 'Autre'] || 0) + 1;
    return acc;
  }, {});

  const navItems: { key: Tab; label: string; icon: any; count?: number }[] = [
    { key: 'dashboard',   label: 'Dashboard',      icon: BarChart3 },
    { key: 'leads',       label: 'Leads',           icon: Users,    count: leads.length },
    { key: 'bookings',    label: 'Rendez-vous',     icon: Calendar, count: bookings.length },
    { key: 'products',    label: 'Offres',          icon: FileText, count: products.length },
    { key: 'diagnostics', label: 'Diagnostics',     icon: Activity, count: diagnostics.length },
    { key: 'settings',    label: 'Paramètres',      icon: Settings },
  ];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

  const statusBadge = (status: string) => {
    if (status === 'confirmed') return 'bg-visibility/10 text-visibility border border-visibility/20';
    if (status === 'cancelled') return 'bg-destructive/10 text-destructive border border-destructive/20';
    return 'bg-conversion/10 text-conversion border border-conversion/20';
  };

  const statusLabel = (status: string) => {
    if (status === 'confirmed') return 'Confirmé';
    if (status === 'cancelled') return 'Annulé';
    return 'En attente';
  };

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-background flex text-sm">
      {/* Sidebar */}
      <aside className="w-60 border-r border-foreground/8 p-4 flex flex-col gap-1 shrink-0">
        <div className="flex items-center gap-2 mb-5 px-2">
          <span className="font-display text-base font-bold">Studio Nova</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
        </div>

        {/* Live indicator */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg mb-3 text-xs ${isLive ? 'bg-visibility/8 text-visibility' : 'bg-muted text-muted-foreground'}`}>
          {isLive ? <Wifi size={12} /> : <WifiOff size={12} />}
          {isLive ? 'Temps réel actif' : 'Connexion en cours...'}
        </div>

        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left relative ${
              tab === item.key
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-card'
            }`}
          >
            <item.icon size={16} />
            {item.label}
            {item.count !== undefined && item.count > 0 && (
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                newBadge === item.key ? 'bg-primary text-white animate-pulse' : 'bg-foreground/8 text-muted-foreground'
              }`}>
                {item.count}
              </span>
            )}
          </button>
        ))}

        <div className="mt-auto">
          <a href="/" className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} /> Retour au site
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-xl font-bold">
            {navItems.find(n => n.key === tab)?.label}
          </h1>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground border border-foreground/10 rounded-xl px-4 py-2 hover:border-foreground/20 transition-all"
          >
            <RefreshCw size={12} /> Actualiser
          </button>
        </div>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Leads',      value: totalLeads,     color: 'text-primary',    bg: 'bg-primary/8',    icon: Users },
                { label: 'Rendez-vous',      value: totalBookings,  color: 'text-authority',  bg: 'bg-authority/8',  icon: Calendar },
                { label: 'Taux conversion',  value: `${convRate}%`, color: 'text-visibility', bg: 'bg-visibility/8', icon: TrendingUp },
                { label: 'RDV confirmés',    value: confirmedRDV,   color: 'text-conversion', bg: 'bg-conversion/8', icon: CheckCircle2 },
              ].map(kpi => (
                <div key={kpi.label} className="bg-card rounded-2xl border p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-7 h-7 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                      <kpi.icon size={14} className={kpi.color} />
                    </div>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  </div>
                  <p className={`font-display text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Today banner */}
            {todayBookings > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-visibility/5 border border-visibility/15 rounded-2xl p-4 mb-6 flex items-center gap-3"
              >
                <Clock size={16} className="text-visibility" />
                <p className="text-sm text-foreground">
                  <strong className="text-visibility">{todayBookings} rendez-vous</strong> programmé{todayBookings > 1 ? 's' : ''} aujourd'hui
                </p>
              </motion.div>
            )}

            <div className="grid lg:grid-cols-2 gap-5">
              {/* Sectors */}
              <div className="bg-card rounded-2xl border p-6">
                <h3 className="font-display text-sm font-bold mb-4 text-foreground">Leads par secteur</h3>
                {Object.keys(sectorCounts).length === 0 ? (
                  <p className="text-xs text-muted-foreground">Aucune donnée — les demandes du site apparaîtront ici</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(sectorCounts)
                      .sort((a, b) => (b[1] as number) - (a[1] as number))
                      .map(([sector, count]) => (
                        <div key={sector}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-foreground/80">{sector}</span>
                            <span className="text-muted-foreground">{count as number}</span>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-primary rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${((count as number) / totalLeads) * 100}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Activity feed */}
              <div className="bg-card rounded-2xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-sm font-bold text-foreground">Activité récente</h3>
                  <span className={`flex items-center gap-1 text-xs ${isLive ? 'text-visibility' : 'text-muted-foreground'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-visibility animate-pulse' : 'bg-muted-foreground'}`} />
                    {isLive ? 'Live' : 'Offline'}
                  </span>
                </div>
                <div className="space-y-2">
                  {feed.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Aucune activité — les soumissions du site apparaîtront ici en temps réel</p>
                  ) : (
                    feed.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs py-2 border-b border-foreground/5 last:border-0">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          item._type === 'lead' ? 'bg-primary' :
                          item._type === 'booking' ? 'bg-authority' : 'bg-conversion'
                        }`} />
                        <span className="flex-1 text-foreground/80 truncate">
                          {item.prenom} {item.nom}
                          {item._type === 'booking' && ` — RDV ${item.date} ${item.time}`}
                          {item._type === 'product' && ` — ${item.product}`}
                        </span>
                        <span className={`text-[0.6rem] px-2 py-0.5 rounded-full flex-shrink-0 ${
                          item._type === 'lead' ? 'bg-primary/10 text-primary' :
                          item._type === 'booking' ? 'bg-authority/10 text-authority' :
                          'bg-conversion/10 text-conversion'
                        }`}>
                          {item._type === 'lead' ? 'lead' : item._type === 'booking' ? 'rdv' : 'offre'}
                        </span>
                        <span className="text-muted-foreground/50 flex-shrink-0">{formatDate(item.created_at)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* LEADS */}
        {tab === 'leads' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex gap-3 mb-5">
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher par nom, email, secteur..."
                  className="w-full bg-input border border-foreground/10 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                onClick={() => exportCSV(leads, 'leads')}
                className="flex items-center gap-2 border border-foreground/10 rounded-xl px-4 py-2 text-xs hover:bg-card transition-colors"
              >
                <Download size={13} /> CSV
              </button>
            </div>

            <div className="bg-card rounded-2xl border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-foreground/8">
                    {['Date', 'Nom', 'Email', 'Téléphone', 'Secteur', 'Besoin', ''].map(h => (
                      <th key={h} className="text-left p-4 text-[0.65rem] uppercase tracking-widest text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(l => (
                    <tr key={l.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/2 transition-colors">
                      <td className="p-4 text-muted-foreground text-xs">{formatDate(l.created_at)}</td>
                      <td className="p-4 font-medium text-foreground">{l.prenom} {l.nom}</td>
                      <td className="p-4 text-muted-foreground text-xs">{l.email}</td>
                      <td className="p-4 text-muted-foreground text-xs">{l.telephone || '—'}</td>
                      <td className="p-4">
                        <span className="text-[0.65rem] bg-primary/8 text-primary px-2 py-1 rounded-full">{l.secteur}</span>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">{l.besoin || '—'}</td>
                      <td className="p-4">
                        <button onClick={() => deleteItem('audit_requests', l.id)} className="text-destructive/60 hover:text-destructive transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLeads.length === 0 && (
                <p className="p-8 text-center text-muted-foreground text-xs">Aucun lead — les demandes d'audit du site apparaîtront ici automatiquement</p>
              )}
            </div>
          </motion.div>
        )}

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-end mb-5">
              <button onClick={() => exportCSV(bookings, 'rdv')} className="flex items-center gap-2 border border-foreground/10 rounded-xl px-4 py-2 text-xs hover:bg-card transition-colors">
                <Download size={13} /> CSV
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {bookings.map(b => (
                <div key={b.id} className="bg-card rounded-2xl border p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-display font-bold text-foreground">{b.prenom} {b.nom}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{b.email}</p>
                    </div>
                    <select
                      value={b.status}
                      onChange={e => updateBookingStatus(b.id, e.target.value)}
                      className={`text-xs px-3 py-1 rounded-full border bg-input focus:outline-none cursor-pointer ${statusBadge(b.status)}`}
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmé</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                    <span>📅 {b.date}</span>
                    <span>🕐 {b.time}</span>
                    {b.secteur && <span>📂 {b.secteur}</span>}
                    {b.besoin && <span>💡 {b.besoin}</span>}
                  </div>
                  <button onClick={() => deleteItem('bookings', b.id)} className="text-xs text-destructive/60 hover:text-destructive transition-colors">
                    Supprimer
                  </button>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="col-span-2 p-8 text-center text-muted-foreground text-xs">Aucun rendez-vous — ils apparaîtront automatiquement dès qu'un client en réservera un</p>
              )}
            </div>
          </motion.div>
        )}

        {/* PRODUCTS */}
        {tab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-end mb-5">
              <button onClick={() => exportCSV(products, 'offres')} className="flex items-center gap-2 border border-foreground/10 rounded-xl px-4 py-2 text-xs hover:bg-card transition-colors">
                <Download size={13} /> CSV
              </button>
            </div>
            <div className="bg-card rounded-2xl border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-foreground/8">
                    {['Date', 'Nom', 'Email', 'Offre', 'Secteur', ''].map(h => (
                      <th key={h} className="text-left p-4 text-[0.65rem] uppercase tracking-widest text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/2 transition-colors">
                      <td className="p-4 text-muted-foreground text-xs">{formatDate(p.created_at)}</td>
                      <td className="p-4 font-medium text-foreground">{p.prenom} {p.nom}</td>
                      <td className="p-4 text-muted-foreground text-xs">{p.email}</td>
                      <td className="p-4">
                        <span className={`text-[0.65rem] px-2 py-1 rounded-full ${
                          p.product === 'Visibilité' ? 'bg-visibility/8 text-visibility' :
                          p.product === 'Autorité'   ? 'bg-authority/8 text-authority'   :
                          'bg-conversion/8 text-conversion'
                        }`}>{p.product}</span>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">{p.secteur}</td>
                      <td className="p-4">
                        <button onClick={() => deleteItem('product_requests', p.id)} className="text-destructive/60 hover:text-destructive transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <p className="p-8 text-center text-muted-foreground text-xs">Aucune demande d'offre enregistrée</p>
              )}
            </div>
          </motion.div>
        )}

        {/* DIAGNOSTICS */}
        {tab === 'diagnostics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-end mb-5">
              <button onClick={() => exportCSV(diagnostics, 'diagnostics')} className="flex items-center gap-2 border border-foreground/10 rounded-xl px-4 py-2 text-xs hover:bg-card transition-colors">
                <Download size={13} /> CSV
              </button>
            </div>
            <div className="bg-card rounded-2xl border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-foreground/8">
                    {['Date', 'Secteur', 'Site existant', 'Offre recommandée', ''].map(h => (
                      <th key={h} className="text-left p-4 text-[0.65rem] uppercase tracking-widest text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {diagnostics.map(d => (
                    <tr key={d.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/2 transition-colors">
                      <td className="p-4 text-muted-foreground text-xs">{formatDate(d.created_at)}</td>
                      <td className="p-4 text-foreground/80">{d.secteur}</td>
                      <td className="p-4 text-muted-foreground text-xs">{d.a_un_site}</td>
                      <td className="p-4">
                        <span className={`text-[0.65rem] px-2 py-1 rounded-full ${
                          d.offre_recommandee === 'Visibilité' ? 'bg-visibility/8 text-visibility' :
                          d.offre_recommandee === 'Autorité'   ? 'bg-authority/8 text-authority'   :
                          'bg-conversion/8 text-conversion'
                        }`}>{d.offre_recommandee}</span>
                      </td>
                      <td className="p-4">
                        <button onClick={() => deleteItem('diagnostics', d.id)} className="text-destructive/60 hover:text-destructive transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {diagnostics.length === 0 && (
                <p className="p-8 text-center text-muted-foreground text-xs">Aucun diagnostic enregistré</p>
              )}
            </div>
          </motion.div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md">
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 mb-6">
              <h3 className="font-display text-sm font-bold text-destructive mb-4">Zone dangereuse</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Supprimer tous les leads',           table: 'audit_requests'  },
                  { label: 'Supprimer tous les RDV',             table: 'bookings'         },
                  { label: "Supprimer toutes les demandes",      table: 'product_requests' },
                  { label: 'Supprimer tous les diagnostics',     table: 'diagnostics'      },
                ].map(item => (
                  <button
                    key={item.table}
                    onClick={() => deleteAll(item.table)}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-xs text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    {item.label}
                    <Trash2 size={12} />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border p-6">
              <h3 className="font-display text-sm font-bold mb-3 text-foreground">Statistiques globales</h3>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>Leads : <span className="text-foreground font-medium">{leads.length}</span></p>
                <p>Rendez-vous : <span className="text-foreground font-medium">{bookings.length}</span></p>
                <p>RDV confirmés : <span className="text-visibility font-medium">{confirmedRDV}</span></p>
                <p>Demandes d'offres : <span className="text-foreground font-medium">{products.length}</span></p>
                <p>Diagnostics : <span className="text-foreground font-medium">{diagnostics.length}</span></p>
                <p>Taux de conversion : <span className="text-primary font-medium">{convRate}%</span></p>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
