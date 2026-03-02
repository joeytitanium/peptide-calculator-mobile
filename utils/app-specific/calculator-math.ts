import type { SyringeSize } from '@/types/app-specific/calculation';

export const parseNumericInput = (value: string): number => {
  return parseFloat(value.replace(',', '.'));
};

export const calculatePeptideDose = ({
  peptideAmountMg,
  waterVolumeMl,
  desiredDoseMcg,
  syringeSize,
}: {
  peptideAmountMg: number;
  waterVolumeMl: number;
  desiredDoseMcg: number;
  syringeSize: SyringeSize;
}) => {
  if (peptideAmountMg <= 0 || waterVolumeMl <= 0 || desiredDoseMcg <= 0) {
    return null;
  }

  const concentrationMcgPerMl = (peptideAmountMg * 1000) / waterVolumeMl;
  const volumeToDrawMl = desiredDoseMcg / concentrationMcgPerMl;
  const unitsToDraw = volumeToDrawMl * 100;
  const exceedsSyringe = unitsToDraw > syringeSize;

  return {
    unitsToDraw: Math.round(unitsToDraw * 10) / 10,
    concentrationMcgPerMl: Math.round(concentrationMcgPerMl * 100) / 100,
    volumeToDrawMl: Math.round(volumeToDrawMl * 1000) / 1000,
    exceedsSyringe,
    estimatedDraws: Math.floor((peptideAmountMg * 1000) / desiredDoseMcg),
  };
};

export const calculateBlendDose = ({
  peptides,
  waterVolumeMl,
  syringeSize,
}: {
  peptides: Array<{
    peptideAmountMg: number;
    desiredDoseMcg: number;
  }>;
  waterVolumeMl: number;
  syringeSize: SyringeSize;
}) => {
  if (waterVolumeMl <= 0 || peptides.length === 0) {
    return null;
  }

  const peptideResults = peptides.map((p) => {
    if (p.peptideAmountMg <= 0 || p.desiredDoseMcg <= 0) {
      return null;
    }
    const concentrationMcgPerMl = (p.peptideAmountMg * 1000) / waterVolumeMl;
    const volumeToDrawMl = p.desiredDoseMcg / concentrationMcgPerMl;
    const unitsToDraw = volumeToDrawMl * 100;

    return {
      unitsToDraw: Math.round(unitsToDraw * 10) / 10,
      concentrationMcgPerMl: Math.round(concentrationMcgPerMl * 100) / 100,
      volumeToDrawMl: Math.round(volumeToDrawMl * 1000) / 1000,
    };
  });

  if (peptideResults.some((r) => r === null)) {
    return null;
  }

  const validResults = peptideResults as NonNullable<
    (typeof peptideResults)[number]
  >[];
  const totalUnitsToDraw = Math.round(
    validResults.reduce((sum, r) => sum + r.unitsToDraw, 0) * 10
  ) / 10;
  const totalVolumeMl = Math.round(
    validResults.reduce((sum, r) => sum + r.volumeToDrawMl, 0) * 1000
  ) / 1000;
  const exceedsSyringe = totalUnitsToDraw > syringeSize;

  return {
    peptideResults: validResults,
    totalUnitsToDraw,
    totalVolumeMl,
    exceedsSyringe,
  };
};

export const calculateReconstitution = ({
  peptideAmountMg,
  desiredDoseMcg,
  desiredUnits,
}: {
  peptideAmountMg: number;
  desiredDoseMcg: number;
  desiredUnits: number;
}) => {
  if (peptideAmountMg <= 0 || desiredDoseMcg <= 0 || desiredUnits <= 0) {
    return null;
  }

  // desiredUnits = volumeMl * 100, so volumeMl = desiredUnits / 100
  // concentration = desiredDoseMcg / volumeMl
  // waterMl = (peptideAmountMg * 1000) / concentration
  const volumePerDoseMl = desiredUnits / 100;
  const concentrationMcgPerMl = desiredDoseMcg / volumePerDoseMl;
  const waterToAddMl = (peptideAmountMg * 1000) / concentrationMcgPerMl;

  return {
    waterToAddMl: Math.round(waterToAddMl * 1000) / 1000,
    concentrationMcgPerMl: Math.round(concentrationMcgPerMl * 100) / 100,
    dosesPerVial: Math.floor((peptideAmountMg * 1000) / desiredDoseMcg),
  };
};
