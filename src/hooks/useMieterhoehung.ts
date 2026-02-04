import { useMemo } from 'react';

export interface MieterhoehungInputs {
  aktuelle_miete: number;
  wohnflaeche: number;
  letzte_erhoehung: Date | null;
  mietbeginn: Date | null;
  plz: string;
  vergleichsmiete_von: number;
  vergleichsmiete_bis: number;
  ist_ballungsgebiet: boolean;
}

export interface MieterhoehungResults {
  aktuelle_miete_qm: number;
  vergleichsmiete_avg: number;
  max_neue_miete: number;
  max_erhoehung: number;
  erhoehung_prozent: number;
  kappung_prozent: number;
  monate_seit_letzter: number;
  wartezeit_erfuellt: boolean;
  erhoehung_moeglich: boolean;
  naechste_erhoehung_moeglich: Date | null;
  max_miete_mietspiegel: number;
  max_miete_kappung: number;
  begrenzung_durch: 'mietspiegel' | 'kappung';
}

export const getDefaultMieterhoehungInputs = (): MieterhoehungInputs => ({
  aktuelle_miete: 800,
  wohnflaeche: 65,
  letzte_erhoehung: null,
  mietbeginn: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
  plz: '',
  vergleichsmiete_von: 10,
  vergleichsmiete_bis: 14,
  ist_ballungsgebiet: false,
});

function monthsDiff(date1: Date, date2: Date): number {
  const months = (date2.getFullYear() - date1.getFullYear()) * 12;
  return months + date2.getMonth() - date1.getMonth();
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function useMieterhoehung(inputs: MieterhoehungInputs): MieterhoehungResults {
  return useMemo(() => {
    const {
      aktuelle_miete,
      wohnflaeche,
      letzte_erhoehung,
      mietbeginn,
      vergleichsmiete_von,
      vergleichsmiete_bis,
      ist_ballungsgebiet,
    } = inputs;

    // Prevent division by zero
    const safeWohnflaeche = wohnflaeche || 1;
    const safeAktuelleMiete = aktuelle_miete || 0;

    const aktuelle_miete_qm = safeAktuelleMiete / safeWohnflaeche;
    const vergleichsmiete_avg = (vergleichsmiete_von + vergleichsmiete_bis) / 2;
    const max_miete_mietspiegel = vergleichsmiete_bis * safeWohnflaeche;
    const kappung_prozent = ist_ballungsgebiet ? 15 : 20;
    const max_miete_kappung = safeAktuelleMiete * (1 + kappung_prozent / 100);
    
    const max_neue_miete = Math.min(max_miete_mietspiegel, max_miete_kappung);
    const max_erhoehung = Math.max(0, max_neue_miete - safeAktuelleMiete);
    const erhoehung_prozent = safeAktuelleMiete > 0 
      ? (max_erhoehung / safeAktuelleMiete) * 100 
      : 0;

    const referenz_datum = letzte_erhoehung || mietbeginn;
    const monate_seit_letzter = referenz_datum 
      ? monthsDiff(referenz_datum, new Date()) 
      : 0;
    const wartezeit_erfuellt = monate_seit_letzter >= 15;

    const begrenzung_durch: 'mietspiegel' | 'kappung' = 
      max_miete_mietspiegel <= max_miete_kappung ? 'mietspiegel' : 'kappung';

    return {
      aktuelle_miete_qm: round(aktuelle_miete_qm, 2),
      vergleichsmiete_avg: round(vergleichsmiete_avg, 2),
      max_neue_miete: round(max_neue_miete, 2),
      max_erhoehung: round(max_erhoehung, 2),
      erhoehung_prozent: round(erhoehung_prozent, 1),
      kappung_prozent,
      monate_seit_letzter,
      wartezeit_erfuellt,
      erhoehung_moeglich: wartezeit_erfuellt && max_erhoehung > 0,
      naechste_erhoehung_moeglich: wartezeit_erfuellt 
        ? null 
        : referenz_datum 
          ? addMonths(referenz_datum, 15) 
          : null,
      max_miete_mietspiegel: round(max_miete_mietspiegel, 2),
      max_miete_kappung: round(max_miete_kappung, 2),
      begrenzung_durch,
    };
  }, [inputs]);
}
