import type { LeadSegment, ReadinessScore } from "@/lib/leads";

type SharedReadinessInputs = {
  creditScoreBand: "excellent" | "good" | "fair" | "poor";
  depositBand: "gt20" | "10to20" | "lt10";
};

type RefinanceReadinessInputs = SharedReadinessInputs & {
  incomeStable: "yes" | "mostly" | "no";
};

type SelfEmployedReadinessInputs = SharedReadinessInputs & {
  businessYears: "3plus" | "2to3" | "1to2" | "lt1";
  hasTwoYearsFinancials: "yes" | "no";
};

function scoreCreditBand(value: SharedReadinessInputs["creditScoreBand"]) {
  if (value === "excellent") return 3;
  if (value === "good") return 2;
  if (value === "fair") return 1;
  return 0;
}

function scoreDepositBand(value: SharedReadinessInputs["depositBand"]) {
  if (value === "gt20") return 3;
  if (value === "10to20") return 2;
  return 0;
}

function finalizeScore(points: number): ReadinessScore {
  if (points >= 7) return "Green";
  if (points >= 4) return "Amber";
  return "Red";
}

export function calculateRefinanceReadiness(
  input: RefinanceReadinessInputs,
): ReadinessScore {
  let points = scoreCreditBand(input.creditScoreBand) + scoreDepositBand(input.depositBand);

  if (input.incomeStable === "yes") points += 2;
  else if (input.incomeStable === "mostly") points += 1;

  return finalizeScore(points);
}

export function calculateSelfEmployedReadiness(
  input: SelfEmployedReadinessInputs,
): ReadinessScore {
  let points = scoreCreditBand(input.creditScoreBand) + scoreDepositBand(input.depositBand);

  if (input.businessYears === "3plus") points += 2;
  else if (input.businessYears === "2to3") points += 1;

  if (input.hasTwoYearsFinancials === "yes") points += 2;

  return finalizeScore(points);
}

export function calculateReadinessScore(
  segment: LeadSegment,
  input: RefinanceReadinessInputs | SelfEmployedReadinessInputs,
): ReadinessScore {
  if (segment === "refinance") {
    return calculateRefinanceReadiness(input as RefinanceReadinessInputs);
  }

  return calculateSelfEmployedReadiness(input as SelfEmployedReadinessInputs);
}
