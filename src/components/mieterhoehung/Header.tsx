import { Building2, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MieterhoehungHeaderProps {
  onLoginClick?: () => void;
}

export function MieterhoehungHeader({ onLoginClick }: MieterhoehungHeaderProps) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <span className="font-heading font-semibold text-lg">Mieterhöhungs-Rechner</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/pricing">Preise</a>
          </Button>
          <Button size="sm" onClick={onLoginClick}>
            Anmelden
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MieterhoehungHero() {
  return (
    <div className="gradient-hero text-white py-12 px-4">
      <div className="container">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
            <Scale className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            §558 BGB konform
          </span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">
          Mieterhöhungs-Rechner
        </h1>
        <p className="text-white/80 text-lg max-w-xl">
          Berechnen Sie die maximal zulässige Mieterhöhung nach deutschem Mietrecht – 
          inklusive Kappungsgrenze und Wartezeit-Prüfung.
        </p>
      </div>
    </div>
  );
}
