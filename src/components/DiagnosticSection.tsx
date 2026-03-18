import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const questions = [
  {
    q: 'Vous êtes dans quel secteur ?',
    type: 'select' as const,
    options: ['Artisan BTP', 'Restauration', 'Commerce', 'Santé / Bien-être', 'Immobilier', 'Tourisme', 'Services', 'Autre'],
  },
  {
    q: 'Vous avez déjà un site internet ?',
    type: 'single' as const,
    options: ['Oui', 'Non', 'En cours de création'],
  },
  {
    q: 'Combien de demandes clients recevez-vous par semaine en ligne ?',
    type: 'single' as const,
    options: ['0', '1 à 5', '5 à 20', 'Plus de 20'],
  },
  {
    q: 'Êtes-vous présent sur les réseaux sociaux ?',
    type: 'single' as const,
    options: ['Oui, actif', 'Oui, mais peu actif', 'Non'],
  },
  {
    q: 'Quelles tâches répétitives vous font perdre du temps ?',
    type: 'multi' as const,
    options: ['Devis', 'Rappels clients', 'Réservations', 'Facturation', 'Autre'],
  },
];

const DiagnosticSection = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [multiAnswers, setMultiAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [recommendation, setRecommendation] = useState('');

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      // Calculate recommendation
      const leads = newAnswers[2];
      let rec = 'Visibilité';
      if (leads === '5 à 20' || leads === 'Plus de 20') rec = 'Conversion';
      else if (newAnswers[1] === 'Oui') rec = 'Autorité';
      setRecommendation(rec);
      setDone(true);

      // Save to Supabase
      try {
        await supabase.from('diagnostics').insert({
          secteur: newAnswers[0],
          a_un_site: newAnswers[1],
          demandes_semaine: newAnswers[2],
          reseaux_sociaux: newAnswers[3],
          taches_repetitives: currentQ === 4 ? multiAnswers : [answer],
          offre_recommandee: rec,
        });
      } catch {
        // Silent fail
      }
    }
  };

  const handleMultiToggle = (opt: string) => {
    setMultiAnswers(prev => prev.includes(opt) ? prev.filter(a => a !== opt) : [...prev, opt]);
  };

  const submitMulti = () => {
    handleAnswer(multiAnswers.join(', '));
  };

  const q = questions[currentQ];
  const progress = ((currentQ + (done ? 1 : 0)) / questions.length) * 100;

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          label="Diagnostic"
          title="Faites votre diagnostic en 2 minutes"
          highlight="2 minutes"
        />

        <div className="max-w-xl mx-auto">
          {/* Progress bar */}
          <div className="h-1 bg-card rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-card rounded-2xl border p-8"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                  Question {currentQ + 1} / {questions.length}
                </p>
                <h3 className="font-display text-xl font-bold mb-6">{q.q}</h3>

                {q.type === 'multi' ? (
                  <div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {q.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleMultiToggle(opt)}
                          className={`p-3 rounded-xl border text-sm text-left transition-all ${
                            multiAnswers.includes(opt) ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-card'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={submitMulti}
                      disabled={multiAnswers.length === 0}
                      className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      Voir mon résultat <ChevronRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {q.options.map(opt => (
                      <motion.button
                        key={opt}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAnswer(opt)}
                        className="w-full p-4 rounded-xl border text-left text-sm hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-between"
                      >
                        {opt}
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl border p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-visibility/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Votre offre recommandée</h3>
                <p className="text-primary font-display text-3xl font-black mb-4">{recommendation}</p>
                <p className="text-muted-foreground text-sm mb-6">
                  Basé sur vos réponses, l'offre {recommendation} est la plus adaptée à votre situation.
                </p>
                <button
                  onClick={() => { setCurrentQ(0); setAnswers([]); setMultiAnswers([]); setDone(false); }}
                  className="text-sm text-muted-foreground underline"
                >
                  Recommencer le diagnostic
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
