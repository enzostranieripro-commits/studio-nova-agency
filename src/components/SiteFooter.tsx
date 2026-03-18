import { Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const SiteFooter = () => (
  <footer className="border-t border-foreground/8 py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8 mb-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <a href="#" className="font-display text-base font-bold flex items-center gap-2 mb-3">
            Studio Nova <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </a>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Agence digitale spécialisée dans la création de sites web pour les artisans, commerçants et indépendants d'Aveyron &amp; Occitanie.
          </p>
          <div className="flex gap-3">
            <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin size={16} />
            </a>
            <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors">
              <Instagram size={16} />
            </a>
          </div>
        </div>

        {/* Offres */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">Offres</h4>
          <ul className="space-y-2">
            {[
              ['Visibilité — Landing page', '#services'],
              ['Autorité — Site vitrine', '#services'],
              ['Conversion — E-commerce', '#services'],
              ['Configurateur de prix', '#tarifs'],
            ].map(([label, href]) => (
              <li key={label}>
                <a href={href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Zones */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">Zones d'intervention</h4>
          <ul className="space-y-2">
            {[
              'Rodez (12000)', 'Millau (12100)', 'Espalion (12500)',
              'Villefranche-de-Rouergue', 'Albi', 'Toulouse', 'Et toute la France',
            ].map(city => (
              <li key={city} className="text-xs text-muted-foreground">{city}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-xs text-muted-foreground">
              <Mail size={13} className="mt-0.5 flex-shrink-0" />
              <a href="mailto:contact@studionova.fr" className="hover:text-foreground transition-colors">contact@studionova.fr</a>
            </li>
            <li className="flex items-start gap-2 text-xs text-muted-foreground">
              <Phone size={13} className="mt-0.5 flex-shrink-0" />
              <span>05 65 XX XX XX</span>
            </li>
            <li className="flex items-start gap-2 text-xs text-muted-foreground">
              <MapPin size={13} className="mt-0.5 flex-shrink-0" />
              <span>Rodez, Aveyron — Occitanie</span>
            </li>
          </ul>

          <div className="mt-4 p-3 bg-card rounded-xl border border-foreground/8">
            <p className="text-[0.65rem] text-muted-foreground/70 uppercase tracking-widest mb-0.5">Lundi — Vendredi</p>
            <p className="text-xs text-foreground/80 font-medium">9h00 — 18h00</p>
          </div>
        </div>
      </div>

      <div className="border-t border-foreground/8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>© 2025 Studio Nova · Agence web Aveyron &amp; Occitanie · Tous droits réservés</p>
        <div className="flex gap-5">
          <a href="#" className="hover:text-foreground transition-colors">Mentions légales</a>
          <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-foreground transition-colors">RGPD</a>
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
