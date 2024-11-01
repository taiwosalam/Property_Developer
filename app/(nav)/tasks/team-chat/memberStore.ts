import create from 'zustand';

interface StoreState {
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
}

export const useMemberStore = create<StoreState>((set) => ({
  selectedMembers: [],
  setSelectedMembers: (members) => set({ selectedMembers: members }),
}));