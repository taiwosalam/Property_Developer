import { create } from 'zustand';


interface TeamChatStore {
  isAddMember: boolean;
  openAddMember: () => void;
  closeAddMember: () => void;
}

export const useTeamChatStore = create<TeamChatStore>((set) => ({
  isAddMember: false,
  openAddMember: () => set({ isAddMember: true }),
  closeAddMember: () => set({ isAddMember: false }),
}));