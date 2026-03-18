import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Layers, ShoppingCart, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { useAuditModal } from '@/hooks/useAuditModal';

const offerData = [
  {
    key: 'visibility',
    icon: Globe,
    name: 'Visibilité',
    tagline: 'Landing page de conversion',
    desc: 'Une page unique, rapide et percutante.',
    price: { monthly: 59, yearly: 49, once: 990 },
    color: 'visibility',
    included: [
      'Page d\'accueil optimisée', 'Design responsive mobile', 'Formulaire de contact',
      'Hébergement & nom de domaine', 'Certificat SSL inclus', 'Support technique'
    ],
    options: [
      { name: 'Intégration Google Calendar', setup: 350, monthly: 19 },
      { name: 'Widget WhatsApp flottant', setup: 150, monthly: 9 },
      { name: 'Tracking Google Analytics', setup: 200, monthly: 0 },
      { name: 'Section blog / actualités SEO', setup: 300, monthly: 19 },
    ]
  },
  {
    key: 'authority',
    icon: Layers,
    name: 'Autorité',
    tagline: 'Site vitrine multi-pages',
    desc: 'Un site professionnel multi-pages.',
    price: { monthly: 119, yearly: 99, once: 1990 },
    color: 'authority',
    included: [
      '4 à 6 pages sur-mesure', 'Portfolio / catalogue', 'SEO on-page optimisé',
      'Formulaire de contact avancé', 'Hébergement premium', 'Support prioritaire'
    ],
    options: [
      { name: 'Tableau de suivi des leads CRM', setup: 400, monthly: 29 },
      { name: 'Google Calendar intégré', setup: 350, monthly: 19 },
      { name: 'Avis clients automatisés', setup: 250, monthly: 15 },
      { name: 'Blog + outil rédaction SEO', setup: 300, monthly: 19 },
    ]
  },
  {
    key: 'conversion',
    icon: ShoppingCart,
    name: 'Conversion',
    tagline: 'Site commercial complet',
    desc: 'E-commerce avec paiement en ligne.',
    price: { monthly: 199, yearly: 169, once: 3490 },
    color: 'conversion',
    included: [
      'Boutique en ligne complète', 'Paiement Stripe intégré', 'Gestion des commandes',
      'Emails automatiques', 'Tableau de bord', 'Support dédié'
    ],
    options: [
      { name: 'Codes promo / réductions', setup: 300, monthly: 19 },
      { name: 'Abonnements récurrents Stripe', setup: 500, monthly: 29 },
      { name: 'Dashboard Analytics avancé', setup: 600, monthly: 49 },
      { name: 'Notifications SMS/email auto', setup: 350, monthly: 25 },
    ]
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  visibility: { text: 'text-visibility', bg: 'bg-visibility/10', border: 'border-visibility/20' },
  authority: { text: 'text-authority', bg: 'bg-authority/10', border: 'border-authority/20' },
  conversion: { text: 'text-conversion', bg: 'bg-conversion/10', border: 'border-conversion/20' },
};

const formats = [
  { key: 'monthly', name: 'Mensuel', desc: 'Sans engagement' },
  { key: 'yearly', name: 'Annuel', desc: '2 mois offerts', badge: 'Économique' },
  { key: 'once', name: 'Achat unique', desc: 'Paiement en une fois' },
];

const PricingSection = () => {
  const [step, setStep] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<boolean[]>([false, false, false, false]);
  const [selectedFormat, setSelectedFormat] = useState<string>('monthly');
  const { open } = useAuditModal();

  const offer = selectedOffer !== null ? offerData[selectedOffer] : null;
  const c = offer ? colorMap[offer.color] : null;

  const toggleOption = (idx: number) => {
    setSelectedOptions(prev => prev.map((v, i) => i === idx ? !v : v));
  };

  const getTotal = () => {
    if (!offer) return 0;
    const format = selectedFormat as 'monthly' | 'yearly' | 'once';
    let base = offer.price[format];
    offer.options.forEach((opt, i) => {
      if (selectedOptions[i]) {
        if (format === 'once') base += opt.setup;
        else base += opt.monthly;
      }
    });
    return base;
  };

  const stepLabels = ['Offre', 'Contenu', 'Options', 'Format & Prix'];

  return (
    <section id="tarifs" className="py-24 grain">
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          label="Configurateur"
          title="Construisez votre offre sur-mesure"
          highlight="sur-mesure"
        />

        {/* Stepper */}
        <div className="flex justify-center gap-2 mb-12">
          {stepLabels.map((label, i) => (
            <button
              key={label}
              onClick={() => {
                if (i === 0 || (i > 0 && selectedOffer !== null)) setStep(i);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                step === i ? 'bg-primary text-primary-foreground' : step > i ? 'bg-primary/20 text-primary' : 'bg-card text-muted-foreground'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {offerData.map((o, i) => {
                const oc = colorMap[o.color];
                return (
                  <motion.button
                    key={o.key}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setSelectedOffer(i); setSelectedOptions([false, false, false, false]); setStep(1); }}
                    className={`bg-card rounded-2xl border p-6 text-left hover:shadow-xl transition-shadow ${selectedOffer === i ? `border-2 ${oc.border}` : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${oc.bg} flex items-center justify-center mb-4`}>
                      <o.icon className={oc.text} size={22} />
                    </div>
                    <h3 className={`font-display text-xl font-bold ${oc.text}`}>{o.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{o.tagline}</p>
                    <p className="text-xs text-muted-foreground">à partir de <span className={`font-bold ${oc.text}`}>{o.price.monthly}€/mois</span></p>
                    <div className={`mt-4 text-xs ${oc.text} font-medium flex items-center gap-1`}>
                      Configurer <ChevronRight size={14} />
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {step === 1 && offer && c && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-2xl mx-auto">
              <div className="bg-card rounded-2xl border p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center`}>
                    <offer.icon className={c.text} size={22} />
                  </div>
                  <div>
                    <h3 className={`font-display text-xl font-bold ${c.text}`}>{offer.name}</h3>
                    <p className="text-sm text-muted-foreground">{offer.desc}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {offer.included.map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <Check className={c.text} size={16} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="px-6 py-3 rounded-xl border text-sm font-medium hover:bg-card transition-colors flex items-center gap-2">
                    <ChevronLeft size={16} /> Retour
                  </button>
                  <button onClick={() => setStep(2)} className={`flex-1 py-3 rounded-xl text-sm font-semibold ${c.bg} ${c.text} border ${c.border} hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2`}>
                    Personnaliser avec des options <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && offer && c && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-3xl mx-auto">
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {offer.options.map((opt, i) => (
                  <motion.button
                    key={opt.name}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleOption(i)}
                    className={`bg-card rounded-2xl border p-5 text-left transition-all ${selectedOptions[i] ? `border-2 ${c.border} shadow-lg` : 'hover:shadow-md'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-display text-sm font-bold">{opt.name}</h4>
                      <div className={`w-5 h-5 rounded-md border ${selectedOptions[i] ? `${c.bg} ${c.border}` : 'border-muted-foreground/30'} flex items-center justify-center`}>
                        {selectedOptions[i] && <Check className={c.text} size={12} />}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">+{opt.setup}€ setup · +{opt.monthly}€/mois</p>
                  </motion.button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border text-sm font-medium hover:bg-card transition-colors flex items-center gap-2">
                  <ChevronLeft size={16} /> Retour
                </button>
                <button onClick={() => setStep(3)} className={`flex-1 py-3 rounded-xl text-sm font-semibold ${c.bg} ${c.text} border ${c.border} hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2`}>
                  Voir les tarifs <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && offer && c && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-3xl mx-auto">
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {formats.map(f => (
                  <motion.button
                    key={f.key}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedFormat(f.key)}
                    className={`relative bg-card rounded-2xl border p-5 text-center transition-all ${selectedFormat === f.key ? `border-2 ${c.border}` : ''}`}
                  >
                    {f.badge && (
                      <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest font-bold ${c.bg} ${c.text} px-3 py-0.5 rounded-full`}>
                        {f.badge}
                      </span>
                    )}
                    <h4 className="font-display text-base font-bold mb-1">{f.name}</h4>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </motion.button>
                ))}
              </div>

              {/* Recap */}
              <div className="bg-card rounded-2xl border p-6 mb-6">
                <h4 className="font-display text-lg font-bold mb-4">Récapitulatif</h4>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span>Pack {offer.name}</span>
                    <span className="font-semibold">{offer.price[selectedFormat as keyof typeof offer.price]}€{selectedFormat !== 'once' ? '/mois' : ''}</span>
                  </div>
                  {offer.options.map((opt, i) => selectedOptions[i] && (
                    <div key={opt.name} className="flex justify-between text-muted-foreground">
                      <span>+ {opt.name}</span>
                      <span>{selectedFormat === 'once' ? `${opt.setup}€` : `${opt.monthly}€/mois`}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="font-display font-bold">Total</span>
                  <span className={`font-display text-2xl font-black ${c.text}`}>
                    {getTotal()}€{selectedFormat !== 'once' ? '/mois' : ''}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border text-sm font-medium hover:bg-card transition-colors flex items-center gap-2">
                  <ChevronLeft size={16} /> Retour
                </button>
                <button
                  onClick={open}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground glow-primary hover:-translate-y-0.5 active:scale-[0.97] transition-all`}
                >
                  Obtenir mon audit gratuit
                </button>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Tous les prix sont indicatifs. Le devis précis est établi lors de l'audit.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PricingSection;
