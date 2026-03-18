import { motion } from 'framer-motion';
import { TrendingUp, UserCheck, Zap } from 'lucide-react';
import SectionHeader from './SectionHeader';

const solutions = [
  {
    icon: TrendingUp,
    title: 'Référencement local optimisé',
    desc: 'Votre entreprise apparaît dans les premiers résultats Google Maps et Search pour votre zone d\'activité.',
    example: '"plombier Rodez" → position 1 sur Google Maps',
  },
  {
    icon: UserCheck,
    title: 'Un site qui convertit',
    desc: 'Chaque page est conçue pour transformer les visiteurs en prises de contact — pas juste pour être beau.',
    example: 'Taux de conversion moyen multiplié par 3 après refonte',
  },
  {
    icon: Zap,
    title: 'Des processus simplifiés',
    desc: 'Devis en ligne, prise de RDV, rappels automatiques — votre site travaille pour vous en continu.',
    example: '5h/semaine économisées en moyenne par nos clients',
  },
];

const SolutionsSection = () => (
  <section className="py-24 grain">
    <div className="container mx-auto px-4 relative z-10">
      <SectionHeader
        label="La solution"
        title="Comment Studio Nova fait la différence"
        highlight="fait la différence"
        description="Des résultats mesurables, pas des promesses. Voici ce que nos clients constatent dans les premières semaines."
      />
      <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
        {solutions.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.45 }}
            className="bg-card rounded-2xl border p-6 group hover:border-visibility/20 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-visibility/8 flex items-center justify-center mb-4 group-hover:bg-visibility/15 transition-colors">
              <s.icon className="text-visibility" size={18} />
            </div>
            <h3 className="font-display text-base font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">{s.desc}</p>
            <p className="text-xs text-visibility/80 font-medium border-l-2 border-visibility/30 pl-3 leading-relaxed">{s.example}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionsSection;
