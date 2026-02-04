import { TrendingUp, Calendar, Percent, CheckCircle, Clock, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { MieterhoehungResults } from '@/hooks/useMieterhoehung';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MieterhoehungResultsDisplayProps {
  results: MieterhoehungResults;
}

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);

const formatPercent = (value: number) => 
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value) + '%';

export function MieterhoehungResultsDisplay({ results }: MieterhoehungResultsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Primary Result */}
      <div className="result-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Maximale Erhöhung</p>
            <p className="text-4xl font-bold text-primary">
              {formatCurrency(results.max_erhoehung)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">pro Monat</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="mt-4">
          {results.erhoehung_moeglich ? (
            <div className="status-badge-success">
              <CheckCircle className="h-4 w-4" />
              Erhöhung jetzt möglich
            </div>
          ) : !results.wartezeit_erfuellt ? (
            <div className="status-badge-warning">
              <Clock className="h-4 w-4" />
              Wartezeit nicht erfüllt
              {results.naechste_erhoehung_moeglich && (
                <span className="ml-1">
                  (ab {format(results.naechste_erhoehung_moeglich, "dd.MM.yyyy", { locale: de })})
                </span>
              )}
            </div>
          ) : (
            <div className="status-badge-warning">
              <AlertCircle className="h-4 w-4" />
              Keine Erhöhung möglich
            </div>
          )}
        </div>
      </div>

      {/* Secondary Results Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="result-card">
          <p className="text-sm text-muted-foreground mb-1">Neue Miete</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(results.max_neue_miete)}
          </p>
        </div>
        
        <div className="result-card">
          <p className="text-sm text-muted-foreground mb-1">Erhöhung</p>
          <p className="text-2xl font-bold text-foreground">
            {formatPercent(results.erhoehung_prozent)}
          </p>
        </div>
        
        <div className="result-card">
          <div className="flex items-center gap-1.5 mb-1">
            <p className="text-sm text-muted-foreground">Kappungsgrenze</p>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Max. {results.kappung_prozent}% Erhöhung in 3 Jahren nach §558 Abs. 3 BGB
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {results.kappung_prozent}%
          </p>
        </div>
        
        <div className="result-card">
          <p className="text-sm text-muted-foreground mb-1">Wartezeit</p>
          <p className="text-2xl font-bold text-foreground">
            {results.monate_seit_letzter} <span className="text-base font-normal text-muted-foreground">Monate</span>
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="result-card">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Percent className="h-4 w-4 text-primary" />
          Berechnungsdetails
        </h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Aktuelle Miete/m²</span>
            <span className="font-medium">{formatCurrency(results.aktuelle_miete_qm)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Mietspiegel Ø</span>
            <span className="font-medium">{formatCurrency(results.vergleichsmiete_avg)}/m²</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Max. nach Mietspiegel</span>
            <span className="font-medium">{formatCurrency(results.max_miete_mietspiegel)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Max. nach Kappung</span>
            <span className="font-medium">{formatCurrency(results.max_miete_kappung)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 bg-muted/50 -mx-4 px-4 rounded-lg">
            <span className="font-medium">Begrenzung durch</span>
            <span className="font-semibold text-primary">
              {results.begrenzung_durch === 'mietspiegel' ? 'Mietspiegel' : 'Kappungsgrenze'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
