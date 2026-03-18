import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Layers, ShoppingCart, Check, ChevronRight, ChevronLeft, Zap, Star } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { useAuditModal } from '@/hooks/useAuditModal';

const offerData = [
  {
    key: 'visibility',
    icon: Globe,
    name: 'Visibilité',
    tagline: 'Landing page de conversion',
    desc: 'Une page unique, percutante, optimisée pour convertir.',
    price: { monthly: 59, yearly: 49, once: 990 },
    color: 'visibility',
    users: 18,
    included: [
      "Page d'accueil optimisée",
      'Design responsive mobile',
      'Formulaire de contact',
      'Hébergement & domaine',
      'Certificat SSL inclus',
      'Support technique',
    ],
    options: [
      { name: 'Google Calendar intégré', setup: 350, monthly: 19 },
      { name: 'Widget WhatsApp flottant', setup: 150, monthly: 9 },
      { name: 'Tracking Google Analytics', setup: 200, monthly: 0 },
      { name: 'Blog / actualités SEO', setup: 300, monthly: 19 },
    ],
  },
  {
    key: 'authority',
    icon: Layers,
    name: 'Autorité',
    tagline: 'Site vitrine multi-pages',
    desc: 'Un site professionnel complet qui inspire confiance.',
    price: { monthly: 119, yearly: 99, once: 1990 },
    color: 'authority',
    users: 23,
    included: [
      '4 à 6 pages sur-mesure',
      'Portfolio / catalogue',
      'SEO on-page optimisé',
      'Formulaire de contact avancé',
      'Hébergement premium',
      'Support prioritaire',
    ],
    options: [
      { name: 'CRM suivi des leads', setup: 400, monthly: 29 },
      { name: 'Prise de RDV en ligne', setup: 350, monthly: 19 },
      { name: 'Avis clients automatisés', setup: 250, monthly: 15 },
      { name: 'Blog + outil rédaction SEO', setup: 300, monthly: 19 },
    ],
  },
  {
    key: 'conversion',
    icon: ShoppingCart,
    name: 'Conversion',
    tagline: 'Site e-commerce complet',
    desc: 'Vendez en ligne avec un système complet et autonome.',
    price: { monthly: 199, yearly: 169, once: 3490 },
    color: 'conversion',
    users: 11,
    included: [
      'Boutique en ligne complète',
      'Paiement Stripe intégré',
      'Gestion des commandes',
      'Emails automatiques',
      'Tableau de bord',
      'Support dédié',
    ],
    options: [
      { name: 'Codes promo & réductions', setup: 300, monthly: 19 },
      { name: 'Abonnements récurrents', setup: 500, monthly: 29 },
      { name: 'Analytics avancé', setup: 600, monthly: 49 },
      { name: 'Notifications SMS auto', setup: 350, monthly: 25 },
    ],
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string; accent: string }> = {
  visibility: { text: 'text-visibility', bg: 'bg-visibility/10', border: 'border-visibility/20', accent: 'hsl(var(--offer-visibility))' },
  authority:  { text: 'text-authority',  bg: 'bg-authority/10',  border: 'border-authority/20',  accent: 'hsl(var(--offer-authority))'  },
  conversion: { text: 'text-conversion', bg: 'bg-conversion/10', border: 'border-conversion/20', accent: 'hsl(var(--offer-conversion))' },
};

const formats = [
  { key: 'monthly', name: 'Mensuel',      sub: 'Sans engagement',  badge: null },
  { key: 'yearly',  name: 'Annuel',       sub: '2 mois offerts',   badge: 'Économique' },
  { key: 'once',    name: 'Achat unique', sub: 'Paiement en une fois', badge: null },
];

const stepLabels = ['Choisir une offre', 'Contenu inclus', 'Options', 'Format & prix'];

const PricingSection = () => {
  const [step, setStep]                   = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<boolean[]>([false, false, false, false]);
  const [selectedFormat, setSelectedFormat] = useState<string>('monthly');
  const { open } = useAuditModal();

  const offer = selectedOffer !== null ? offerData[selectedOffer] : null;
  const c     = offer ? colorMap[offer.color] : null;

  const toggleOption = (idx: number) =>
    setSelectedOptions(prev => prev.map((v, i) => (i === idx ? !v : v)));

  const getTotal = () => {
    if (!offer) return 0;
    const fmt = selectedFormat as 'monthly' | 'yearly' | 'once';
    let base = offer.price[fmt];
    offer.options.forEach((opt, i) => {
      if (selectedOptions[i]) base += fmt === 'once' ? opt.setup : opt.monthly;
    });
    return base;
  };

  return (
    <section id="tarifs" className="py-24 grain">
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          label="Configurateur"
          title="Construisez votre offre sur-mesure"
          highlight="sur-mesure"
          description="Sélectionnez votre pack, ajoutez les options qui vous correspondent et obtenez une estimation claire en moins d'une minute."
        />

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-12 overflow-x-auto pb-1">
          {stepLabels.map((label, i) => (
            <button
              key={label}
              onClick={() => { if (i === 0 || selectedOffer !== null) setStep(i); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                step === i
                  ? 'bg-primary text-white shadow-lg'
                  : step > i
                  ? 'bg-primary/15 text-primary'
                  : 'bg-card text-muted-foreground border'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold flex-shrink-0 ${
                step > i ? 'bg-primary text-white' : 'bg-foreground/10'
              }`}>
                {step > i ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* Step 0 — Choose offer */}
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto"
            >
              {offerData.map((o, i) => {
                const oc = colorMap[o.color];
                const isSelected = selectedOffer === i;
                return (
                  <motion.button
                    key={o.key}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setSelectedOffer(i); setSelectedOptions([false, false, false, false]); setStep(1); }}
                    className={`bg-card rounded-2xl border p-6 text-left transition-all relative overflow-hidden group ${
                      isSelected ? `border-2 ${oc.border}` : 'hover:border-foreground/15'
                    }`}
                  >
                    {/* Subtle gradient top bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
                      style={{ background: oc.accent }}
                    />

                    <div className={`w-10 h-10 rounded-xl ${oc.bg} flex items-center justify-center mb-4`}>
                      <o.icon className={oc.text} size={18} />
                    </div>

                    <h3 className="font-display text-lg font-bold text-foreground mb-1">{o.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{o.tagline}</p>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{o.desc}</p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground">dès </span>
                        <span className={`font-display text-xl font-bold ${oc.text}`}>{o.price.monthly}€</span>
                        <span className="text-xs text-muted-foreground">/mois</span>
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${oc.text} font-medium`}>
                        Choisir <ChevronRight size={13} />
                      </div>
                    </div>

                    {/* Users */}
                    <div className="mt-3 pt-3 border-t border-foreground/5 text-xs text-muted-foreground">
                      {o.users} clients utilisent cette offre
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {/* Step 1 — Included content */}
          {step === 1 && offer && c && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-card rounded-2xl border p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                    <offer.icon className={c.text} size={18} />
                  </div>
                  <div>
                    <h3 className={`font-display text-lg font-bold ${c.text}`}>{offer.name}</h3>
                    <p className="text-xs text-muted-foreground">{offer.tagline}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-5">Tout est inclus dans votre abonnement, sans surprise :</p>

                <div className="grid grid-cols-2 gap-2.5 mb-7">
                  {offer.included.map(item => (
                    <div key={item} className="flex items-start gap-2 text-sm">
                      <span className={`w-4 h-4 rounded-full ${c.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className={c.text} size={9} strokeWidth={3} />
                      </span>
                      <span className="text-foreground/80 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="px-5 py-2.5 rounded-xl border text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
                    <ChevronLeft size={15} /> Retour
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${c.bg} ${c.text} border ${c.border} hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2`}
                  >
                    Personnaliser <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2 — Options */}
          {step === 2 && offer && c && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="max-w-2xl mx-auto"
            >
              <p className="text-center text-sm text-muted-foreground mb-6">Enrichissez votre site avec des fonctionnalités supplémentaires :</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-7">
                {offer.options.map((opt, i) => (
                  <motion.button
                    key={opt.name}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleOption(i)}
                    className={`bg-card rounded-xl border p-4 text-left transition-all group relative ${
                      selectedOptions[i] ? `border-2 ${c.border}` : 'hover:border-foreground/15'
                    }`}
                  >
                    {selectedOptions[i] && (
                      <span className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full ${c.bg} flex items-center justify-center`}>
                        <Check className={c.text} size={11} strokeWidth={3} />
                      </span>
                    )}
                    <h4 className="font-medium text-sm text-foreground mb-1.5 pr-6">{opt.name}</h4>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>+{opt.setup}€ setup</span>
                      {opt.monthly > 0 && <span>·</span>}
                      {opt.monthly > 0 && <span>+{opt.monthly}€/mois</span>}
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl border text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
                  <ChevronLeft size={15} /> Retour
                </button>
                <button
                  onClick={() => setStep(3)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${c.bg} ${c.text} border ${c.border} hover:opacity-90 transition-all flex items-center justify-center gap-2`}
                >
                  Voir le prix <ChevronRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Format & Price */}
          {step === 3 && offer && c && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="max-w-2xl mx-auto"
            >
              {/* Format selector */}
              <div className="grid sm:grid-cols-3 gap-3 mb-7">
                {formats.map(f => (
                  <motion.button
                    key={f.key}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedFormat(f.key)}
                    className={`relative bg-card rounded-xl border p-4 text-center transition-all ${
                      selectedFormat === f.key ? `border-2 ${c.border}` : 'hover:border-foreground/15'
                    }`}
                  >
                    {f.badge && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[0.6rem] uppercase tracking-widest font-bold bg-visibility text-white px-3 py-0.5 rounded-full">
                        {f.badge}
                      </span>
                    )}
                    <p className="font-display text-sm font-bold text-foreground mt-1">{f.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.sub}</p>
                  </motion.button>
                ))}
              </div>

              {/* Recap */}
              <div className="bg-card rounded-2xl border p-6 mb-5">
                <h4 className="font-display text-sm font-bold text-foreground mb-4">Récapitulatif de votre offre</h4>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/80">Pack {offer.name}</span>
                    <span className="font-semibold text-foreground">
                      {offer.price[selectedFormat as keyof typeof offer.price]}€
                      {selectedFormat !== 'once' ? '/mois' : ''}
                    </span>
                  </div>
                  {offer.options.map((opt, i) =>
                    selectedOptions[i] ? (
                      <div key={opt.name} className="flex justify-between text-muted-foreground text-xs">
                        <span>+ {opt.name}</span>
                        <span>
                          {selectedFormat === 'once' ? `${opt.setup}€` : `${opt.monthly}€/mois`}
                        </span>
                      </div>
                    ) : null
                  )}
                </div>

                <div className="border-t border-foreground/8 pt-4 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total estimé</span>
                  <div className="text-right">
                    <span className={`font-display text-3xl font-bold ${c.text}`}>
                      {getTotal()}€
                    </span>
                    {selectedFormat !== 'once' && (
                      <span className="text-muted-foreground text-sm">/mois</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div className="flex items-center gap-2 mb-5 text-xs text-muted-foreground justify-center">
                <Star size={12} className="text-conversion fill-conversion" />
                <Star size={12} className="text-conversion fill-conversion" />
                <Star size={12} className="text-conversion fill-conversion" />
                <Star size={12} className="text-conversion fill-conversion" />
                <Star size={12} className="text-conversion fill-conversion" />
                <span className="ml-1">{offer.users} clients satisfaits sur cette offre</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-5 py-2.5 rounded-xl border text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-1.5">
                  <ChevronLeft size={15} /> Retour
                </button>
                <button
                  onClick={open}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground glow-primary hover:-translate-y-0.5 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={14} /> Valider &amp; obtenir mon audit gratuit
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Prix indicatifs · Devis précis établi lors de l'audit gratuit · Sans engagement
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PricingSection;
