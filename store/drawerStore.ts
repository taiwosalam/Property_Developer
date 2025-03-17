import { create } from 'zustand';

interface LegalOption {
  title: string;
  amount: number;
  description: string;
  id: number;
}

interface DrawerStore {
  isDrawerOpen: boolean;
  selectedLegalOption: LegalOption | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  setSelectedLegalOption: (option: LegalOption) => void;
}

export const useDrawerStore = create<DrawerStore>((set) => ({
  isDrawerOpen: false,
  selectedLegalOption: null,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  setSelectedLegalOption: (option) => set({ selectedLegalOption: option }),
}));