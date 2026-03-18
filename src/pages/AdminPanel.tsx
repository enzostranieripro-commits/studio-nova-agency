import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Calendar, FileText, BarChart3, Settings, Trash2, Download, RefreshCw, Search } from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'dashboard' | 'leads' | 'bookings' | 'products' | 'diagnostics' | 'settings';

const AdminPanel = () => {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [leads, setLeads] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const fetchAll = async () => {
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
  };

  useEffect(() => { fetchAll(); }, []);

  const exportCSV = (data: any[], name: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(r => headers.map(h => `"${r[h] ?? ''}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${name}.csv`; a.click();
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('Confirmer la suppression ?')) return;
    await (supabase.from(table as any) as any).delete().eq('id', id);
    fetchAll();
    toast.success('Élément supprimé');
  };

  const updateBookingStatus = async (id: string, status: string) => {
    await (supabase.from('bookings') as any).update({ status }).eq('id', id);
    fetchAll();
    toast.success('Statut mis à jour');
  };

  const deleteAll = async (table: string) => {
    if (!confirm(`Supprimer TOUTES les données de ${table} ?`)) return;
    await (supabase.from(table as any) as any).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    fetchAll();
    toast.success('Données supprimées');
  };

  const filteredLeads = useMemo(() =>
    leads.filter(l => `${l.prenom} ${l.nom} ${l.email} ${l.secteur}`.toLowerCase().includes(search.toLowerCase())),
    [leads, search]
  );

  // KPIs
  const totalLeads = leads.length;
  const totalBookings = bookings.length;
  const convRate = totalLeads > 0 ? Math.round((totalBookings / totalLeads) * 100) : 0;
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === today).length;

  // Activity feed
  const feed = [...leads.map(l => ({ ...l, _type: 'lead' })), ...bookings.map(b => ({ ...b, _type: 'booking' })), ...products.map(p => ({ ...p, _type: 'product' }))]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  // Sector breakdown
  const sectorCounts = leads.reduce((acc: Record<string, number>, l) => {
    acc[l.secteur || 'Autre'] = (acc[l.secteur || 'Autre'] || 0) + 1;
    return acc;
  }, {});

  const navItems: { key: Tab; label: string; icon: any; count?: number }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'leads', label: 'Leads', icon: Users, count: leads.length },
    { key: 'bookings', label: 'Rendez-vous', icon: Calendar, count: bookings.length },
    { key: 'products', label: 'Offres', icon: FileText, count: products.length },
    { key: 'diagnostics', label: 'Diagnostics', icon: BarChart3, count: diagnostics.length },
    { key: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r p-4 flex flex-col gap-1 shrink-0">
        <div className="flex items-center gap-2 mb-6 px-2">
          <span className="font-display text-lg font-bold">Studio Nova</span>
          <span className="w-2 h-2 rounded-full bg-primary" />
        </div>
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${
              tab === item.key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-card'
            }`}
          >
            <item.icon size={18} />
            {item.label}
            {item.count !== undefined && (
              <span className="ml-auto text-xs bg-card px-2 py-0.5 rounded-full">{item.count}</span>
            )}
          </button>
        ))}
        <div className="mt-auto">
          <a href="/" className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Retour au site
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold">
            {navItems.find(n => n.key === tab)?.label}
          </h1>
          <button onClick={fetchAll} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border rounded-xl px-4 py-2">
            <RefreshCw size={14} /> Actualiser
          </button>
        </div>

        {tab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Leads', value: totalLeads, color: 'text-primary' },
                { label: 'RDV planifiés', value: totalBookings, color: 'text-authority' },
                { label: 'Taux conversion', value: `${convRate}%`, color: 'text-visibility' },
                { label: 'RDV aujourd\'hui', value: todayBookings, color: 'text-conversion' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-card rounded-2xl border p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{kpi.label}</p>
                  <p className={`font-display text-3xl font-black ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Sector breakdown */}
              <div className="bg-card rounded-2xl border p-6">
                <h3 className="font-display text-sm font-bold mb-4">Par secteur</h3>
                <div className="space-y-3">
                  {Object.entries(sectorCounts).map(([sector, count]) => (
                    <div key={sector}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{sector}</span>
                        <span className="text-muted-foreground">{count as number}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${((count as number) / totalLeads) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feed */}
              <div className="bg-card rounded-2xl border p-6">
                <h3 className="font-display text-sm font-bold mb-4">Activité récente</h3>
                <div className="space-y-3">
                  {feed.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className={`w-2 h-2 rounded-full ${item._type === 'lead' ? 'bg-primary' : item._type === 'booking' ? 'bg-authority' : 'bg-conversion'}`} />
                      <span className="flex-1">{item.prenom} {item.nom}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(item.created_at)}</span>
                    </div>
                  ))}
                  {feed.length === 0 && <p className="text-sm text-muted-foreground">Aucune activité</p>}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'leads' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full bg-input border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button onClick={() => exportCSV(leads, 'leads')} className="flex items-center gap-2 border rounded-xl px-4 py-2 text-sm hover:bg-card">
                <Download size={14} /> Export CSV
              </button>
            </div>
            <div className="bg-card rounded-2xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Date</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Nom</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Email</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Téléphone</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Secteur</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(l => (
                    <tr key={l.id} className="border-b last:border-0 hover:bg-secondary/30">
                      <td className="p-4 text-muted-foreground">{formatDate(l.created_at)}</td>
                      <td className="p-4 font-medium">{l.prenom} {l.nom}</td>
                      <td className="p-4 text-muted-foreground">{l.email}</td>
                      <td className="p-4 text-muted-foreground">{l.telephone || '—'}</td>
                      <td className="p-4"><span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{l.secteur}</span></td>
                      <td className="p-4">
                        <button onClick={() => deleteItem('audit_requests', l.id)} className="text-destructive hover:text-destructive/80">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredLeads.length === 0 && <p className="p-8 text-center text-muted-foreground">Aucun lead</p>}
            </div>
          </motion.div>
        )}

        {tab === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-end mb-6">
              <button onClick={() => exportCSV(bookings, 'rdv')} className="flex items-center gap-2 border rounded-xl px-4 py-2 text-sm hover:bg-card">
                <Download size={14} /> Export CSV
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {bookings.map(b => (
                <div key={b.id} className="bg-card rounded-2xl border p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-display font-bold">{b.prenom} {b.nom}</p>
                      <p className="text-xs text-muted-foreground">{b.telephone || b.email}</p>
                    </div>
                    <select
                      value={b.status}
                      onChange={e => updateBookingStatus(b.id, e.target.value)}
                      className={`text-xs px-3 py-1 rounded-full border bg-input ${
                        b.status === 'confirmed' ? 'text-visibility border-visibility/20' :
                        b.status === 'cancelled' ? 'text-destructive border-destructive/20' :
                        'text-conversion border-conversion/20'
                      }`}
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmé</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>📅 {b.date}</span>
                    <span>🕐 {b.time}</span>
                    <span>{b.secteur}</span>
                  </div>
                  <button onClick={() => deleteItem('bookings', b.id)} className="text-xs text-destructive hover:underline">
                    Supprimer
                  </button>
                </div>
              ))}
              {bookings.length === 0 && <p className="col-span-2 p-8 text-center text-muted-foreground">Aucun rendez-vous</p>}
            </div>
          </motion.div>
        )}

        {tab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-end mb-6">
              <button onClick={() => exportCSV(products, 'offres')} className="flex items-center gap-2 border rounded-xl px-4 py-2 text-sm hover:bg-card">
                <Download size={14} /> Export CSV
              </button>
            </div>
            <div className="bg-card rounded-2xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Date</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Nom</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Email</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Offre</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Secteur</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/30">
                      <td className="p-4 text-muted-foreground">{formatDate(p.created_at)}</td>
                      <td className="p-4 font-medium">{p.prenom} {p.nom}</td>
                      <td className="p-4 text-muted-foreground">{p.email}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          p.product === 'Visibilité' ? 'bg-visibility/10 text-visibility' :
                          p.product === 'Autorité' ? 'bg-authority/10 text-authority' :
                          'bg-conversion/10 text-conversion'
                        }`}>{p.product}</span>
                      </td>
                      <td className="p-4 text-muted-foreground">{p.secteur}</td>
                      <td className="p-4">
                        <button onClick={() => deleteItem('product_requests', p.id)} className="text-destructive hover:text-destructive/80">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && <p className="p-8 text-center text-muted-foreground">Aucune demande d'offre</p>}
            </div>
          </motion.div>
        )}

        {tab === 'diagnostics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-end mb-6">
              <button onClick={() => exportCSV(diagnostics, 'diagnostics')} className="flex items-center gap-2 border rounded-xl px-4 py-2 text-sm hover:bg-card">
                <Download size={14} /> Export CSV
              </button>
            </div>
            <div className="bg-card rounded-2xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Date</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Secteur</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Site existant</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Offre reco.</th>
                    <th className="text-left p-4 text-xs uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnostics.map(d => (
                    <tr key={d.id} className="border-b last:border-0 hover:bg-secondary/30">
                      <td className="p-4 text-muted-foreground">{formatDate(d.created_at)}</td>
                      <td className="p-4">{d.secteur}</td>
                      <td className="p-4 text-muted-foreground">{d.a_un_site}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          d.offre_recommandee === 'Visibilité' ? 'bg-visibility/10 text-visibility' :
                          d.offre_recommandee === 'Autorité' ? 'bg-authority/10 text-authority' :
                          'bg-conversion/10 text-conversion'
                        }`}>{d.offre_recommandee}</span>
                      </td>
                      <td className="p-4">
                        <button onClick={() => deleteItem('diagnostics', d.id)} className="text-destructive hover:text-destructive/80">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {diagnostics.length === 0 && <p className="p-8 text-center text-muted-foreground">Aucun diagnostic</p>}
            </div>
          </motion.div>
        )}

        {tab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="max-w-lg">
              <h3 className="font-display text-lg font-bold text-destructive mb-4">Zone dangereuse</h3>
              <div className="space-y-3">
                {[
                  { label: 'Supprimer tous les leads', table: 'audit_requests' },
                  { label: 'Supprimer tous les RDV', table: 'bookings' },
                  { label: 'Supprimer toutes les demandes d\'offres', table: 'product_requests' },
                  { label: 'Supprimer tous les diagnostics', table: 'diagnostics' },
                ].map(item => (
                  <button
                    key={item.table}
                    onClick={() => deleteAll(item.table)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-destructive/20 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                  >
                    {item.label}
                    <Trash2 size={14} />
                  </button>
                ))}
              </div>

              <div className="mt-8 bg-card rounded-2xl border p-6">
                <h3 className="font-display text-sm font-bold mb-2">Statistiques de stockage</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Leads : {leads.length} entrées</p>
                  <p>Rendez-vous : {bookings.length} entrées</p>
                  <p>Demandes d'offres : {products.length} entrées</p>
                  <p>Diagnostics : {diagnostics.length} entrées</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
