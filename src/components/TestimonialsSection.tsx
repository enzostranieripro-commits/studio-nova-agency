import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import SectionHeader from './SectionHeader';

const testimonials = [
  { name: 'Marc D.', job: 'Plombier', city: 'Rodez', text: "Avant Studio Nova, je n'avais aucun contact en ligne. Maintenant je reçois 12 demandes par semaine.", before: '0 contact/semaine', after: '12 contacts/semaine' },
  { name: 'Claire L.', job: 'Photographe', city: 'Albi', text: "Mon portfolio en ligne m'a permis de doubler mes réservations en 3 mois. Un travail remarquable.", before: '4 réservations/mois', after: '9 réservations/mois' },
  { name: 'Sophie M.', job: 'Restauratrice', city: 'Millau', text: "Le site vitrine a transformé notre visibilité. Les touristes nous trouvent facilement sur Google.", before: 'Invisible sur Google', after: 'Top 3 Google Maps' },
  { name: 'Pierre V.', job: 'Kinésithérapeute', city: 'Cahors', text: "La prise de RDV en ligne m'a fait gagner un temps fou. Plus besoin de gérer le téléphone.", before: '2h/jour au téléphone', after: '15 min/jour' },
  { name: 'Léa B.', job: 'Fleuriste', city: 'Figeac', text: "Ma boutique en ligne représente maintenant 30% de mon chiffre d'affaires. Incroyable.", before: '0€ en ligne', after: '30% du CA en ligne' },
  { name: 'Thomas R.', job: 'Agent immobilier', city: 'Montauban', text: "Le site vitrine avec catalogue a boosté notre crédibilité. Les mandats arrivent plus facilement.", before: '2 mandats/mois', after: '7 mandats/mois' },
];

const TestimonialsSection = () => (
  <section className="py-24 grain">
    <div className="container mx-auto px-4 relative z-10">
      <SectionHeader
        label="Témoignages"
        title="Ce que disent nos clients"
        highlight="nos clients"
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl border p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={14} className="text-conversion fill-conversion" />
              ))}
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed mb-4">"{t.text}"</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.job} · {t.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-destructive line-through">{t.before}</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-visibility font-semibold">{t.after}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
