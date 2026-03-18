import { motion } from 'framer-motion';

interface SectionHeaderProps {
  label: string;
  title: string;
  highlight?: string;
  description?: string;
  highlightColor?: string;
}

const SectionHeader = ({ label, title, highlight, description, highlightColor = 'text-primary' }: SectionHeaderProps) => {
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <span className="inline-block text-xs uppercase tracking-[0.3em] font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
        {label}
      </span>
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-6">
        {highlight ? (
          <>
            {parts[0]}<span className={highlightColor}>{highlight}</span>{parts[1] || ''}
          </>
        ) : title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
