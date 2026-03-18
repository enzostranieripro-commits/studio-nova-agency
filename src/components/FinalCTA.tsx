import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useAuditModal } from '@/hooks/useAuditModal';

const FinalCTA = () => {
  const { open } = useAuditModal();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-authority/10 to-primary/5" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-6">
            Prêt à transformer votre<br />
            <span className="text-gradient-primary">présence en ligne ?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            30 minutes d'audit gratuit. Aucun engagement. Un plan d'action concret.
          </p>
          <button
            onClick={open}
            className="bg-primary text-primary-foreground px-10 py-4 rounded-xl text-base font-semibold glow-primary hover:-translate-y-1 active:scale-[0.97] transition-all inline-flex items-center gap-2 mb-8"
          >
            Réserver mon audit gratuit <ArrowRight size={18} />
          </button>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {['Gratuit et sans engagement', 'Réponse sous 24h', 'Devis transparent'].map(item => (
              <span key={item} className="flex items-center gap-2">
                <Check size={16} className="text-visibility" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
