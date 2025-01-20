import { getRoleFromCookie } from '@/utils/getRole';
import { create } from 'zustand'; 

interface RoleState {
  role: string;
  setRole: (role: string) => void;
  loadRole: () => Promise<void>;
}

const useRoleStore = create<RoleState>((set) => ({
  role: '',
  setRole: (role) => set({ role }),
  loadRole: async () => {
    const role = await getRoleFromCookie();
    set({ role: role || '' });
  },
}));

export default useRoleStore;
