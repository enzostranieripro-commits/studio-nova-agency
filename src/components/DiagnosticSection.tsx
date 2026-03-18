import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { supabase } from '@/integrations/supabase/client';

/* ── Villes ticker ──────────────────────────────────────── */
const cities = [
  // Aveyron
  'Rodez', 'Millau', 'Espalion', 'Villefranche-de-Rouergue', 'Saint-Affrique',
  'Decazeville', 'Onet-le-Château', 'Rieupeyroux', 'Conques', 'Laguiole',
  // Occitanie & grandes villes
  'Toulouse', 'Montpellier', 'Nîmes', 'Albi', 'Cahors', 'Montauban', 'Figeac',
  // France entière
  'Paris', 'Lyon', 'Bordeaux', 'Marseille', 'Nantes', 'Lille',
];

const CitiesTicker = () => {
  const items = [...cities, ...cities];
  return (
    <div className="overflow-hidden py-3 border-y border-foreground/5 bg-card/30 mb-10">
      <div className="animate-marquee-slow flex whitespace-nowrap">
        {items.map((city, i) => (
          <span key={i} className="flex items-center gap-2 mx-4">
            <MapPin size={10} className="text-primary/50 flex-shrink-0" />
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground/60 font-medium">{city}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Questions ──────────────────────────────────────────── */
const questions = [
  {
    q: 'Votre secteur d\'activité ?',
    type: 'select' as const,
    options: ['Artisan BTP', 'Restauration', 'Commerce', 'Santé / Bien-être', 'Immobilier', 'Tourisme', 'Services', 'Autre'],
  },
  {
    q: 'Vous avez déjà un site internet ?',
    type: 'single' as const,
    options: ['Oui, et je veux l\'améliorer', 'Non, c\'est une première', 'En cours de création'],
  },
  {
    q: 'Combien de demandes clients recevez-vous par semaine via le web ?',
    type: 'single' as const,
    options: ['Aucune', '1 à 5', '5 à 20', 'Plus de 20'],
  },
  {
    q: 'Êtes-vous présent sur les réseaux sociaux ?',
    type: 'single' as const,
    options: ['Oui, actif', 'Oui, mais peu actif', 'Non'],
  },
  {
    q: 'Quelles tâches vous font perdre du temps ?',
    type: 'multi' as const,
    options: ['Devis clients', 'Rappels / relances', 'Réservations', 'Facturation', 'Autre'],
  },
];

const offerLabels: Record<string, { label: string; color: string; desc: string }> = {
  Visibilité: {
    label: 'Visibilité',
    color: 'text-visibility',
    desc: 'Une landing page percutante pour attirer des prospects et être trouvé sur Google.',
  },
  Autorité: {
    label: 'Autorité',
    color: 'text-authority',
    desc: 'Un site multi-pages qui renforce votre crédibilité et génère des contacts qualifiés.',
  },
  Conversion: {
    label: 'Conversion',
    color: 'text-conversion',
    desc: 'Un site e-commerce ou commercial avec prise de commande et paiement en ligne.',
  },
};

const DiagnosticSection = () => {
  const [currentQ, setCurrentQ]       = useState(0);
  const [answers, setAnswers]         = useState<string[]>([]);
  const [multiAnswers, setMultiAnswers] = useState<string[]>([]);
  const [done, setDone]               = useState(false);
  const [recommendation, setRecommendation] = useState('');

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      const leads = newAnswers[2];
      let rec = 'Visibilité';
      if (leads === '5 à 20' || leads === 'Plus de 20') rec = 'Conversion';
      else if (newAnswers[1] !== 'Non, c\'est une première') rec = 'Autorité';
      setRecommendation(rec);
      setDone(true);
      try {
        await supabase.from('diagnostics').insert({
          secteur: newAnswers[0],
          a_un_site: newAnswers[1],
          demandes_semaine: newAnswers[2],
          reseaux_sociaux: newAnswers[3],
          taches_repetitives: currentQ === 4 ? multiAnswers : [answer],
          offre_recommandee: rec,
        });
      } catch { /* silent */ }
    }
  };

  const handleMultiToggle = (opt: string) =>
    setMultiAnswers(prev => prev.includes(opt) ? prev.filter(a => a !== opt) : [...prev, opt]);

  const submitMulti = () => handleAnswer(multiAnswers.join(', '));

  const progress = ((currentQ + (done ? 1 : 0)) / questions.length) * 100;
  const q = questions[currentQ];
  const offerInfo = offerLabels[recommendation];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          label="Diagnostic gratuit"
          title="Trouvez l'offre faite pour vous"
          highlight="faite pour vous"
          description="5 questions. 2 minutes. Une recommandation personnalisée et sans engagement."
        />

        {/* Cities ticker */}
        <CitiesTicker />

        <div className="max-w-lg mx-auto">
          {/* Progress */}
          <div className="h-1 bg-card rounded-full mb-8 overflow-hidden border border-foreground/5">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="bg-card rounded-2xl border p-7"
              >
                <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest mb-2">
                  Question {currentQ + 1} / {questions.length}
                </p>
                <h3 className="font-display text-xl font-bold text-foreground mb-6">{q.q}</h3>

                {q.type === 'multi' ? (
                  <div>
                    <div className="grid grid-cols-2 gap-2.5 mb-5">
                      {q.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleMultiToggle(opt)}
                          className={`p-3 rounded-xl border text-sm text-left transition-all ${
                            multiAnswers.includes(opt)
                              ? 'border-primary/40 bg-primary/8 text-foreground'
                              : 'text-muted-foreground hover:border-foreground/15 hover:text-foreground'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={submitMulti}
                      disabled={multiAnswers.length === 0}
                      className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                    >
                      Voir ma recommandation <ChevronRight size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {q.options.map(opt => (
                      <motion.button
                        key={opt}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(opt)}
                        className="w-full p-4 rounded-xl border text-left text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-secondary/30 transition-all flex items-center justify-between group"
                      >
                        <span>{opt}</span>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="bg-card rounded-2xl border p-8 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl">🎯</span>
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Notre recommandation</p>
                <h3 className={`font-display text-3xl font-bold mb-3 ${offerInfo.color}`}>{offerInfo.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs mx-auto">{offerInfo.desc}</p>

                <button
                  onClick={() => {
                    setCurrentQ(0);
                    setAnswers([]);
                    setMultiAnswers([]);
                    setDone(false);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Refaire le diagnostic
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticSection;
