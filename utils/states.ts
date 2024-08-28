import { states } from "@/data";

interface StateData {
  [localGovernment: string]: string[];
}

interface State {
  [stateName: string]: StateData;
}

export const getAllStates = (): string[] => {
  return states.map((stateObj) => Object.keys(stateObj)[0]);
};

export const getLocalGovernments = (stateName: string): string[] => {
  const state = states.find(
    (stateObj) => Object.keys(stateObj)[0] === stateName
  );
  if (state) {
    const stateData = state[stateName as keyof typeof state]; // Use type assertion here
    return Object.keys(stateData);
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
    return state[stateName][localGovernment];
  }
  return [];
};
