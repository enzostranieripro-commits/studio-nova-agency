import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Calendar, Clock } from 'lucide-react';
import { useAuditModal } from '@/hooks/useAuditModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const sectors = ['Artisan BTP', 'Restauration', 'Commerce', 'Santé / Bien-être', 'Immobilier', 'Tourisme', 'Services', 'Autre'];
const needs = ['Visibilité', 'Autorité', 'Conversion', 'Je ne sais pas'];
const timeSlots = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

const getWeekDays = (weekOffset: number) => {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1 + weekOffset * 7);
  const days: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
};

const formatDay = (d: Date) => d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
const formatDateISO = (d: Date) => d.toISOString().split('T')[0];

const AuditFormModal = () => {
  const { isOpen, close } = useAuditModal();
  const [step, setStep] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', telephone: '', secteur: '', besoin: '' });
  const [submitting, setSubmitting] = useState(false);

  const days = getWeekDays(weekOffset);

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const isStep1Valid = form.prenom && form.nom && form.email && form.secteur;

  const handleSubmit = async () => {
    if (!selectedDay || !selectedTime) return;
    setSubmitting(true);
    try {
      await supabase.from('audit_requests').insert({
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        telephone: form.telephone,
        secteur: form.secteur,
        besoin: form.besoin,
      });
      await supabase.from('bookings').insert({
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        telephone: form.telephone,
        secteur: form.secteur,
        besoin: form.besoin,
        date: formatDateISO(selectedDay),
        time: selectedTime,
        status: 'pending',
      });
      setStep(2);
      toast.success('Rendez-vous confirmé !');
    } catch {
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    }
    setSubmitting(false);
  };

  const resetAndClose = () => {
    setStep(0);
    setForm({ prenom: '', nom: '', email: '', telephone: '', secteur: '', besoin: '' });
    setSelectedDay(null);
    setSelectedTime(null);
    setWeekOffset(0);
    close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={resetAndClose}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="relative bg-card rounded-2xl border w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
          >
            <button onClick={resetAndClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-display text-2xl font-bold mb-1">Réservez votre audit gratuit</h3>
                  <p className="text-sm text-muted-foreground mb-6">30 minutes · Sans engagement · Un plan d'action concret</p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Prénom *</label>
                        <input
                          value={form.prenom}
                          onChange={e => updateForm('prenom', e.target.value)}
                          className="w-full bg-input border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom *</label>
                        <input
                          value={form.nom}
                          onChange={e => updateForm('nom', e.target.value)}
                          className="w-full bg-input border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => updateForm('email', e.target.value)}
                        className="w-full bg-input border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Téléphone</label>
                      <input
                        type="tel"
                        value={form.telephone}
                        onChange={e => updateForm('telephone', e.target.value)}
                        className="w-full bg-input border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Secteur d'activité *</label>
                      <select
                        value={form.secteur}
                        onChange={e => updateForm('secteur', e.target.value)}
                        className="w-full bg-input border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Choisir...</option>
                        {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Besoin principal</label>
                      <select
                        value={form.besoin}
                        onChange={e => updateForm('besoin', e.target.value)}
                        className="w-full bg-input border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Choisir...</option>
                        {needs.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    disabled={!isStep1Valid}
                    className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold glow-primary disabled:opacity-50 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.97] transition-all"
                  >
                    Choisir mon créneau <ChevronRight size={16} />
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-display text-2xl font-bold mb-1">Choisissez votre créneau</h3>
                  <p className="text-sm text-muted-foreground mb-6">Lundi — Vendredi · 10h à 17h</p>

                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setWeekOffset(prev => prev - 1)} className="p-2 rounded-lg hover:bg-card border">
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-medium">
                      {days[0].toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => setWeekOffset(prev => prev + 1)} className="p-2 rounded-lg hover:bg-card border">
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {days.map(d => (
                      <button
                        key={d.toISOString()}
                        onClick={() => { setSelectedDay(d); setSelectedTime(null); }}
                        className={`p-2 rounded-xl text-center text-xs border transition-all ${
                          selectedDay && formatDateISO(selectedDay) === formatDateISO(d)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'hover:bg-card'
                        }`}
                      >
                        <div className="font-medium">{d.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                        <div className="text-lg font-bold">{d.getDate()}</div>
                      </button>
                    ))}
                  </div>

                  {selectedDay && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <Calendar size={12} /> {formatDay(selectedDay)}
                      </p>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {timeSlots.map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                              selectedTime === t ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-card'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {selectedDay && selectedTime && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-primary/5 rounded-xl p-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <Clock size={14} />
                        {formatDay(selectedDay)} à {selectedTime}
                      </div>
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="px-4 py-3 rounded-xl border text-sm font-medium flex items-center gap-1">
                      <ChevronLeft size={16} /> Retour
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedDay || !selectedTime || submitting}
                      className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold glow-primary disabled:opacity-50 hover:-translate-y-0.5 active:scale-[0.97] transition-all"
                    >
                      {submitting ? 'Envoi...' : 'Confirmer mon rendez-vous'}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-16 h-16 rounded-full bg-visibility/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="text-visibility" size={32} />
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold mb-2">Rendez-vous confirmé !</h3>
                  <p className="text-primary font-semibold mb-2">
                    {selectedDay && formatDay(selectedDay)} à {selectedTime}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">Notre équipe vous appellera à l'heure choisie.</p>
                  <div className="space-y-2 text-sm text-muted-foreground text-left max-w-xs mx-auto">
                    {['Analyse de votre situation', 'Recommandations personnalisées', 'Estimation budgétaire', 'Aucun engagement'].map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <Check size={14} className="text-visibility" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={resetAndClose}
                    className="mt-6 px-6 py-3 rounded-xl border text-sm font-medium hover:bg-card transition-colors"
                  >
                    Fermer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuditFormModal;
