import { create } from "zustand";

// Define Zustand store type
type ChatStore = {
  data: Record<string, any>; // Stores any key-value pairs
  setChatData: (key: string, value: any) => void;
};

// Create Zustand store
export const useChatStore = create<ChatStore>((set) => ({
  data: {}, // Initial empty store
  setChatData: (key, value) => set((state) => ({ data: { ...state.data, [key]: value } })),
}));
