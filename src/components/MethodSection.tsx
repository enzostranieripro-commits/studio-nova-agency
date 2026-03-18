import { motion } from 'framer-motion';
import { Search, Palette, Zap, BarChart3 } from 'lucide-react';
import SectionHeader from './SectionHeader';

const steps = [
  { icon: Search, num: '01', title: 'Audit gratuit', desc: 'Nous analysons votre situation, vos concurrents et vos objectifs. 30 minutes suffisent pour cerner l\'essentiel.' },
  { icon: Palette, num: '02', title: 'Conception', desc: 'Design unique à votre image, pensé pour vos clients locaux. Zéro template générique, chaque pixel a un sens.' },
  { icon: Zap, num: '03', title: 'Livraison rapide', desc: 'Votre site en ligne en moins de 7 jours. Vous validez chaque étape — pas de surprise en fin de projet.' },
  { icon: BarChart3, num: '04', title: 'Suivi continu', desc: 'On reste à vos côtés après la mise en ligne. Modifications, statistiques et conseils inclus dans votre abonnement.' },
];

const MethodSection = () => (
  <section id="methode" className="py-24 grain">
    <div className="container mx-auto px-4 relative z-10">
      <SectionHeader
        label="Notre méthode"
        title="Un processus simple et transparent"
        highlight="simple et transparent"
        description="Pas de jargon, pas de mauvaise surprise. Voici comment nous travaillons ensemble."
      />
      <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto relative">
        {/* Connector line */}
        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.45 }}
            className="relative text-center"
          >
            {/* Step number */}
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 relative z-10">
              <s.icon className="text-primary" size={16} />
            </div>

            <span className="text-[0.6rem] text-muted-foreground/40 uppercase tracking-widest block mb-2">{s.num}</span>
            <h3 className="font-display text-sm font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default MethodSection;
