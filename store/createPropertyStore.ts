// store/propertyRequestStore.ts
import { create } from "zustand";

interface PropertyRequestState {
  minBudget: number | null;
  maxBudget: number | null;
  error: string | null; // This can be used to store error messages if needed
  setMinBudget: (value: number | null) => void;
  setMaxBudget: (value: number | null) => void;
  resetBudgets: () => void; // Added reset method
}

export const usePropertyRequestStore = create<PropertyRequestState>((set) => ({
  minBudget: null,
  maxBudget: null,
  error: null, // Initialize error state
  setMinBudget: (value) => set({ minBudget: value }),
  setMaxBudget: (value) => set({ maxBudget: value }),

  // Method to reset budgets
  resetBudgets: () => set({ minBudget: null, maxBudget: null, error: null }),
}));
