import { Linkedin, Instagram } from 'lucide-react';

const SiteFooter = () => (
  <footer className="border-t py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        <div>
          <a href="#" className="font-display text-xl font-bold flex items-center gap-2 mb-4">
            Studio Nova <span className="w-2 h-2 rounded-full bg-primary" />
          </a>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Agence digitale spécialisée dans la création de sites web sur-mesure pour les artisans et commerçants d'Occitanie.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-widest mb-4">Offres</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#services" className="hover:text-foreground transition-colors">Visibilité</a></li>
            <li><a href="#services" className="hover:text-foreground transition-colors">Autorité</a></li>
            <li><a href="#services" className="hover:text-foreground transition-colors">Conversion</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-widest mb-4">Entreprise</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#methode" className="hover:text-foreground transition-colors">Méthode</a></li>
            <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-widest mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>contact@studionova.fr</li>
            <li>05 65 XX XX XX</li>
            <li>Aveyron & Occitanie</li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin size={18} /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Instagram size={18} /></a>
          </div>
        </div>
      </div>

      <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
        <p>© 2025 Studio Nova. Tous droits réservés.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors">Mentions légales</a>
          <a href="#" className="hover:text-foreground transition-colors">Politique de confidentialité</a>
          <a href="#" className="hover:text-foreground transition-colors">RGPD</a>
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
