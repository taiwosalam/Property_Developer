import { states } from "@/data";

export const getAllStates = (): string[] => {
  const allStates = Array.from(
    new Set(states.map((stateObj) => Object?.keys(stateObj)[0]))
  ).sort();
  // console.log(allStates.length);
  return allStates;
};

export const getLocalGovernments = (stateName: string): string[] => {
  const state = states.find(
    (stateObj) =>
      Object.keys(stateObj)[0]?.toLowerCase() === stateName?.toLowerCase()
  );
  if (state) {
    const stateKey = Object.keys(state)[0]; // Get the actual key from the state object
    const stateData = state[stateKey as keyof typeof state]; // Use type assertion here
    return Array.from(new Set(Object.keys(stateData))).sort();
  }
  return [];
};

export const getCities = (
  stateName: string,
  localGovernment: string
): string[] => {
  const state = states.find(
    (stateObj) =>
      Object.keys(stateObj)[0]?.toLowerCase() === stateName?.toLowerCase()
  );

  if (state) {
    const stateKey = Object.keys(state)[0];
    const stateData = state[stateKey as keyof typeof state];
    const localGovtKey = Object.keys(stateData).find(
      (key) => key?.toLowerCase() === localGovernment?.toLowerCase()
    );
    if (localGovtKey) {
      return Array.from(new Set(stateData[localGovtKey])).sort();
    }
  }
  return [];
};

// GET ALL
export const getAllLocalGovernments = (): string[] => {
  const allLGAs: string[] = [];
  getAllStates().forEach((stateName) => {
    const lgas = getLocalGovernments(stateName);
    allLGAs.push(...lgas);
  });
  return Array.from(new Set(allLGAs)).sort();
};

export const getAllCities = (): string[] => {
  const allCities: string[] = [];
  getAllStates().forEach((stateName) => {
    const lgas = getLocalGovernments(stateName);
    lgas.forEach((lga) => {
      const cities = getCities(stateName, lga);
      allCities.push(...cities);
    });
  });
  return Array.from(new Set(allCities)).sort();
};
