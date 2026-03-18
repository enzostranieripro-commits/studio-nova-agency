const metiers = [
  'Artisan BTP', 'Restaurateur', 'Commerçant', 'Photographe', 'Thérapeute',
  'Immobilier', 'Tourisme', 'Coach', 'Architecte', 'Fleuriste',
  'Vétérinaire', 'Auto-école', 'Comptable', 'Kinésithérapeute',
  'Traiteur', 'Électricien', 'Paysagiste', 'Ostéopathe',
];

const MetiersTicker = () => {
  const items = [...metiers, ...metiers];
  return (
    <section className="py-6 border-y border-foreground/5 overflow-hidden bg-card/30">
      <div className="animate-marquee flex whitespace-nowrap">
        {items.map((m, i) => (
          <span key={i} className="flex items-center gap-3 mx-5">
            <span className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground/60 font-medium">{m}</span>
            <span className="text-primary/30 text-xs">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
};

export default MetiersTicker;
