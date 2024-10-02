import { states } from "@/data";

export const getAllStates = (): string[] => {
  const allStates = Array.from(
    new Set(states.map((stateObj) => Object.keys(stateObj)[0]))
  ).sort();
  // console.log(allStates.length);
  return allStates;
};

export const getLocalGovernments = (stateName: string): string[] => {
  const state = states.find(
    (stateObj) => Object.keys(stateObj)[0] === stateName
  );
  if (state) {
    const stateData = state[stateName as keyof typeof state]; // Use type assertion here
    return Array.from(new Set(Object.keys(stateData))).sort();
  }
  return [];
};

export const getCities = (
  stateName: string,
  localGovernment: string
): string[] => {
  const state = states.find(
    (stateObj) => Object.keys(stateObj)[0] === stateName
  );
  if (state && state[stateName][localGovernment]) {
    return Array.from(new Set(state[stateName][localGovernment])).sort();
  }
  return [];
};
