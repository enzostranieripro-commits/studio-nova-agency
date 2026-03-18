import { motion } from 'framer-motion';
import { SearchX, MousePointerClick, ShieldAlert, Clock } from 'lucide-react';
import SectionHeader from './SectionHeader';

const problems = [
  {
    icon: SearchX,
    title: 'Invisible sur Google',
    desc: 'Vos concurrents captent chaque jour des clients qui ne vous trouvent pas — même si vous faites un meilleur travail.',
  },
  {
    icon: MousePointerClick,
    title: 'Un site qui ne génère rien',
    desc: 'Des visiteurs arrivent et repartent sans vous contacter. Le site existe, mais il ne travaille pas pour vous.',
  },
  {
    icon: ShieldAlert,
    title: 'Une image qui ne rassure pas',
    desc: 'Un site vieillissant ou absent crée un doute dans l\'esprit de vos prospects — avant même qu\'ils appellent.',
  },
  {
    icon: Clock,
    title: 'Du temps perdu en tâches répétitives',
    desc: 'Devis, rappels, réservations — tout se fait encore manuellement. Chaque heure perdue, c\'est un client de moins.',
  },
];

const ProblemSection = () => (
  <section className="py-24">
    <div className="container mx-auto px-4">
      <SectionHeader
        label="Le constat"
        title="Ce qui freine votre activité en ligne"
        highlight="freine votre activité"
        description="Des problèmes courants, avec des solutions claires. Studio Nova les résout pour vous, concrètement."
      />
      <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
            className="bg-card rounded-2xl border p-6 group hover:border-foreground/12 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4 group-hover:bg-destructive/8 transition-colors">
              <p.icon className="text-muted-foreground group-hover:text-destructive/80 transition-colors" size={18} />
            </div>
            <h3 className="font-display text-base font-bold text-foreground mb-2">{p.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
