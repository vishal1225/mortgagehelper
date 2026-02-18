export const STATE_OPTIONS = ["VIC", "NSW"] as const;
export const SPECIALTY_OPTIONS = ["refinance", "self_employed"] as const;

export type BrokerState = (typeof STATE_OPTIONS)[number];
export type BrokerSpecialty = (typeof SPECIALTY_OPTIONS)[number];

export function isBrokerState(value: string): value is BrokerState {
  return STATE_OPTIONS.includes(value as BrokerState);
}

export function isBrokerSpecialty(value: string): value is BrokerSpecialty {
  return SPECIALTY_OPTIONS.includes(value as BrokerSpecialty);
}
