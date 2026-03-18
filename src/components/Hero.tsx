import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useAuditModal } from '@/hooks/useAuditModal';

const stats = [
  { value: '47', label: 'sites livrés' },
  { value: '94%', label: 'clients satisfaits' },
  { value: '< 7j', label: 'de livraison' },
];

const Hero = () => {
  const { open } = useAuditModal();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Gradient mesh */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-blob" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-authority/15 rounded-full blur-[128px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-[128px] animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs uppercase tracking-[0.3em] font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
              🏆 Agence digitale — Aveyron & Occitanie
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] mb-8"
          >
            Votre site web,
            <br />
            votre meilleur
            <br />
            <span className="text-gradient-primary">commercial.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Studio Nova crée des sites sur-mesure qui génèrent de vrais clients — pour les artisans, commerçants et indépendants du Sud de la France.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <button
              onClick={open}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold glow-primary hover:-translate-y-1 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            >
              Obtenir mon audit gratuit <ArrowRight size={18} />
            </button>
            <a
              href="#services"
              className="border border-foreground/20 text-foreground px-8 py-4 rounded-xl text-base font-semibold hover:bg-foreground/5 hover:-translate-y-1 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            >
              <Play size={16} /> Voir nos réalisations
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="text-center"
              >
                <div className="font-display text-3xl md:text-4xl font-black text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
