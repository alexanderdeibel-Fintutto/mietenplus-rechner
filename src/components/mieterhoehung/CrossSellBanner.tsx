import { Bell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MieterhoehungCrossSell() {
  return (
    <div className="result-card bg-gradient-to-br from-success/5 to-success/10 border-success/20">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-success/10 rounded-xl shrink-0">
          <Bell className="h-6 w-6 text-success" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1">
            Nie wieder Fristen verpassen
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Nutzen Sie Vermietify für automatische Mieterhöhungs-Erinnerungen und rechtssichere Dokumentenerstellung.
          </p>
          <Button variant="outline" className="group border-success/30 text-success hover:bg-success hover:text-white">
            Mehr erfahren
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
