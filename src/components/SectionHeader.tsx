import { motion } from 'framer-motion';

interface SectionHeaderProps {
  label: string;
  title: string;
  highlight?: string;
  description?: string;
  highlightColor?: string;
  align?: 'center' | 'left';
}

const SectionHeader = ({
  label,
  title,
  highlight,
  description,
  highlightColor = 'text-gradient-primary',
  align = 'center',
}: SectionHeaderProps) => {
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className={`mb-14 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      <span className="section-label mb-5 inline-block">{label}</span>
      <h2
        className="font-display font-bold tracking-tight leading-[1.2] mb-5 text-foreground"
        style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)' }}
      >
        {highlight ? (
          <>
            {parts[0]}
            <span className={highlightColor === 'text-gradient-primary' ? 'text-gradient-primary' : highlightColor}>
              {highlight}
            </span>
            {parts[1] || ''}
          </>
        ) : title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
