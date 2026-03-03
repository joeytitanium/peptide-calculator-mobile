export const CALCULATOR_MODES = ['peptide', 'blend', 'reconstitution'] as const;
export type CalculatorMode = (typeof CALCULATOR_MODES)[number];

export const SYRINGE_SIZES = [27, 30, 50, 100] as const;
export type SyringeSize = (typeof SYRINGE_SIZES)[number];

export const SYRINGE_DISPLAY_MODES = ['units', 'ml'] as const;
export type SyringeDisplayMode = (typeof SYRINGE_DISPLAY_MODES)[number];

export const DOSE_UNITS = ['mcg', 'mg'] as const;
export type DoseUnit = (typeof DOSE_UNITS)[number];

export type BlendPeptideEntry = {
  peptideName: string;
  peptideAmountMg: number;
  desiredDoseMcg: number;
};

export type PeptideCalculation = {
  id: string;
  mode: 'peptide';
  name: string;
  peptideAmountMg: number;
  waterVolumeMl: number;
  desiredDoseMcg: number;
  syringeSize: SyringeSize;
  unitsToDraw: number;
  createdAt: string;
};

export type BlendCalculation = {
  id: string;
  mode: 'blend';
  name: string;
  peptides: BlendPeptideEntry[];
  waterVolumeMl: number;
  syringeSize: SyringeSize;
  totalUnitsToDraw: number;
  createdAt: string;
};

export type ReconstitutionCalculation = {
  id: string;
  mode: 'reconstitution';
  name: string;
  peptideAmountMg: number;
  desiredDoseMcg: number;
  desiredUnits: number;
  syringeSize: SyringeSize;
  waterToAddMl: number;
  createdAt: string;
};

export type SavedCalculation =
  | PeptideCalculation
  | BlendCalculation
  | ReconstitutionCalculation;
