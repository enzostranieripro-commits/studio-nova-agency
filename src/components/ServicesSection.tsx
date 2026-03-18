import { motion } from 'framer-motion';
import { Globe, Layers, ShoppingCart, Check, Users } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { useAuditModal } from '@/hooks/useAuditModal';

const offers = [
  {
    icon: Globe,
    name: 'Visibilité',
    tagline: 'Landing page de conversion',
    desc: 'Une page unique, rapide et percutante conçue pour transformer chaque visiteur en demande client qualifiée.',
    features: ['Livraison en 7 jours ouvrés', 'Optimisée SEO local', 'Orientée conversion'],
    price: '59',
    color: 'visibility',
    badge: null,
    users: 18,
  },
  {
    icon: Layers,
    name: 'Autorité',
    tagline: 'Site vitrine multi-pages',
    desc: 'Un site complet qui génère des contacts qualifiés et renforce votre image de marque dans votre région.',
    features: ['4 à 6 pages sur-mesure', 'Portfolio & catalogue', 'SEO on-page optimisé'],
    price: '119',
    color: 'authority',
    badge: 'Le plus choisi',
    users: 23,
  },
  {
    icon: ShoppingCart,
    name: 'Conversion',
    tagline: 'Site e-commerce complet',
    desc: 'Une boutique en ligne intégrée avec paiement sécurisé pour vendre vos produits ou services directement.',
    features: ['Paiement Stripe intégré', 'Gestion des commandes', 'Tableau de bord inclus'],
    price: '199',
    color: 'conversion',
    badge: null,
    users: 11,
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string; cardClass: string }> = {
  visibility: {
    text: 'text-visibility',
    bg: 'bg-visibility/10',
    border: 'border-visibility/20',
    cardClass: 'card-visibility',
  },
  authority: {
    text: 'text-authority',
    bg: 'bg-authority/10',
    border: 'border-authority/25',
    cardClass: 'card-authority',
  },
  conversion: {
    text: 'text-conversion',
    bg: 'bg-conversion/10',
    border: 'border-conversion/20',
    cardClass: 'card-conversion',
  },
};

const ServicesSection = () => {
  const { open } = useAuditModal();

  return (
    <section id="services" className="py-24 grain">
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          label="Nos offres"
          title="Trois niveaux de présence digitale"
          highlight="digitale"
          description="Des solutions claires, transparentes et adaptées à votre situation — sans jargon technique."
        />

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {offers.map((o, i) => {
            const c = colorMap[o.color];
            return (
              <motion.div
                key={o.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`relative bg-card rounded-2xl border p-6 flex flex-col transition-shadow ${c.cardClass} ${o.badge ? 'ring-1 ring-authority/20' : ''}`}
              >
                {/* Badge */}
                {o.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[0.65rem] uppercase tracking-widest font-semibold bg-authority text-white px-4 py-1 rounded-full shadow-lg">
                      {o.badge}
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center mb-4 mt-2`}>
                  <o.icon className={c.text} size={20} />
                </div>

                {/* Header */}
                <div className="mb-3">
                  <h3 className="font-display text-lg font-bold text-foreground mb-0.5">{o.name}</h3>
                  <p className="text-xs text-muted-foreground tracking-wide">{o.tagline}</p>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{o.desc}</p>

                {/* Features */}
                <ul className="space-y-2 mb-5">
                  {o.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <span className={`w-4 h-4 rounded-full ${c.bg} flex items-center justify-center flex-shrink-0`}>
                        <Check className={c.text} size={10} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Social proof */}
                <div className="flex items-center gap-2 mb-4 py-2.5 px-3 rounded-lg bg-foreground/3 border border-foreground/5">
                  <Users size={12} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{o.users} clients</span> ont choisi cette offre
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-muted-foreground">à partir de</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className={`font-display text-3xl font-bold ${c.text}`}>{o.price}€</span>
                    <span className="text-muted-foreground text-sm">/mois</span>
                  </div>
                </div>

                <button
                  onClick={open}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${c.bg} ${c.text} border ${c.border} hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98]`}
                >
                  Demander un audit
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Global social proof */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-sm text-muted-foreground">
            🏆 <span className="text-foreground font-medium">47 entreprises</span> nous ont déjà fait confiance en Aveyron &amp; Occitanie
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
