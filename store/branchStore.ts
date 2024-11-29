import {create} from "zustand";

interface BranchStore {
  branchEmail: string;
  setBranchEmail: (email: string) => void;
}

const useBranchStore = create<BranchStore>((set) => ({
  branchEmail: "",
  setBranchEmail: (email) => set({ branchEmail: email }),
}));

export default useBranchStore;
