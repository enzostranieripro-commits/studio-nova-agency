const metiers = [
  'Artisan BTP', 'Restaurateur', 'Commerçant', 'Photographe', 'Thérapeute',
  'Immobilier', 'Tourisme', 'Coach', 'Architecte', 'Fleuriste',
  'Vétérinaire', 'Auto-école', 'Comptable', 'Kiné'
];

const MetiersTicker = () => {
  const items = [...metiers, ...metiers];

  return (
    <section className="py-8 border-y border-foreground/5 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {items.map((m, i) => (
          <span key={i} className="text-xs uppercase tracking-[0.3em] text-muted-foreground mx-4 flex items-center gap-4">
            {m}
            <span className="text-primary">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
};

export default MetiersTicker;
