import { create } from 'zustand';

type BranchState = {
  [key: string]: string; // Dynamically store key-value pairs
};

type BranchStore = {
  branch: BranchState;
  setBranch: (key: string, value: any) => void;
};

const useBranchStore = create<BranchStore>((set) => {
  // Load initial state from localStorage
  const storedBranch = typeof window !== 'undefined' ? localStorage.getItem('branch') : null;
  const initialBranchState = storedBranch ? JSON.parse(storedBranch) : {};

  return {
    branch: initialBranchState, // Initial state loaded from localStorage
    setBranch: (key, value) =>
      set((state) => {
        // Prevent redundant state updates
        if (state.branch[key] === value) {
          return state;
        }
        const updatedBranch = {
          ...state.branch,
          [key]: value,
        };
        // Save the updated branch state to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('branch', JSON.stringify(updatedBranch));
        }
        return { branch: updatedBranch };
      }),
  };
});

export default useBranchStore;
