import { motion } from 'framer-motion';
import { Search, Palette, Zap, BarChart3 } from 'lucide-react';
import SectionHeader from './SectionHeader';

const steps = [
  { icon: Search, num: '01', title: 'Audit gratuit', desc: "On analyse votre situation, vos concurrents, vos objectifs. 30 minutes suffisent." },
  { icon: Palette, num: '02', title: 'Conception sur-mesure', desc: "Design unique à votre image. Zéro template générique. Zéro copier-coller." },
  { icon: Zap, num: '03', title: 'Livraison rapide', desc: "Votre site en ligne en moins de 7 jours ouvrés. Vous validez chaque étape." },
  { icon: BarChart3, num: '04', title: 'Suivi & optimisation', desc: "On reste à vos côtés après la mise en ligne. Modifications, stats, conseils inclus." },
];

const MethodSection = () => (
  <section id="methode" className="py-24">
    <div className="container mx-auto px-4">
      <SectionHeader
        label="Notre méthode"
        title="Notre méthode en 4 étapes"
        highlight="4 étapes"
      />
      <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative text-center"
          >
            <span className="font-display text-7xl font-black text-primary/10 absolute -top-4 left-1/2 -translate-x-1/2">
              {s.num}
            </span>
            <div className="relative pt-12">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <s.icon className="text-primary" size={24} />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default MethodSection;
