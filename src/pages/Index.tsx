import { useState } from 'react';
import { MieterhoehungHeader, MieterhoehungHero } from '@/components/mieterhoehung/Header';
import { MieterhoehungInputsSection } from '@/components/mieterhoehung/MieterhoehungInputs';
import { MieterhoehungResultsDisplay } from '@/components/mieterhoehung/MieterhoehungResults';
import { MieterhoehungCrossSell } from '@/components/mieterhoehung/CrossSellBanner';
import { AuthModal } from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { RotateCcw, FileText } from 'lucide-react';
import { useMieterhoehung, getDefaultMieterhoehungInputs } from '@/hooks/useMieterhoehung';
import type { MieterhoehungInputs } from '@/hooks/useMieterhoehung';

const Index = () => {
  const [inputs, setInputs] = useState<MieterhoehungInputs>(getDefaultMieterhoehungInputs());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const results = useMieterhoehung(inputs);

  const handleReset = () => {
    setInputs(getDefaultMieterhoehungInputs());
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);

  return (
    <div className="min-h-screen bg-background">
      <MieterhoehungHeader onLoginClick={() => setShowAuthModal(true)} />
      <MieterhoehungHero />

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            <MieterhoehungInputsSection inputs={inputs} onChange={setInputs} />
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Zurücksetzen
              </Button>
              <Button className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Erhöhungsschreiben erstellen
              </Button>
            </div>

            {/* Legal Note */}
            <div className="p-4 bg-muted/50 rounded-xl text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Rechtlicher Hinweis</p>
              <p>
                Diese Berechnung dient nur zur Orientierung. Für eine rechtssichere Mieterhöhung 
                konsultieren Sie bitte einen Fachanwalt oder Ihren lokalen Haus- und Grundbesitzerverein.
              </p>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div>
              <h2 className="font-heading text-xl font-semibold mb-4">Ergebnis</h2>
              <MieterhoehungResultsDisplay results={results} />
            </div>
            
            <MieterhoehungCrossSell />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Maximale Erhöhung</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(results.max_erhoehung)}
            </div>
          </div>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Schreiben erstellen
          </Button>
        </div>
      </div>

      {/* Add padding for mobile sticky footer */}
      <div className="lg:hidden h-24" />

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;
