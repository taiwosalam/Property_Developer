import { create } from 'zustand';

interface SubscriptionState {
    openWarningModal: boolean;
    openSuccessModal: boolean;
    openWarning: () => void;
    closeWarning: () => void;
    openSuccess: () => void;
    closeSuccess: () => void;
    openEditModal: boolean;
    openEdit: () => void;
    closeEdit: () => void;
  }

const useSubscriptionStore = create<SubscriptionState>((set) => ({
  openWarningModal: false,
  openSuccessModal: false,
  openEditModal: false,
  openWarning: () => set({ openWarningModal: true }),
  closeWarning: () => set({ openWarningModal: false }),
  openSuccess: () => set({ openSuccessModal: true }),
  closeSuccess: () => set({ openSuccessModal: false }),
  openEdit: ()=> set({ openEditModal: true }),
  closeEdit: ()=> set({ openEditModal: false }),
}));

export default useSubscriptionStore;