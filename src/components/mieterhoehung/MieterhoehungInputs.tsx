import { Home, MapPin, Calendar, Euro } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { MieterhoehungInputs } from '@/hooks/useMieterhoehung';

interface MieterhoehungInputsSectionProps {
  inputs: MieterhoehungInputs;
  onChange: (inputs: MieterhoehungInputs) => void;
}

export function MieterhoehungInputsSection({ inputs, onChange }: MieterhoehungInputsSectionProps) {
  const updateField = <K extends keyof MieterhoehungInputs>(
    field: K,
    value: MieterhoehungInputs[K]
  ) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Gruppe 1: Aktuelle Mietsituation */}
      <div className="input-group">
        <h3 className="input-group-title">
          <Home className="h-5 w-5 text-primary" />
          Aktuelle Mietsituation
        </h3>
        
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aktuelle_miete">Aktuelle Kaltmiete</Label>
              <div className="relative">
                <Input
                  id="aktuelle_miete"
                  type="number"
                  value={inputs.aktuelle_miete || ''}
                  onChange={(e) => updateField('aktuelle_miete', parseFloat(e.target.value) || 0)}
                  placeholder="z.B. 800"
                  className="pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  €/Monat
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Ohne Nebenkosten</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wohnflaeche">Wohnfläche</Label>
              <div className="relative">
                <Input
                  id="wohnflaeche"
                  type="number"
                  value={inputs.wohnflaeche || ''}
                  onChange={(e) => updateField('wohnflaeche', parseFloat(e.target.value) || 0)}
                  placeholder="z.B. 65"
                  className="pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  m²
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Laut Mietvertrag</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mietbeginn</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !inputs.mietbeginn && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {inputs.mietbeginn 
                      ? format(inputs.mietbeginn, "dd.MM.yyyy", { locale: de })
                      : "Datum wählen"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={inputs.mietbeginn || undefined}
                    onSelect={(date) => updateField('mietbeginn', date || null)}
                    initialFocus
                    locale={de}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Letzte Mieterhöhung</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !inputs.letzte_erhoehung && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {inputs.letzte_erhoehung 
                      ? format(inputs.letzte_erhoehung, "dd.MM.yyyy", { locale: de })
                      : "Falls keine: leer lassen"
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={inputs.letzte_erhoehung || undefined}
                    onSelect={(date) => updateField('letzte_erhoehung', date || null)}
                    initialFocus
                    locale={de}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">Falls keine: Mietbeginn wird verwendet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gruppe 2: Vergleichsmiete */}
      <div className="input-group">
        <h3 className="input-group-title">
          <MapPin className="h-5 w-5 text-primary" />
          Vergleichsmiete (Mietspiegel)
        </h3>
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="plz">PLZ</Label>
            <Input
              id="plz"
              type="text"
              value={inputs.plz}
              onChange={(e) => updateField('plz', e.target.value)}
              placeholder="z.B. 80331"
              maxLength={5}
            />
            <p className="text-xs text-muted-foreground">Für Mietspiegel-Zuordnung</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vergleichsmiete_von">Mietspiegel von</Label>
              <div className="relative">
                <Input
                  id="vergleichsmiete_von"
                  type="number"
                  step="0.01"
                  value={inputs.vergleichsmiete_von || ''}
                  onChange={(e) => updateField('vergleichsmiete_von', parseFloat(e.target.value) || 0)}
                  placeholder="z.B. 10.00"
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  €/m²
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Untere Grenze</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vergleichsmiete_bis">Mietspiegel bis</Label>
              <div className="relative">
                <Input
                  id="vergleichsmiete_bis"
                  type="number"
                  step="0.01"
                  value={inputs.vergleichsmiete_bis || ''}
                  onChange={(e) => updateField('vergleichsmiete_bis', parseFloat(e.target.value) || 0)}
                  placeholder="z.B. 14.00"
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  €/m²
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Obere Grenze</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="ballungsgebiet" className="text-base cursor-pointer">
                Ballungsgebiet (§558 Abs. 3 BGB)
              </Label>
              <p className="text-sm text-muted-foreground">
                15% statt 20% Kappungsgrenze
              </p>
            </div>
            <Switch
              id="ballungsgebiet"
              checked={inputs.ist_ballungsgebiet}
              onCheckedChange={(checked) => updateField('ist_ballungsgebiet', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
