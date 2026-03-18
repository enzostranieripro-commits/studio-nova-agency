import { motion } from 'framer-motion';
import { Globe, Layers, ShoppingCart, Check } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { useAuditModal } from '@/hooks/useAuditModal';

const offers = [
  {
    icon: Globe,
    name: 'Visibilité',
    tagline: 'Landing page de conversion',
    desc: "Une page unique, rapide et percutante conçue pour transformer chaque visiteur en demande client qualifiée.",
    features: ['Livraison en 7 jours ouvrés', 'Optimisée SEO local & vitesse', '100% orientée conversion'],
    price: '59',
    color: 'visibility',
    badge: false,
  },
  {
    icon: Layers,
    name: 'Autorité',
    tagline: 'Site vitrine multi-pages',
    desc: "Un site multi-pages professionnel qui génère des contacts qualifiés et renforce votre image de marque locale.",
    features: ['4 à 6 pages sur-mesure', 'Catalogue & portfolio inclus', 'SEO on-page optimisé'],
    price: '119',
    color: 'authority',
    badge: true,
  },
  {
    icon: ShoppingCart,
    name: 'Conversion',
    tagline: 'Site commercial avec paiement en ligne',
    desc: "Un e-commerce complet intégrant le paiement en ligne pour vendre vos produits ou services directement.",
    features: ['Paiement en ligne intégré', 'Gestion commandes & emails auto', 'Tableau de bord inclus'],
    price: '199',
    color: 'conversion',
    badge: false,
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  visibility: { text: 'text-visibility', bg: 'bg-visibility/10', border: 'border-visibility/20', glow: 'glow-visibility' },
  authority: { text: 'text-authority', bg: 'bg-authority/10', border: 'border-authority/20', glow: 'glow-authority' },
  conversion: { text: 'text-conversion', bg: 'bg-conversion/10', border: 'border-conversion/20', glow: 'glow-conversion' },
};

const ServicesSection = () => {
  const { open } = useAuditModal();

  return (
    <section id="services" className="py-24 grain">
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          label="Nos offres"
          title="Trois niveaux de présence pour développer votre activité"
          highlight="développer"
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {offers.map((o, i) => {
            const c = colorMap[o.color];
            return (
              <motion.div
                key={o.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className={`relative bg-card rounded-2xl border p-6 hover:shadow-xl transition-all flex flex-col`}
              >
                {o.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest font-semibold bg-authority text-primary-foreground px-4 py-1 rounded-full">
                    Le plus choisi
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
                  <o.icon className={c.text} size={22} />
                </div>
                <h3 className={`font-display text-xl font-bold ${c.text} mb-1`}>{o.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{o.tagline}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{o.desc}</p>
                <ul className="space-y-2 mb-6">
                  {o.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className={c.text} size={16} />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mb-4">
                  <span className="text-xs text-muted-foreground">à partir de</span>
                  <span className={`font-display text-3xl font-black ${c.text} ml-2`}>{o.price}€</span>
                  <span className="text-muted-foreground text-sm">/mois</span>
                </div>
                <button
                  onClick={open}
                  className={`w-full py-3 rounded-xl text-sm font-semibold ${c.bg} ${c.text} border ${c.border} hover:-translate-y-0.5 active:scale-[0.97] transition-all`}
                >
                  Demander un audit
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
