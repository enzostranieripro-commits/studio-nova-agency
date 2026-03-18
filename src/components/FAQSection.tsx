import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SectionHeader from './SectionHeader';

const faqs = [
  { q: 'Combien de temps pour livrer mon site ?', a: "La plupart de nos sites sont livrés en 7 jours ouvrés. Pour les projets e-commerce plus complexes, comptez 10 à 14 jours. Vous validez chaque étape du processus." },
  { q: 'Est-ce que je reste propriétaire de mon site ?', a: "Oui, absolument. Le contenu et le design vous appartiennent. Si vous choisissez l'achat unique, le code source est aussi à vous." },
  { q: "Je n'y connais rien en informatique, est-ce un problème ?", a: "Pas du tout ! C'est justement notre métier de tout gérer pour vous. Nous nous occupons de A à Z : design, développement, mise en ligne, maintenance." },
  { q: 'Que se passe-t-il si je veux modifier mon site après livraison ?', a: "Les modifications sont incluses dans tous nos abonnements. Vous nous envoyez vos demandes et nous les réalisons sous 48h." },
  { q: 'Pourquoi un abonnement mensuel ?', a: "L'abonnement inclut l'hébergement, la maintenance, les mises à jour de sécurité, le support technique et les modifications. C'est un service complet sans mauvaise surprise." },
  { q: 'Vous travaillez dans toute la France ?', a: "Notre cœur de métier est l'Aveyron et l'Occitanie, mais nous travaillons avec des clients dans toute la France. Tous nos échanges peuvent se faire en visio." },
  { q: 'Mon site sera-t-il visible sur Google ?', a: "Oui. Chaque site est optimisé pour le référencement local (SEO). Nous travaillons les mots-clés, la vitesse de chargement et la structure technique pour maximiser votre visibilité." },
  { q: "Comment se passe l'audit gratuit ?", a: "Un appel de 30 minutes où nous analysons votre situation actuelle, vos objectifs et vos concurrents. À la fin, vous repartez avec un plan d'action concret — sans aucun engagement." },
];

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          label="FAQ"
          title="Questions fréquentes"
          highlight="fréquentes"
        />
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <span className="font-display text-sm font-bold pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-muted-foreground transition-transform flex-shrink-0 ${openIdx === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
