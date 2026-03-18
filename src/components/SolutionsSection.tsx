import { motion } from 'framer-motion';
import { TrendingUp, UserCheck, Zap } from 'lucide-react';
import SectionHeader from './SectionHeader';

const solutions = [
  {
    icon: TrendingUp,
    title: 'Référencement local optimisé',
    desc: 'Votre entreprise apparaît dans les premiers résultats Google Maps et Search pour votre zone.',
    example: 'Ex : "plombier Rodez" → position 1 sur Google Maps',
  },
  {
    icon: UserCheck,
    title: 'Un site qui convertit',
    desc: 'Chaque page est conçue pour transformer les visiteurs en demandes de contact qualifiées.',
    example: 'Ex : taux de conversion moyen x3 après refonte',
  },
  {
    icon: Zap,
    title: 'Des processus simplifiés',
    desc: 'Devis en ligne, prise de RDV, rappels — tout fonctionne en pilote pour vous.',
    example: 'Ex : 5h/semaine économisées en moyenne',
  },
];

const SolutionsSection = () => (
  <section className="py-24">
    <div className="container mx-auto px-4">
      <SectionHeader
        label="La solution"
        title="Studio Nova règle ça, concrètement"
        highlight="concrètement"
      />
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {solutions.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl border p-6 hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-visibility/10 flex items-center justify-center mb-4">
              <s.icon className="text-visibility" size={22} />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">{s.desc}</p>
            <p className="text-xs text-primary font-medium">{s.example}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionsSection;
