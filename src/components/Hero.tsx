import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useAuditModal } from '@/hooks/useAuditModal';

const stats = [
  { value: '47+', label: 'sites livrés' },
  { value: '94%', label: 'clients satisfaits' },
  { value: '7 jours', label: 'délai moyen' },
];

const Hero = () => {
  const { open } = useAuditModal();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-1/2 right-1/6 w-[400px] h-[400px] bg-visibility/8 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-[300px] h-[300px] bg-primary/6 rounded-full blur-[80px] animate-blob animation-delay-4000" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(hsl(var(--foreground) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="section-label">
              <span className="w-1.5 h-1.5 rounded-full bg-visibility animate-pulse-dot" />
              Agence web — Aveyron &amp; Occitanie
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-display font-bold tracking-tight leading-[1.1] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            Votre site web,{' '}
            <br className="hidden sm:block" />
            votre meilleur{' '}
            <span className="text-gradient-primary">commercial.</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Nous concevons des sites sur-mesure qui attirent de vrais clients — pour les artisans, commerçants et indépendants du Sud de la France.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-14"
          >
            <button
              onClick={open}
              className="group bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-semibold glow-primary hover:-translate-y-0.5 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            >
              Obtenir mon audit gratuit
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#services"
              className="border border-foreground/15 text-foreground/80 px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-foreground/5 hover:border-foreground/25 hover:-translate-y-0.5 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            >
              Découvrir nos offres
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-10"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.12 }}
                className="text-center"
              >
                <div className="font-display text-2xl font-bold text-foreground mb-0.5">{stat.value}</div>
                <div className="text-xs text-muted-foreground tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#services" className="flex flex-col items-center gap-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
          <span className="text-xs tracking-widest uppercase" style={{ fontSize: '0.6rem' }}>Explorer</span>
          <ChevronDown size={16} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
