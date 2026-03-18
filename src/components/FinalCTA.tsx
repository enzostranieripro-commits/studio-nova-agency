import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, Star } from 'lucide-react';
import { useAuditModal } from '@/hooks/useAuditModal';

const FinalCTA = () => {
  const { open } = useAuditModal();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="section-label mb-6 inline-block">Prêt à commencer ?</span>

          <h2
            className="font-display font-bold tracking-tight leading-[1.15] text-foreground mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Un audit gratuit pour{' '}
            <span className="text-gradient-primary">clarifier vos priorités.</span>
          </h2>

          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-lg mx-auto">
            30 minutes en visio avec un expert Studio Nova. Analyse de votre situation, recommandations concrètes, estimation budgétaire. Zéro engagement.
          </p>

          <button
            onClick={open}
            className="group bg-primary text-primary-foreground px-9 py-3.5 rounded-xl text-sm font-semibold glow-primary hover:-translate-y-0.5 active:scale-[0.97] transition-all inline-flex items-center gap-2 mb-8"
          >
            Réserver mon audit gratuit
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex flex-wrap justify-center gap-5 text-xs text-muted-foreground">
            {[
              { icon: Shield, text: 'Sans engagement' },
              { icon: Clock, text: 'Réponse sous 24h' },
              { icon: Star, text: '94% de satisfaction client' },
            ].map(item => (
              <span key={item.text} className="flex items-center gap-1.5">
                <item.icon size={13} className="text-primary/60" />
                {item.text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
