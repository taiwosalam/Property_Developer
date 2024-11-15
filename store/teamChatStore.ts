import { create } from "zustand";

interface TeamChatState {
  isAddMember: boolean;
  isDeleteMember: boolean;
  userNameToDelete: string | null;
  openAddMember: () => void;
  closeAddMember: () => void;
  openDeleteMember: () => void;
  closeDeleteMember: () => void;
  setUserNameToDelete: (name: string) => void;
}

export const useTeamChatStore = create<TeamChatState>((set) => ({
  isAddMember: false,
  isDeleteMember: false,
  userNameToDelete: null,
  openAddMember: () => set({ isAddMember: true }),
  closeAddMember: () => set({ isAddMember: false }),
  openDeleteMember: () => set({ isDeleteMember: true }),
  closeDeleteMember: () =>
    set({ isDeleteMember: false, userNameToDelete: null }),
  setUserNameToDelete: (name) => set({ userNameToDelete: name }),
}));
