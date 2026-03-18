import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import SectionHeader from './SectionHeader';

const testimonials = [
  { name: 'Marc D.', job: 'Plombier', city: 'Rodez', text: "Avant Studio Nova, je n'avais aucun contact en ligne. Maintenant je reçois une dizaine de demandes par semaine, sans effort de ma part.", before: '0 contact/sem.', after: '10 contacts/sem.' },
  { name: 'Claire L.', job: 'Photographe', city: 'Albi', text: "Mon portfolio m'a permis de doubler mes réservations en 3 mois. Un travail soigné, livré rapidement, et un vrai accompagnement.", before: '4 réservations/mois', after: '9 réservations/mois' },
  { name: 'Sophie M.', job: 'Restauratrice', city: 'Millau', text: "Le site vitrine a tout changé. Les touristes nous trouvent facilement sur Google et réservent directement en ligne.", before: 'Invisible sur Google', after: 'Top 3 Google Maps' },
  { name: 'Pierre V.', job: 'Kinésithérapeute', city: 'Cahors', text: "La prise de RDV en ligne m'a libéré du téléphone. Je gagne un temps précieux et mes patients apprécient la simplicité.", before: '2h/jour au tél.', after: '15 min/jour' },
  { name: 'Léa B.', job: 'Fleuriste', city: 'Figeac', text: "Ma boutique en ligne représente maintenant 30% de mon chiffre d'affaires. Je n'aurais pas cru ça possible pour ma petite boutique.", before: '0€ en ligne', after: '30% du CA' },
  { name: 'Thomas R.', job: 'Agent immobilier', city: 'Montauban', text: "Le site avec catalogue a boosté notre crédibilité. Les mandats arrivent plus facilement depuis qu'on a un beau site.", before: '2 mandats/mois', after: '7 mandats/mois' },
];

const TestimonialsSection = () => (
  <section className="py-24">
    <div className="container mx-auto px-4">
      <SectionHeader
        label="Témoignages"
        title="Ce que nos clients disent"
        highlight="nos clients"
        description="Des résultats réels, dans des secteurs variés, partout en Occitanie."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            className="bg-card rounded-2xl border p-6 flex flex-col"
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={12} className="text-conversion fill-conversion" />
              ))}
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed mb-4 flex-1 italic">"{t.text}"</p>

            {/* Author */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.job} · {t.city}</p>
              </div>
            </div>

            {/* Result pill */}
            <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-visibility/5 border border-visibility/10">
              <TrendingUp size={11} className="text-visibility flex-shrink-0" />
              <span className="text-xs text-muted-foreground line-through">{t.before}</span>
              <span className="text-muted-foreground/50 text-xs">→</span>
              <span className="text-xs text-visibility font-semibold">{t.after}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
