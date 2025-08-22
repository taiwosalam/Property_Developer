import { create } from "zustand";

interface PermissionState {
  permissions: Record<string, string[]>;
  isLoading: boolean;
  error: string | null;
  setPermissions: (permissions: Record<string, string[]>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePermissionsStore = create<PermissionState>((set) => ({
  permissions: {},
  isLoading: false,
  error: null,
  setPermissions: (permissions) => set({ permissions }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
