// store/soundStore.ts
import { create } from "zustand";

interface SoundStore {
    selectedSound: string;
    setSelectedSound: (path: string) => void;
    savePreference: (callback?: () => void) => void;
}

export const useSoundStore = create<SoundStore>((set, get) => ({
    selectedSound: "/sounds/mixkit-arrow-whoosh-1491.mp3",
    setSelectedSound: (path) => set({ selectedSound: path }),
    savePreference: (callback) => {
        const { selectedSound } = get();
        localStorage.setItem("preferredSound", selectedSound);
        if (callback) callback();
    },
}));
