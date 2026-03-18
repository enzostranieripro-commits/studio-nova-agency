import { motion } from 'framer-motion';
import { SearchX, MousePointerClick, ShieldAlert, Clock } from 'lucide-react';
import SectionHeader from './SectionHeader';

const problems = [
  { icon: SearchX, title: "Vous n'apparaissez pas sur Google", desc: "Vos concurrents captent vos clients potentiels chaque jour." },
  { icon: MousePointerClick, title: "Votre site ne génère aucun contact", desc: "Des visiteurs arrivent et repartent sans vous contacter." },
  { icon: ShieldAlert, title: "Vous manquez de crédibilité en ligne", desc: "Un site vieillissant fait fuir les prospects avant même qu'ils appellent." },
  { icon: Clock, title: "Vous perdez du temps sur des tâches répétitives", desc: "Devis, rappels, réservations — tout se fait encore à la main." },
];

const ProblemSection = () => (
  <section className="py-24 grain">
    <div className="container mx-auto px-4 relative z-10">
      <SectionHeader
        label="Le constat"
        title="Votre activité mérite mieux qu'un site invisible"
        highlight="invisible"
        highlightColor="text-destructive"
      />
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl border p-6 hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
              <p.icon className="text-destructive" size={22} />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">{p.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
